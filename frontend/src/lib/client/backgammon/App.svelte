<script>
  import Triangle from "./components/Triangle.svelte";
  import Checker from "./components/Checker.svelte";
  import SideBoard from "./components/SideBoard.svelte";
  import Box from "./components/Box.svelte";

  import { moves, gameState, user, debug, gameId } from "./store.js";
  import init from "./initial.json";
  import { onMount, untrack } from "svelte";
  import { getUsableDice } from "./utils.js";

  let forcedCheckerPositions = $state(null);
  let checkerPositions = $state(null);
  let checkerPositionsWithMoves = $derived.by(() => {
    if (!$moves) {
      return checkerPositions;
    }
    const positions = { ...checkerPositions };
    for (const move of $moves) {
      const { checker_id, start, end } = move;
      const checker = positions[start]?.find((c) => c.id === checker_id);
      positions[start] = positions[start]?.filter((c) => c.id !== checker_id);
      if (!positions[end]) {
        positions[end] = [];
      }
      positions[end] = [...positions[end], checker];
    }
    return positions;
  });
  let _checkerPositions = $derived(
    forcedCheckerPositions || checkerPositionsWithMoves || checkerPositions
  );

  $effect(() => {
    if ($gameState?.board) {
      checkerPositions = $gameState.board;
    }
  });

  const checkersById = init.reduce((acc, curr) => {
    acc[curr.id] = { id: curr.id, color: curr.color };
    return acc;
  }, {});

  const moveChecker = ({ checker_id: id, start, end, usedDice }) => {
    const checker = checkersById[id];
    if (
      // case 1: move to empty position
      !checkerPositionsWithMoves[end]?.length ||
      // case 2: move to position with same color
      checkerPositionsWithMoves[end][0].color === checker.color
    ) {
      $moves = [...$moves, { checker_id: id, start, end, usedDice }];
      return true;
    } else if (
      // case 3: move to position with one checker of opposite color
      checkerPositionsWithMoves[end].length === 1 &&
      checkerPositionsWithMoves[end][0].color !== checker.color
    ) {
      moveChecker({
        checker_id: checkerPositionsWithMoves[end][0].id,
        start: end,
        end: `hit-area-${checkerPositionsWithMoves[end][0].color}`,
        usedDice: []
      });
      $moves = [...$moves, { checker_id: id, start, end, usedDice }];
      return true;
    }
    return false;
  };

  let containersCentroids = $state();

  onMount(() => {
    containersCentroids = [
      ...document.querySelectorAll(".checkerContainer")
    ].map((container) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      return {
        x: left + width / 2,
        y: top + height / 2,
        id: container?.dataset?.position
      };
    });
  });

  const getClosestContainer = ({ x, y }) => {
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

  const updateCheckerPosition = ({ checker_id, start, coordinates, reset }) => {
    const checker = checkersById[checker_id];
    const end = getClosestContainer(coordinates);
    const dices = $gameState.throws[$gameState.throws.length - 1];
    const usedDice = getUsableDice({
      dices: [dices.dice1, dices.dice2],
      usedDices: $moves.map((m) => m.usedDice),
      currentMove: { start, end }
    });
    if (
      !usedDice ||
      start === end ||
      (!start.includes("hit") &&
        !start.includes("out") &&
        checker.color === "white" &&
        Number(start) > Number(end)) ||
      (!start.includes("hit") &&
        !start.includes("out") &&
        checker.color === "black" &&
        Number(start) < Number(end))
    ) {
      reset();
      return;
    }
    const move = {
      checker_id,
      start,
      end,
      usedDice: usedDice
    };
    const success = moveChecker(move);
    if (!success) {
      reset();
    }
  };
</script>

<div class="backgammon">
  <div class="side-area">
    <SideBoard bind:forcedCheckerPositions />
    <div class="hit-area">
      <span class="label">Geschlagen</span>
      <div class="boxes">
        {#each ["white", "black"] as color}
          <Box position={`hit-area-${color}`} {color} type="hit">
            {#each _checkerPositions[`hit-area-${color}`] || [] as checker}
              <Checker
                {...checker}
                position={`hit-area-${color}`}
                onMove={updateCheckerPosition}
              />
            {/each}
          </Box>
        {/each}
      </div>
    </div>
    <div class="out-area">
      <span class="label">Im Ziel</span>
      <div class="boxes">
        {#each ["white", "black"] as color}
          <Box position={`out-area-${color}`} {color} type="out">
            {#each _checkerPositions[`out-area-${color}`] || [] as checker}
              <Checker
                {...checker}
                position={`out-area-${color}`}
                onMove={updateCheckerPosition}
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
                      onMove={updateCheckerPosition}
                    />
                  {/each}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
    {#if containersCentroids && $debug}
      {#each containersCentroids as { x, y, id }, i}
        <div
          class="marker"
          style="position: fixed; top: {y}px; left: {x}px; color: white; pointer-events: none"
        >
          {id}
        </div>
      {/each}
    {/if}
  </div>
</div>
<div class="moving-checker-cache"></div>

<style lang="scss">
  .moving-checker-cache {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .backgammon {
    height: calc(100dvh - 7rem);
    max-height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .main-area {
    width: 65%;
    height: 100%;
    float: left;

    @media (max-width: 768px) {
      width: 70%;
    }
  }

  .side-area {
    width: 25%;
    height: 100%;
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

    @media (max-width: 768px) {
      width: 95vw;
      height: 95dvh;
    }

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

    @media (max-width: 768px) {
      width: calc(100% - 2rem);
      height: calc(50% - 1.5rem);
      margin: 1rem;
    }

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
