<script>
  /**
   * @typedef {Object} Props
   * @property {any} [maxDrag]
   * @property {boolean} [resetAfterDrag]
   * @property {boolean} [deactivated]
   * @property {boolean} [invertX]
   * @property {boolean} [invertY]
   * @property {any} [el]
   * @property {any} [id]
   * @property {() => void} [onDragStart]
   * @property {() => void} [onDragEnd]
   * @property {() => void} [reset]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    maxDrag = [Infinity, Infinity],
    resetAfterDrag = false,
    deactivated = false,
    invertX = false,
    invertY = false,
    el = $bindable(),
    id = null,
    onDragStart = () => {},
    onDragEnd = () => {},
    reset = $bindable(() => {}),
    children
  } = $props();

  let left = $state(0);
  let top = $state(0);

  let lastTouchX = 0;
  let lastTouchY = 0;

  let moving = $state(false);

  function onMouseDown(e) {
    console.log(e, "onMouseDown");
    if (deactivated) return;
    moving = true;
    // dispatch("dragstart");
    if (onDragStart) onDragStart();
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
    // dispatch("dragend");
    if (onDragEnd) onDragEnd();
    if (resetAfterDrag) {
      left = 0;
      top = 0;
    }
  }

  reset = () => {
    left = 0;
    top = 0;
  };
</script>

<div
  {id}
  bind:this={el}
  role="button"
  tabindex="0"
  onmousedown={onMouseDown}
  onmouseup={onMouseUp}
  ontouchstart={onMouseDown}
  ontouchend={onMouseUp}
  style="transform: translate({left}px, {top}px)"
  class="draggable {deactivated && 'deactivated'} {moving && 'moving'}"
>
  {@render children?.()}
</div>

<svelte:window onmousemove={onMouseMove} ontouchmove={onMouseMove} />

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
