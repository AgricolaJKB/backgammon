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
  import init from "../initial.json";

  let forcedCheckerPositions = null;

  let checkerPositions = init.reduce((acc, curr) => {
    if (!acc[curr.position]) {
      acc[curr.position] = [];
    }
    acc[curr.position].push({ id: curr.id, color: curr.color });
    return acc;
  }, {});

  $: _checkerPositions = forcedCheckerPositions || checkerPositions;
  $: console.log("checker", _checkerPositions);
  const checkersById = init.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const moveChecker = (id, from, to) => {
    const checker = checkersById[id];
    checkerPositions[from] = checkerPositions[from].filter(
      (c) => c.id !== checker.id
    );
    if (!checkerPositions[to]) {
      checkerPositions[to] = [];
    }
    // case 1: move to empty position
    if (!checkerPositions[to].length) {
      checkerPositions[to].push(checker);
      return;
    }
    // case 2: move to position with same color
    if (checkerPositions[to][0].color === checker.color) {
      checkerPositions[to].push(checker);
      return;
    }
    // case 3: move to position with one checker of opposite color
    if (checkerPositions[to].length === 1) {
      moveChecker(checkerPositions[to][0].id, to, `hit-area-${checker.color}`);
      checkerPositions[to].push(checker);
      return;
    }
  };

  const getClosestContainer = ({ x, y }) => {
    const containersCentroids = [
      ...document.querySelectorAll(".checkerContainer"),
    ].map((container) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      return {
        x: left + width / 2,
        y: top + height / 2,
        id: container.dataset.position,
      };
    });
    const closestContainer = containersCentroids.reduce(
      (acc, curr) => {
        const distance = Math.sqrt(
          Math.pow(x - curr.x, 2) + Math.pow(y - curr.y, 2)
        );
        if (distance < acc.distance) {
          return { distance, ...curr };
        }
        return acc;
      },
      { distance: Infinity, id: null }
    );
    return closestContainer.id;
  };

  const updateCheckerPosition = (e) => {
    const { checker_id, start, coordinates } = e.detail;
    console.log("updateCheckerPosition", checker_id, start, coordinates);
    const end = getClosestContainer(coordinates);
    if (start === end) return;
    const data = {
      checker_id,
      start,
      end,
    };
    $moves = { ...$moves, [checker_id]: data };
    moveChecker(checker_id, start, end);
  };

  $: {
    // move checkers to the right position
    const { moves } = $gameState || {};
    if (moves) {
      for (const move of moves) {
        moveChecker(move.checker_id, move.start, move.end);
      }
    }
  }
</script>

<div class="side-area">
  <SideBoard bind:forcedCheckerPositions />
  <div class="hit-area">
    <span class="label">Geschlagen</span>
    <div class="boxes">
      {#each ["white", "black"] as color, i}
        <Box position={`hit-area-${color}`} {color} type="hit">
          {#each _checkerPositions[`hit-area-${color}`] || [] as checker}
            <Checker
              {...checker}
              position={`hit-area-${color}`}
              on:move={updateCheckerPosition}
            />
          {/each}
        </Box>
      {/each}
    </div>
  </div>
  <div class="out-area">
    <span class="label">Im Ziel</span>
    <div class="boxes">
      {#each ["white", "black"] as color, i}
        <Box position={`out-area-${color}`} {color} type="out">
          {#each _checkerPositions[`hit-area-${color}`] || [] as checker}
            <Checker
              {...checker}
              position={`out-area-${color}`}
              on:move={updateCheckerPosition}
            />
          {/each}
        </Box>
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
          <div class="triangle root-triangle" style="width: {100 / 12}%">
            <Triangle
              color={i % 2 === 0 ? "darkgrey" : "grey"}
              reversed={side === 0}
            />
            <div
              class="checkerContainer {side === 1 && 'reversed'} "
              data-position={i + side * 12}
            >
              {#if _checkerPositions[i + side * 12]}
                {#each _checkerPositions[i + side * 12] as checker}
                  <Checker
                    {...checker}
                    position={i + side * 12}
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
  <!-- {#if triangleCentroids && $debug}
    {#each triangleCentroids as { x, y, triangle }, i}
      <div
        class="marker"
        style="position: fixed; top: {y}px; left: {x}px; color: white"
      >
        {triangle.dataset.position}
      </div>
    {/each}
  {/if} -->
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
