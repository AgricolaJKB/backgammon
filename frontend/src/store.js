import { readable, derived, writable } from "svelte/store";
import { getGameState } from "./api";

const getUrlParam = (param) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
};

const debug = readable(false, (set) => {
  const debug = getUrlParam("debug");
  set(debug === "true");
});

const user = readable(null, (set, update) => {
  // const user = url.pathname.split("/")[2] || "white";
  const user = getUrlParam("user") || "white";
  set(user);
});

const gameId = readable(null, (set, update) => {
  // const gameId = url.pathname.split("/")[1] || "test";
  const gameId = getUrlParam("game") || "test";
  set(gameId);
});

const moves = writable({});

// server game state
const gameState = readable(null, (set, update) => {
  const gameId = getUrlParam("game") || "test";
  const interval = setInterval(async () => {
    const state = await getGameState(gameId);
    set(state);
  }, 1000);
  return () => clearInterval(interval);
});

const currentPlayer = derived(gameState, ($gameState) => {
  if (!$gameState) return null;
  const lastPlayer =
    $gameState.moves[$gameState.moves.length - 1]?.player || "b";
  return lastPlayer === "w" ? "black" : "white";
});

const currentRoll = derived(gameState, ($gameState) => {
  if (!$gameState) return [null, null];
  const lastTurn = $gameState.moves[$gameState.moves.length - 1];
  const lastRoll = $gameState.throws[$gameState.throws.length - 1];
  if (lastTurn && lastTurn.turn === lastRoll.turn) return [null, null];
  return [lastRoll?.dice1 || null, lastRoll?.dice2 || null];
});

const onTheMove = derived(
  [currentPlayer, user],
  ([$currentPlayer, $user]) => $currentPlayer === $user
);

export {
  gameState,
  currentPlayer,
  currentRoll,
  moves,
  user,
  gameId,
  debug,
  onTheMove,
};
