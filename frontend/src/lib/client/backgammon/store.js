import { readable, derived, writable } from "svelte/store";
import { getGameState } from "./api";

import init from "./initial.json";

const getBoardState = (moves, turn) => {
  const initialPositionPerChecker = init.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  const filteredMoves =
    turn || turn === 0 ? moves.filter((move) => move.turn <= turn) : moves;
  const movesInTurn = filteredMoves.filter((move) => move.turn === turn);
  const lastMovesPerChecker = filteredMoves.reduce((acc, move) => {
    acc[move.checker_id] = move;
    return acc;
  }, {});
  const board = init.reduce((acc, curr) => {
    const position =
      lastMovesPerChecker[curr.id]?.end ||
      initialPositionPerChecker[curr.id].position;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push({
      id: curr.id,
      color: curr.color,
      hasBeenMoved: !!movesInTurn.find((move) => move.checker_id === curr.id)
    });
    return acc;
  }, {});
  return board;
};

const getBoardHistory = (moves) => {
  const lastTurn = moves[moves.length - 1]?.turn || 0;
  const boardHistory = Array.from({ length: lastTurn }, (_, i) => {
    return getBoardState(moves, i + 1);
  });
  return boardHistory;
};

const getUrlParam = (param) => {
  if (typeof window === "undefined") return null;
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
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const gameId = url.pathname.split("/")[1] || "test";
  // const gameId = getUrlParam("game") || "test";
  set(gameId);
});

// const moves = writable({});
const moves = writable([]);

// server game state
let lastState = null;
const gameState = readable(null, (set, update) => {
  const gameId = getUrlParam("game") || "test";
  const interval = setInterval(async () => {
    const state = await getGameState(gameId);
    if (JSON.stringify(state) === lastState) return;
    const board = getBoardState(state.moves);
    const history = getBoardHistory(state.moves);
    set({ ...state, board, history });
    lastState = JSON.stringify(state);
  }, 1000);
  return () => clearInterval(interval);
});

const currentPlayer = derived(gameState, ($gameState) => {
  if (!$gameState) return null;
  const lastPlayer =
    $gameState.moves[$gameState.moves.length - 1]?.player || "b";
  return lastPlayer === "w" ? "black" : "white";
});

const currentTurn = derived(gameState, ($gameState) => {
  if (!$gameState) return 1;
  const lastTurn = $gameState.moves[$gameState.moves.length - 1];
  const lastRoll = $gameState.throws[$gameState.throws.length - 1];
  if (lastTurn && lastTurn.turn === lastRoll.turn) return lastRoll.turn + 1;
  return lastRoll?.turn || 1;
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
  currentTurn,
  moves,
  user,
  gameId,
  debug,
  onTheMove
};
