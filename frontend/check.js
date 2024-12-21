function isValidBackgammonMove(turn) {
  const { dices, moves, current_move } = turn;

  // Calculate dice options (doubles allow four moves)
  const possibleMoves =
    dices[0] === dices[1] ? [dices[0], dices[0], dices[0], dices[0]] : dices;

  // Track total moves made so far on this turn
  let usedMoves = moves.map((move) => Math.abs(move.end - move.start));

  // Check the current move distance
  const currentDistance = Math.abs(current_move.end - current_move.start);

  // Check if the distance of the current move matches an available dice move
  const remainingMoves = possibleMoves.slice();
  console.log(remainingMoves, possibleMoves);

  for (let move of usedMoves) {
    const moveIndex = remainingMoves.indexOf(move);
    if (moveIndex !== -1) remainingMoves.splice(moveIndex, 1); // Remove used move
  }

  const validMoveIndex = remainingMoves.indexOf(currentDistance);

  // Validate the current move
  if (validMoveIndex === -1) return false; // Move doesn't match any remaining dice values

  // Assuming additional game logic (for example, open points, checkers) is managed elsewhere,
  // return true as the move is valid based on distance and available moves this turn
  return true;
}

// Example usage:
const turn = {
  dices: [6, 6],
  moves: [
    {
      checker_id: "1",
      start: 5,
      end: 11,
    },
  ],
  current_move: {
    checker_id: "6",
    start: 5,
    end: 17,
  },
};

console.log(isValidBackgammonMove(turn));
