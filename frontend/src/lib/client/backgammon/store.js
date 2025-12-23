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

const debug = writable(false);

const userColor = writable(null);

const gameId = writable(null);

// const moves = writable({});
const moves = writable([]);

// server game state
const gameState = writable(null);

const currentPlayerColor = derived(gameState, ($gameState) => {
  if (!$gameState) return "white";
  const lastRoll = $gameState.throws[$gameState.throws.length - 1];
  return lastRoll?.player || "white";
});

const currentTurn = derived(gameState, ($gameState) => {
  if (!$gameState) return 1;
  const lastRoll = $gameState.throws[$gameState.throws.length - 1];
  return lastRoll?.turn || 1;
});

const currentRoll = derived(gameState, ($gameState) => {
  if (!$gameState) return [null, null];
  const lastRoll = $gameState.throws[$gameState.throws.length - 1];
  return [lastRoll?.dice1 || null, lastRoll?.dice2 || null];
});

const onTheMove = derived(
  [currentPlayerColor, userColor],
  ([$currentPlayerColor, $userColor]) => $currentPlayerColor === $userColor
);

export {
  gameState,
  currentPlayerColor,
  currentRoll,
  currentTurn,
  moves,
  userColor,
  gameId,
  debug,
  onTheMove,
  updateGameState
};

export const updateGameState = (state) => {
  const board = getBoardState(state.moves);
  const history = getBoardHistory(state.moves);
  gameState.set({ ...state, board, history });
};
