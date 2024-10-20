<script>
  import Triangle from "./Triangle.svelte";
  import Checker from "./Checker.svelte";
  import {
    currentPlayer,
    moves,
    gameState,
    onTheMove,
    user,
    debug,
  } from "../store.js";
  import { onMount } from "svelte";
  import init from "../initial.json";

  let startSettings = init.reduce((acc, curr) => {
    if (!acc[curr.position]) {
      acc[curr.position] = {
        checkers: [],
        color: curr.color,
      };
    }
    acc[curr.position].checkers.push(curr.id);
    return acc;
  }, {});

  const moveChecker = (id, to) => {
    const checker = document.getElementById(id);
    const toContainer = triangleCentroids[to].checkersContainer;
    toContainer.appendChild(checker);
  };

  const updateCheckerPosition = (e) => {
    const { checker_id, start, end } = e.detail;
    const data = {
      checker_id,
      start,
      end,
    };
    $moves = { ...$moves, [checker_id]: data };
  };

  let triangleCentroids;

  onMount(() => {
    // get the centroids of the triangles
    const triangles = document.querySelectorAll(".triangle");
    triangleCentroids = Array.from(triangles).map((triangle) => {
      const { left, top, width, height } = triangle.getBoundingClientRect();
      const container = triangle.querySelector(".checkerContainer");
      let occupiedBy = null;
      if (container.children.length) {
        occupiedBy = container.children[0].children[0].classList[1];
      }
      return {
        x: left + width / 2,
        y: top + height / 2,
        triangle: triangle,
        checkersContainer: triangle.querySelector(".checkerContainer"),
        occupiedBy,
      };
    });
  });

  $: {
    // move checkers to the right position
    const { moves } = $gameState || {};
    if (moves) {
      for (const move of moves) {
        moveChecker(move.checker_id, move.end);
      }
    }
  }
</script>

<!-- 1 board, 2 sides, 12 triangles per side  -->
<div class="board {$user}">
  {#each Array.from({ length: 2 }) as _, side}
    <div class="side {side === 0 ? 'upper' : 'lower'}">
      {#each Array.from({ length: 12 }) as _, i}
        <div
          class="triangle root-triangle"
          style="width: {100 / 12}%"
          data-position={$user === "white" ? i + side * 12 : i + side * 12}
        >
          <Triangle
            color={i % 2 === 0 ? "darkgrey" : "grey"}
            reversed={side === 0}
          />
          <div class="checkerContainer {side === 1 && 'reversed'}">
            {#if startSettings[i + side * 12]}
              {#each startSettings[i + side * 12].checkers as checker}
                <Checker
                  id={checker}
                  position={i + side * 12}
                  color={startSettings[i + side * 12].color}
                  draggable={startSettings[i + side * 12].color ===
                    $currentPlayer && $onTheMove}
                  {triangleCentroids}
                  invertX={$user === "black"}
                  invertY={$user === "black"}
                  on:move={updateCheckerPosition}
                />
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>
{#if triangleCentroids && $debug}
  {#each triangleCentroids as { x, y, triangle }, i}
    <div
      class="marker"
      style="position: fixed; top: {y}px; left: {x}px; color: white"
    >
      {triangle.dataset.position}
    </div>
  {/each}
{/if}

<style lang="scss">
  .marker {
    position: fixed !important;
    width: 1rem;
    height: 1rem;
    background-color: red;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  .board {
    position: relative;
    width: 90vw;
    height: 90dvh;
    max-width: 100%;
    max-height: 100%;
    background-color: darkgrey;

    &.black {
      transform: scale(-1);
    }
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
