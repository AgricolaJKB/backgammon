<script>
  import Dice from "./Dice.svelte";
  import Draggable from "./Draggable.svelte";

  let currentPlayer = "white";
  let dice = [null, null];

  const throwDice = () => {
    dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
  };

  const endTurn = () => {
    currentPlayer = currentPlayer === "white" ? "black" : "white";
    dice = [null, null];
  };
</script>

<div class="container">
  <div class="info {currentPlayer}">
    <p>{currentPlayer === "white" ? "Weiß" : "Schwarz"} ist am Zug</p>
  </div>

  <Draggable
    on:dragend={throwDice}
    maxDrag={[150, 150]}
    resetAfterDrag
    deactivated={dice[0]}
  >
    <div class="dices">
      <Dice number={dice[0]} />
      <Dice number={dice[1]} />
    </div>
  </Draggable>

  <div class="actions">
    <!-- <button on:click={throwDice}>Würfeln</button> -->
    <button on:click={endTurn}>Zug beenden</button>
  </div>
</div>

<style lang="scss">
  .container {
    height: 100%;

    & > :global(*) {
      margin-bottom: 2rem;
    }
  }

  .info {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    p {
      margin: 0;
      padding: 2rem;
      font-weight: bold;
    }

    &.black {
      color: white;
      background-color: black;
      border: 2px solid black;
    }
    &.white {
      color: black;
      background-color: white;
      border: 2px solid black;
    }
  }

  .dices {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
