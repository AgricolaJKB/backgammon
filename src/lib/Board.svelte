<script>
  import Triangle from "./Triangle.svelte";
  import Checker from "./Checker.svelte";

  export let startSettings = {};
</script>

<!-- 1 board, 2 sides, 12 triangles per side  -->
<div class="board">
  {#each Array.from({ length: 2 }) as _, side}
    <div class="side {side === 0 ? 'upper' : 'lower'}">
      {#each Array.from({ length: 12 }) as _, i}
        <!-- <div class="triangle" style="left: {i * (100 / 12)}%"> -->
        <div class="triangle" style="width: {100 / 12}%">
          <Triangle
            color={i % 2 === 0 ? "darkgrey" : "grey"}
            reversed={side === 0}
          />
          <div class="checkerContainer {side === 1 && 'reversed'}">
            {#if startSettings[i + side * 12]}
              {#each Array.from( { length: startSettings[i + side * 12].checkers } ) as _}
                <Checker color={startSettings[i + side * 12].color} />
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
    max-width: 100%;
    max-height: 100%;
    background-color: darkgrey;
  }
  .side {
    position: absolute;
    width: calc(100% - 4rem);
    height: calc(50% - 3rem);
    background-color: white;
    margin: 2rem;
    display: flex;

    &.upper {
      top: 0;
      flex-direction: row-reverse;

      & > div {
        &:nth-child(6) {
          margin-left: 1.5rem;
        }
        &:nth-child(7) {
          margin-right: 1.5rem;
        }
      }
    }
    &.lower {
      bottom: 0;

      & > div {
        &:nth-child(6) {
          margin-right: 1.5rem;
        }
        &:nth-child(7) {
          margin-left: 1.5rem;
        }
      }
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

    &.reversed {
      flex-direction: column-reverse;
      justify-content: end;
    }
  }
</style>
