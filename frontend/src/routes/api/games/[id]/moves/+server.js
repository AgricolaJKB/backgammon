import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { moves, diceRolls, games } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST({ params, request, locals }) {
  const { id } = params;

  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json(); // Expecting array of moves

  // Get context for turn/player from the last dice roll
  const lastRoll = await db.select().from(diceRolls).where(eq(diceRolls.gameId, id)).orderBy(desc(diceRolls.id)).limit(1);

  if (lastRoll.length === 0) {
    return json({ error: 'No dice roll found for this game' }, { status: 400 });
  }

  const player = lastRoll[0].playerColor;
  const turn = lastRoll[0].turnNumber;

  // Verify user is the correct player
  const game = await db.select().from(games).where(eq(games.id, id)).limit(1);
  if (game.length === 0) {
    return json({ error: 'Game not found' }, { status: 404 });
  }

  const isWhite = player === 'white' || player === 'w';
  const expectedUserId = isWhite ? game[0].whitePlayerId : game[0].blackPlayerId;

  if (locals.user.id !== expectedUserId) {
    return json({ error: 'Not your turn' }, { status: 403 });
  }

  // Insert all moves
  for (const move of body) {
    await db.insert(moves).values({
      gameId: id,
      turnNumber: turn,
      playerColor: player,
      checkerId: move.checkerId,
      fromPos: move.fromPos,
      toPos: move.toPos
    });
  }

  return json("ok");
}
