import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { games, moves, diceRolls } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const { slug: gameId } = params;
  const userId = locals.user.id;

  // 1. Fetch Game Metadata to verify user and get color
  const gameResult = await db.select().from(games).where(eq(games.id, gameId)).limit(1);

  if (gameResult.length === 0) {
    throw error(404, 'Game not found');
  }

  const game = gameResult[0];
  let userColor = null;

  if (game.whitePlayerId === userId) {
    userColor = 'white';
  } else if (game.blackPlayerId === userId) {
    userColor = 'black';
  } else {
    // User is not a player in this game
    userColor = 'spectator';
  }

  // 2. Fetch Game State (Moves and Rolls)
  const gameMoves = await db.select().from(moves).where(eq(moves.gameId, gameId));
  const gameRolls = await db.select().from(diceRolls).where(eq(diceRolls.gameId, gameId));

  const formattedMoves = gameMoves.map(m => ({
    id: m.id,
    turn: m.turnNumber,
    player: m.playerColor,
    checker_id: m.checkerId,
    start: m.fromPos,
    end: m.toPos,
    timestamp: m.createdAt
  }));

  const formattedRolls = gameRolls.map(r => ({
    id: r.id,
    turn: r.turnNumber,
    player: r.playerColor,
    dice1: r.dice1,
    dice2: r.dice2,
    timestamp: r.createdAt
  }));

  return {
    gameId,
    userColor,
    initialGameState: {
      moves: formattedMoves,
      throws: formattedRolls
    }
  };
};
