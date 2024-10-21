const DEV_BACKEND_URL = "http://localhost:8000";
const PROD_BACKEND_URL = "https://agricola.uber.space/backgammon/backend";

const backend_url = import.meta.env.PROD ? PROD_BACKEND_URL : DEV_BACKEND_URL;

const getGameState = async (id = "test") => {
  const response = await fetch(`${backend_url}/game/${id}`);
  const data = await response.json();
  return data;
};

const rollDices = async (id = "test") => {
  const response = await fetch(`${backend_url}/game/${id}/roll`);
  const data = await response.json();
  const roll = data.throws[data.throws.length - 1];
  return [roll.dice1, roll.dice2];
};

const insertMoves = async (id = "test", moves) => {
  const response = await fetch(`${backend_url}/game/${id}/moves`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moves),
  });
  const status = await response.text();
  return status;
};

export { getGameState, rollDices, insertMoves };
