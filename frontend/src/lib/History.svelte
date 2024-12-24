<script>
  import { currentTurn, gameState, moves } from "../store.js";
  import initial from "../initial.json";

  let {
    forcedCheckerPositions = $bindable(),
    forcedPlayer = $bindable(),
    forcedTurn = $bindable(),
    forcedDices = $bindable()
  } = $props();

  let infoByTurn = $state([]);

  $effect(() => {
    infoByTurn = Array.from({ length: $currentTurn - 1 }, (_, i) => {
      const movesBefore = $gameState.moves.filter((m) => m.turn < i + 1);
      const stateBefore = initial.map((t) => {
        const lastMove = movesBefore
          .reverse()
          .find((m) => m.checker_id === t.id);
        if (lastMove) {
          return {
            ...t,
            position: lastMove.end
          };
        }
        return t;
      });
      return {
        state: stateBefore,
        moves: $gameState.moves.filter((m) => m.turn === i + 1),
        throw: $gameState.throws.find((t) => t.turn === i + 1),
        player: i % 2 === 0 ? "white" : "black"
      };
    });
  });

  let lastViewedTurn;

  const handleMouseEnter = (turn) => {
    lastViewedTurn = turn;
    const { state, moves, throw: _throw, player } = infoByTurn[turn];

    forcedPlayer = player;
    forcedTurn = turn + 1;
    forcedDices = [_throw.dice1, _throw.dice2];
    forcedCheckerPositions = $gameState.history[turn];
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
      role="button"
      tabindex="0"
      onmouseenter={() => handleMouseEnter(i)}
      onmouseout={() => handleMouseOut()}
      onfocus={() => handleMouseEnter(i)}
      onblur={() => handleMouseOut()}
    ></div>
  {/each}
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 1.5rem;
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
