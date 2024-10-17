<script>
  import Triangle from "./Triangle.svelte";

  export let startSettings = {};
</script>

<!-- 1 board, 2 sides, 12 triangles per side  -->
<div class="board">
  {#each ["upper", "lower"] as side}
    <div class="side {side}">
      {#each Array.from({ length: 12 }) as _, i}
        <!-- <div class="triangle" style="left: {i * (100 / 12)}%"> -->
        <div class="triangle" style="width: {100 / 12}%">
          <Triangle color={i % 2 === 0 ? "darkgrey" : "grey"} />
          <div class="checkerContainer">
            {#if startSettings[i]}
              {#each Array.from({ length: startSettings[i].checkers }) as _}
                <div
                  class="checker"
                  style="background-color: {startSettings[i]
                    .color}; border: 1px solid black"
                />
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  .board {
    position: relative;
    width: 90vw;
    height: 90dvh;
    background-color: #c3c3c3;
  }
  .side {
    position: absolute;
    width: calc(100% - 4rem);
    height: calc(50% - 3rem);
    background-color: white;
    margin: 2rem;
    display: flex;
    flex-direction: row-reverse;

    &.upper {
      top: 0;
    }
    &.lower {
      bottom: 0;
      transform: scaleY(-1);
    }
  }
  .triangle {
    position: relative;
    height: calc(100% - 1rem);
    margin: 0.5rem;
  }
  .checkerContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
  .checker {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin: 0.5rem;
    cursor: pointer;
  }
</style>
