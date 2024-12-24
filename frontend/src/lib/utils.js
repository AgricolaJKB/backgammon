// replace hit-area-white and out-area-black by -1
// replace hit-area-black and out-area-white by 24
export const numerisePosition = (position) => {
  if (position === "hit-area-white" || position === "out-area-black") return -1;
  if (position === "hit-area-black" || position === "out-area-white") return 24;
  return parseInt(position);
};

export const getUsableDice = ({ dices, usedDices, currentMove }) => {
  // Calculate dice options (doubles allow four moves)
  const allDices =
    dices[0] === dices[1] ? [dices[0], dices[0], dices[0], dices[0]] : dices;

  const availableDices = allDices.filter((dice) => {
    const diceIndex = usedDices.indexOf(dice);
    if (diceIndex !== -1) usedDices.splice(diceIndex, 1); // Remove used dice
    return diceIndex === -1;
  });

  // Check if there are any possible moves left
  if (availableDices.length === 0) return undefined;

  // Check, if single dice is sufficient for the current move
  const currentDistance = Math.abs(
    numerisePosition(currentMove.end) - numerisePosition(currentMove.start)
  );

  const availableDice = availableDices.find((dice) => dice === currentDistance);
  return availableDice;
};
