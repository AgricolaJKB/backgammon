<script>
  import { currentTurn, gameState, moves } from "../store.js";
  import initial from "../initial.json";

  export let moveChecker;
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
    const { state, moves, throw: _throw, player } = infoByTurn[turn - 1];
    console.log(infoByTurn[turn], turn);
    state.forEach((t) => {
      moveChecker(t.id, t.position);
    });
    forcedPlayer = player;
    forcedTurn = turn;
    forcedDices = [_throw.dice1, _throw.dice2];
    moves.forEach((m) => {
      document.getElementById(`${m.checker_id}`).children[0].style.border =
        "3px solid red";
      moveChecker(m.checker_id, m.end);
    });
  };

  const handleMouseOut = () => {
    const { moves: mvs, player } = infoByTurn[lastViewedTurn - 1];
    mvs.forEach((m) => {
      document.getElementById(`${m.checker_id}`).children[0].style.border =
        "1px solid black";
    });
    $gameState.moves.forEach((m) => {
      moveChecker(m.checker_id, m.end);
    });
    if ($moves) {
      Object.values($moves).forEach((m) => {
        moveChecker(m.checker_id, m.end);
      });
    }
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
      on:mouseenter={() => handleMouseEnter(i + 1)}
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
        flex-grow: 2;
        // height: 100%;
        // background-color: rebeccapurple;
      }
    }
  }
</style>
