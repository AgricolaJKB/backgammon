<script>
  import Triangle from "./Triangle.svelte";
  import Checker from "./Checker.svelte";
  import SideBoard from "./SideBoard.svelte";
  import Box from "./Box.svelte";

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
    triangleCentroids[end].checkersContainer.appendChild(
      document.getElementById(checker_id)
    );
    updateTriangleCentroids();
  };

  let triangleCentroids;

  const updateTriangleCentroids = () => {
    const triangles = document.querySelectorAll(".triangle");
    triangleCentroids = Array.from(triangles).map((triangle) => {
      const { left, top, width, height } = triangle.getBoundingClientRect();
      const container = triangle.querySelector(".checkerContainer");
      let occupiedBy = null;
      let length = 0;
      if (container.children.length) {
        occupiedBy = container.children[0].children[0].classList[1];
        length = container.children.length;
      }
      return {
        x: left + width / 2,
        y: top + height / 2,
        triangle: triangle,
        checkersContainer: triangle.querySelector(".checkerContainer"),
        occupiedBy,
        length,
      };
    });
    const hitAreas = document.querySelectorAll(".hit");
    triangleCentroids = triangleCentroids.concat(
      Array.from(hitAreas).map((hit) => {
        const { left, top, width, height } = hit.getBoundingClientRect();
        return {
          x: left + width / 2,
          y: top + height / 2,
          triangle: hit,
          checkersContainer: hit,
          occupiedBy: hit.classList[0],
          length: new Array(...hit.children).filter((el) =>
            el.classList.contains("draggable")
          ).length,
        };
      })
    );
    const outAreas = document.querySelectorAll(".out");
    triangleCentroids = triangleCentroids.concat(
      Array.from(outAreas).map((out) => {
        const { left, top, width, height } = out.getBoundingClientRect();
        return {
          x: left + width / 2,
          y: top + height / 2,
          triangle: out,
          checkersContainer: out,
          occupiedBy: out.classList[0],
          length: new Array(...out.children).filter((el) =>
            el.classList.contains("draggable")
          ).length,
        };
      })
    );
  };

  onMount(() => {
    updateTriangleCentroids();
  });

  $: {
    // move checkers to the right position
    const { moves } = $gameState || {};
    if (moves) {
      for (const move of moves) {
        moveChecker(move.checker_id, move.end);
      }
    }
    updateTriangleCentroids();
  }
</script>

<div class="side-area">
  <SideBoard />
  <div class="hit-area">
    <span class="label">Geschlagen</span>
    <div class="boxes">
      {#each ["white", "black"] as color, i}
        <!-- <div class="{color} checkerContainer hit box" data-position={24 + i}>
          <span class="label {color}"></span>
        </div> -->
        <Box
          position={24 + i}
          {color}
          type="hit"
          numberOfChildren={triangleCentroids &&
            triangleCentroids[24 + i]?.length}
        />
      {/each}
    </div>
  </div>
  <div class="out-area">
    <span class="label">Im Ziel</span>
    <div class="boxes">
      {#each ["white", "black"] as color, i}
        <!-- <div class="{color} checkerContainer out box" data-position={26 + i}>
          <span class="label {color}"></span>
        </div> -->
        <Box
          position={26 + i}
          {color}
          type="out"
          numberOfChildren={triangleCentroids &&
            triangleCentroids[26 + i]?.length}
        />
      {/each}
    </div>
  </div>
</div>
<div class="main-area">
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
            <div class="checkerContainer {side === 1 && 'reversed'} ">
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
</div>
<div class="moving-checker-cache"></div>

<!-- <CheckerOverlay bind:addCheckerContainer></CheckerOverlay> -->

<style lang="scss">
  .moving-checker-cache {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    // :global(.draggable) {
    //   z-index: 20000;
    // }
  }
  .main-area {
    width: 65%;
    height: 100%;
    float: left;
  }

  .side-area {
    width: 25%;
    height: 90dvh;
    max-height: 100%;
    float: right;
    align-self: flex-start;

    display: grid;
    grid-template-rows: auto 1fr 1fr;
    gap: 1rem;

    .hit-area,
    .out-area {
      display: flex;
      flex-direction: column;

      .label {
        font-weight: bold;
        margin-bottom: 0.5rem;
        text-align: center;
      }

      .boxes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        flex-grow: 1;
      }
    }
  }

  .marker {
    position: fixed !important;
    width: 1rem;
    height: 1rem;
    background-color: red;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
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
  :global(.checkerContainer) {
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
