<script>
  export let color;

  export let left = 0;
  export let top = 0;

  let moving = false;
  let checker;

  function onMouseDown() {
    moving = true;
  }

  function onMouseMove(e) {
    if (moving) {
      left += e.movementX;
      top += e.movementY;
    }
  }

  function onMouseUp() {
    moving = false;
    // log position
    console.log(left, top);
    // log position on board
    console.log(checker.getBoundingClientRect());
    // move back to original position
    // left = 0;
    // top = 0;
  }
</script>

<div
  class="checker"
  style="background-color: {color}; border: 1px solid black; transform: translate({left}px, {top}px)"
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  bind:this={checker}
/>

<svelte:window on:mousemove={onMouseMove} />

<style>
  .checker {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin: 0.5rem;
    cursor: pointer;
    z-index: 2000;
  }
</style>
