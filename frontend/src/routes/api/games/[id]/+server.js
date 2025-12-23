import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { moves, diceRolls } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
  const { id } = params;

  const gameMoves = await db.select().from(moves).where(eq(moves.gameId, id));
  const gameRolls = await db.select().from(diceRolls).where(eq(diceRolls.gameId, id));

  return json({
    moves: gameMoves,
    diceRolls: gameRolls
  });
}
