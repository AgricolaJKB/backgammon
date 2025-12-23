import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { moves, diceRolls, games } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

export async function GET({ params, locals }) {
  const { id } = params;

  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get last roll to determine next turn
  const lastRoll = await db.select().from(diceRolls).where(eq(diceRolls.gameId, id)).orderBy(desc(diceRolls.id)).limit(1);

  let player = 'white';
  let turn = 1;

  if (lastRoll.length > 0) {
    const lastColor = lastRoll[0].playerColor;
    const isLastWhite = lastColor === 'white' || lastColor === 'w';
    player = isLastWhite ? 'black' : 'white';
    turn = lastRoll[0].turnNumber + 1;
  }

  // Verify user
  const game = await db.select().from(games).where(eq(games.id, id)).limit(1);
  if (game.length === 0) {
    return json({ error: 'Game not found' }, { status: 404 });
  }

  const expectedUserId = player === 'white' ? game[0].whitePlayerId : game[0].blackPlayerId;

  if (locals.user.id !== expectedUserId) {
    return json({ error: 'Not your turn to roll' }, { status: 403 });
  }

  const dice1 = rollDice();
  const dice2 = rollDice();

  await db.insert(diceRolls).values({
    gameId: id,
    turnNumber: turn,
    playerColor: player,
    dice1,
    dice2
  });

  // Return updated game state (similar to the Python implementation which returns conn.get())
  // For efficiency, we could just return the roll, but to match the API:
  const gameMoves = await db.select().from(moves).where(eq(moves.gameId, id));
  const gameRolls = await db.select().from(diceRolls).where(eq(diceRolls.gameId, id));

  return json({
    moves: gameMoves.map(m => ({
      id: m.id,
      turn: m.turnNumber,
      player: m.playerColor,
      checker_id: m.checkerId,
      start: m.fromPos,
      end: m.toPos,
      timestamp: m.createdAt
    })),
    throws: gameRolls.map(r => ({
      id: r.id,
      turn: r.turnNumber,
      player: r.playerColor,
      dice1: r.dice1,
      dice2: r.dice2,
      timestamp: r.createdAt
    }))
  });
}
