<script>
  import Dice from "./Dice.svelte";
  import Draggable from "./Draggable.svelte";
  import {
    currentPlayer,
    currentRoll,
    moves,
    user,
    gameId,
    onTheMove,
  } from "../store.js";
  import { rollDices, insertMoves } from "../api.js";

  let dices = $currentRoll;

  $: {
    dices = $currentRoll;
  }

  const roll = async () => {
    dices = await rollDices($gameId);
  };

  const endTurn = async () => {
    const okay = await insertMoves($gameId, Object.values($moves));
    console.log(okay);
  };
</script>

<div class="container">
  <div class="info {$currentPlayer}">
    <p>{$currentPlayer === "white" ? "Weiß" : "Schwarz"} ist am Zug</p>
  </div>

  <div class="dice-container">
    {#if !dices[0] && !dices[1] && $onTheMove}
      <span>Zieh die Würfel mit der Maus, um zu würfeln</span>
    {/if}
    <Draggable
      on:dragend={roll}
      maxDrag={[150, 150]}
      resetAfterDrag
      deactivated={dices[0] || !$onTheMove}
    >
      <div class="dices">
        <Dice number={dices[0]} />
        <Dice number={dices[1]} />
      </div>
    </Draggable>
  </div>

  {#if dices[0] && dices[1] && $onTheMove}
    <div class="actions">
      <button on:click={endTurn}>Zug beenden</button>
    </div>
  {/if}
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

  .dice-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    color: #c3c3c3;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
