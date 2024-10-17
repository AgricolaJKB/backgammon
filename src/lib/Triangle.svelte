<script>
  export let color;

  let w, h;
</script>

<div bind:clientWidth={w} bind:clientHeight={h} class="container">
  <svg>
    <polygon points="0,0 {w},0 {w / 2},{h}" fill={color} />
  </svg>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    // background-color: #c3c3c3;
  }
  svg {
    width: 100%;
    height: 100%;
  }
</style>
