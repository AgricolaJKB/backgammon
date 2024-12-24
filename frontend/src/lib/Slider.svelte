<!-- SLIDER COMPONENT -->

<script>
  /**
   * @typedef {Object} Props
   * @property {number} [min]
   * @property {number} [max]
   * @property {number} [step]
   * @property {number} [value]
   * @property {(value: { value: number }) => void} [onChange]
   */

  /** @type {Props} */
  let {
    min = 0,
    max = 100,
    step = 1,
    value = $bindable(0),
    onChange = () => {}
  } = $props();

  let slider = $state();
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
      onChange({ value });
    }
  }

  function onMouseUp() {
    dragging = false;
  }
</script>

<div
  bind:this={slider}
  class="slider"
  onmousedown={onMouseDown}
  onmousemove={onMouseMove}
  onmouseup={onMouseUp}
  role="slider"
  tabindex="0"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value}
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
