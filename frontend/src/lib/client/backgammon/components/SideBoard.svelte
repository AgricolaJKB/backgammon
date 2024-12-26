<script>
  import Dice from "./Dice.svelte";
  import Draggable from "./Draggable.svelte";
  import History from "./History.svelte";
  import {
    currentPlayer,
    currentRoll,
    currentTurn,
    moves,
    user,
    gameId,
    onTheMove,
    gameState
  } from "../store.js";
  import { onMount } from "svelte";
  import { rollDices, insertMoves } from "../api.js";

  let { forcedCheckerPositions = $bindable(null) } = $props();

  let cache = $state();

  let forcedTurn = $state();
  let forcedPlayer = $state();
  let forcedDices = $state();

  let playerToDisplay = $derived(forcedPlayer || $currentPlayer);
  let turnToDisplay = $derived(forcedTurn || $currentTurn);
  let isForced = $derived(forcedPlayer && forcedTurn);

  let dices = $state([0, 0]);

  onMount(() => {
    cache = document.querySelector(".moving-checker-cache");
  });

  $effect(() => {
    dices = forcedDices || $currentRoll;
  });

  const roll = async () => {
    dices = await rollDices($gameId);
  };

  const endTurn = async () => {
    const okay = await insertMoves(
      $gameId,
      Object.values($moves).map((m) => {
        // remove usedDice property
        const { usedDice, ...rest } = m;
        return rest;
      })
    );
    if (okay === "ok") {
      $moves = [];
    }
  };
</script>

<div class="container">
  <div class="header">
    <div class="info {playerToDisplay}">
      <p class="player">
        {playerToDisplay === "white" ? "Weiß" : "Schwarz"}
        {isForced ? "war" : "ist"} am Zug
      </p>
      <p class="turn">Zug {turnToDisplay}</p>
    </div>
    <History
      bind:forcedCheckerPositions
      bind:forcedPlayer
      bind:forcedTurn
      bind:forcedDices
    />
  </div>

  <div class="dice-container">
    {#if !dices[0] && !dices[1] && $onTheMove}
      <span>Zieh die Würfel mit der Maus,<br />um zu würfeln</span>
    {/if}
    <Draggable
      onDragEnd={roll}
      maxDrag={[150, 150]}
      deactivated={!!dices[0] || !$onTheMove}
    >
      <!-- {cache} -->
      <div class="dices">
        <Dice number={dices[0]} />
        <Dice number={dices[1]} />
      </div>
    </Draggable>
  </div>

  {#if dices[0] && dices[1] && $onTheMove}
    <div class="actions">
      <button onclick={endTurn}>Zug beenden</button>
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

  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 0.25rem;
  }

  .info {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 2rem;

    p {
      margin: 0;
      font-weight: bold;
      &.turn {
        font-size: 0.75rem;
      }
    }

    &.black {
      color: white;
      background-color: black;
      border: 2px solid black;
      .turn {
        color: rgb(220, 220, 220);
      }
    }
    &.white {
      color: black;
      background-color: white;
      border: 2px solid black;
      .turn {
        color: darkslategray;
      }
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
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    color: #c3c3c3;

    span {
      text-align: center;
      font-size: 0.75rem;
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
</style>
