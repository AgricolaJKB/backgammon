import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { moves, diceRolls } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET({ params }) {
  const { id } = params;

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
