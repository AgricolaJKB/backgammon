<script>
  export let color;
  export let reversed = false;

  let w, h;
</script>

<div bind:clientWidth={w} bind:clientHeight={h} class="container">
  {#if w && h}
    <svg>
      {#if reversed}
        <polygon points="0,0 {w},0 {w / 2},{h}" fill={color} />
      {:else}
        <polygon points="0,{h} {w},{h} {w / 2},0" fill={color} />
      {/if}
    </svg>
  {/if}
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
