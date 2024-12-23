<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let maxDrag = [Infinity, Infinity];
  export let resetAfterDrag = false;
  export let deactivated = false;
  export let invertX = false;
  export let invertY = false;
  export let el = null;
  export let id = null;

  let left = 0;
  let top = 0;

  let lastTouchX = 0;
  let lastTouchY = 0;

  let moving = false;

  function onMouseDown(e) {
    console.log(e, "onMouseDown");
    if (deactivated) return;
    moving = true;
    dispatch("dragstart");
    if (e.touches) {
      lastTouchX = e.touches[0].screenX;
      lastTouchY = e.touches[0].screenY;
    }
  }

  function onMouseMove(e) {
    if (moving && !e.touches) {
      left += (invertX ? -1 : 1) * e.movementX;
      top += (invertY ? -1 : 1) * e.movementY;
    } else if (moving && e.touches) {
      const touch = e.touches[0];
      if (lastTouchX !== 0 || lastTouchY !== 0) {
        const deltaX = touch.screenX - lastTouchX;
        const deltaY = touch.screenY - lastTouchY;
        left += (invertX ? -1 : 1) * deltaX;
        top += (invertY ? -1 : 1) * deltaY;
      }
      lastTouchX = touch.screenX;
      lastTouchY = touch.screenY;

      console.log(left, top);
      e.stopPropagation();
      e.preventDefault();
    }
    if (
      maxDrag &&
      (left > maxDrag[0] ||
        left < -maxDrag[0] ||
        top > maxDrag[1] ||
        top < -maxDrag[1])
    ) {
      onMouseUp();
    }
  }

  function onMouseUp() {
    moving = false;
    dispatch("dragend");
    if (resetAfterDrag) {
      left = 0;
      top = 0;
    }
  }

  export const reset = () => {
    left = 0;
    top = 0;
  };
</script>

<div
  {id}
  bind:this={el}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:touchstart={onMouseDown}
  on:touchend={onMouseUp}
  style="transform: translate({left}px, {top}px)"
  class="draggable {deactivated && 'deactivated'} {moving && 'moving'}"
>
  <slot></slot>
</div>

<svelte:window on:mousemove={onMouseMove} on:touchmove={onMouseMove} />

<style>
  .draggable {
    cursor: pointer;
    &.deactivated {
      cursor: not-allowed;
    }
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
</style>
