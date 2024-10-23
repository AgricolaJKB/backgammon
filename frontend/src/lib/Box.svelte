<script>
  export let position;
  export let color;
  export let type;
  export let numberOfChildren;
</script>

<div class="{color} checkerContainer {type} box" data-position={position}>
  <span class="label {color}"></span>
  {#if numberOfChildren > 3}
    <span class="bottom-info">+{numberOfChildren - 3}</span>
  {/if}
</div>

<style lang="scss">
  .hit {
    background-color: darkgrey;
  }
  .out {
    background-color: rgb(159, 201, 156);
  }

  .hit,
  .out {
    position: relative;

    .label {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      height: 0.5rem;
      width: 0.5rem;
      border-radius: 50%;

      &.white {
        background-color: white;
      }
      &.black {
        background-color: black;
      }
    }
    &.checkerContainer {
      justify-content: space-evenly;
      // display only first 4 checkers
      :global(.draggable) {
        display: none !important;
        &:nth-child(-n + 4) {
          display: block !important;
        }
      }
    }

    .bottom-info {
      color: white;
    }
  }
</style>
