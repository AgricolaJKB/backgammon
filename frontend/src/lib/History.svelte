<script>
  import { currentTurn, gameState, moves } from "../store.js";
  import initial from "../initial.json";

  export let forcedCheckerPositions;
  export let forcedPlayer;
  export let forcedTurn;
  export let forcedDices;

  let infoByTurn = [];

  $: {
    infoByTurn = Array.from({ length: $currentTurn - 1 }, (_, i) => {
      const movesBefore = $gameState.moves.filter((m) => m.turn < i + 1);
      const stateBefore = initial.map((t) => {
        const lastMove = movesBefore
          .reverse()
          .find((m) => m.checker_id === t.id);
        if (lastMove) {
          return {
            ...t,
            position: lastMove.end,
          };
        }
        return t;
      });
      return {
        state: stateBefore,
        moves: $gameState.moves.filter((m) => m.turn === i + 1),
        throw: $gameState.throws.find((t) => t.turn === i + 1),
        player: i % 2 === 0 ? "white" : "black",
      };
    });
  }

  let lastViewedTurn;

  const handleMouseEnter = (turn) => {
    lastViewedTurn = turn;
    const { state, moves, throw: _throw, player } = infoByTurn[turn];
    console.log("info", infoByTurn[turn], turn);

    forcedPlayer = player;
    forcedTurn = turn + 1;
    forcedDices = [_throw.dice1, _throw.dice2];

    forcedCheckerPositions = state.reduce((acc, curr) => {
      acc[curr.position] = acc[curr.position] || [];
      // if checker has been moved, add it to the new position
      const move = moves.find((m) => m.checker_id === curr.id);
      if (!move) {
        acc[curr.position].push({ id: curr.id, color: curr.color });
      } else {
        acc[move.end] = acc[move.end] || [];
        acc[move.end].push({
          id: curr.id,
          color: curr.color,
          hasBeenMoved: true,
        });
      }
      return acc;
    }, {});
  };

  const handleMouseOut = () => {
    forcedCheckerPositions = null;
    forcedPlayer = null;
    forcedTurn = null;
    forcedDices = null;
    lastViewedTurn = null;
  };
</script>

<div class="container">
  {#each infoByTurn as info, i}
    <div
      class="info {info.player}"
      on:mouseenter={() => handleMouseEnter(i)}
      on:mouseout={() => handleMouseOut()}
    />
  {/each}
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 1.25rem;
    width: 100%;
    background-color: #c3c3c3;
    padding: 0.2rem;
    gap: 0.2rem;
    box-sizing: border-box;

    .info {
      height: 100%;
      flex-grow: 1;
      background-color: white;
      cursor: pointer;
      &.black {
        background-color: black;
      }
      &:hover {
        flex-grow: 1;
        // height: 100%;
        // background-color: rebeccapurple;
      }
    }
  }
</style>
