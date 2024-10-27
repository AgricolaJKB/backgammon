<!-- SLIDER COMPONENT -->

<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value = 0;

  let slider;
  let dragging = false;

  function onMouseDown() {
    dragging = true;
  }

  function onMouseMove(e) {
    if (dragging) {
      const rect = slider.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      value = min + percent * (max - min);
      dispatch("change", { value });
    }
  }

  function onMouseUp() {
    dragging = false;
  }
</script>

<div
  bind:this={slider}
  class="slider"
  on:mousedown={onMouseDown}
  on:mousemove={onMouseMove}
  on:mouseup={onMouseUp}
>
  <div class="track"></div>
  <div class="thumb" style="left: {((value - min) / (max - min)) * 100}%"></div>
</div>

<style lang="scss">
  .slider {
    position: relative;
    width: 100%;
    height: 10px;
    background-color: #c3c3c3;
    cursor: pointer;
  }

  .track {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #000;
    transform: translateY(-50%);
  }

  .thumb {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background-color: #000;
    border-radius: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
</style>
