import * as auth from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { getGamesForUser } from "$lib/server/games";
import { db } from "$lib/server/db";
import { user, games } from "$lib/server/db/schema";
import { ne, and, or, eq, isNull } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

function generateGameId() {
    // Generate a random ID similar to the user IDs (or just use UUID)
    const bytes = new Uint8Array(15);
    crypto.getRandomValues(bytes);
    return encodeBase32LowerCaseNoPadding(bytes);
}

export const load = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/login");
  }

  const userId = event.locals.user.id;

  const gamesWithDetails = await getGamesForUser(userId);

  const myTurnGames = gamesWithDetails.filter((g) => {
    const myColor = g.players.find((p) => p.id === userId).color;
    return g.currentPlayer === myColor && g.status === "running";
  });

  const otherTurnGames = gamesWithDetails.filter((g) => {
    const myColor = g.players.find((p) => p.id === userId).color;
    return (g.currentPlayer !== myColor || g.status !== "running");
  });

  return {
    myTurnGames,
    otherTurnGames
  };
};

export const actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    delete event.locals.user;
    auth.deleteSessionTokenCookie(event);

    return redirect(302, "/login");
  },
  createGame: async (event) => {
    if (!event.locals.user) {
        return fail(401);
    }
    const data = await event.request.formData();
    const opponentId = data.get("opponentId");

    if (!opponentId) {
        return fail(400, { message: "Opponent required" });
    }

    const userId = event.locals.user.id;

    // Check for existing active game
    const existingGame = await db.select().from(games).where(
        and(
            or(
                and(eq(games.whitePlayerId, userId), eq(games.blackPlayerId, opponentId)),
                and(eq(games.whitePlayerId, opponentId), eq(games.blackPlayerId, userId))
            ),
            isNull(games.winnerId)
        )
    ).limit(1);

    if (existingGame.length > 0) {
         return fail(400, { message: "Active game already exists with this opponent" });
    }

    const gameId = generateGameId();

    // Randomize colors
    const isWhite = Math.random() > 0.5;
    const whitePlayerId = isWhite ? userId : opponentId;
    const blackPlayerId = isWhite ? opponentId : userId;

    await db.insert(games).values({
        id: gameId,
        whitePlayerId,
        blackPlayerId
    });

    return redirect(302, `/${gameId}`);
  }
};
