import { readable, derived } from "svelte/store";

const BACKEND_URL = "http://localhost:8000";

const getGameState = async (id = "test") => {
  const response = await fetch(`${BACKEND_URL}/game/${id}`);
  const data = await response.json();
  return data;
};

const rollDices = async (id = "test") => {
  const response = await fetch(`${BACKEND_URL}/game/${id}/roll`);
  const data = await response.json();
  const roll = data.throws[data.throws.length - 1];
  return [roll.dice1, roll.dice2];
};

const gameState = readable(null, (set, update) => {
  const interval = setInterval(async () => {
    const state = await getGameState();
    set(state);
  }, 1000);

  return () => clearInterval(interval);
});

const currentPlayer = derived(gameState, ($gameState) => {
  if (!$gameState) return null;
  const lastPlayer =
    $gameState.turns[$gameState.turns.length - 1]?.player || "b";
  return lastPlayer === "w" ? "black" : "white";
});

const currentRoll = derived(gameState, ($gameState) => {
  if (!$gameState) return [null, null];
  const lastRoll = $gameState.throws[$gameState.throws.length - 1];
  return [lastRoll?.dice1 || null, lastRoll?.dice2 || null];
});

export { gameState, currentPlayer, currentRoll, rollDices };
