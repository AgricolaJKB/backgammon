import * as auth from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { getGamesForUser } from "$lib/server/games";
import { db } from "$lib/server/db";
import { user, games, friendships } from "$lib/server/db/schema";
import { ne, and, or, eq, isNull } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { v4 as uuidv4 } from 'uuid';

export const load = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/login");
  }

  event.depends('app:friends');

  const userId = event.locals.user.id;

  // Get all friendships where the user is involved
  const allFriendships = await db
    .select({
      id: friendships.id,
      status: friendships.status,
      senderId: friendships.senderId,
      receiverId: friendships.receiverId,
      friendUsername: user.username,
      friendEmoji: user.emoji,
      friendId: user.id
    })
    .from(friendships)
    .leftJoin(
      user,
      or(
        and(eq(friendships.senderId, userId), eq(user.id, friendships.receiverId)),
        and(eq(friendships.receiverId, userId), eq(user.id, friendships.senderId))
      )
    )
    .where(
      or(eq(friendships.senderId, userId), eq(friendships.receiverId, userId))
    );

  const friends = allFriendships.filter((f) => f.status === 'accepted');
  const incomingRequests = allFriendships.filter(
    (f) => f.status === 'pending' && f.receiverId === userId
  );
  const outgoingRequests = allFriendships.filter(
    (f) => f.status === 'pending' && f.senderId === userId
  );

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
    otherTurnGames,
    friends,
    incomingRequests,
    outgoingRequests
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
         return fail(400, { message: "Es läuft bereits ein Spiel gegen diesen Gegner" });
    }

    const gameId = uuidv4();

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
  },
  addFriend: async (event) => {
    if (!event.locals.user) return fail(401);
    const formData = await event.request.formData();
    const username = formData.get('username');

    if (!username || typeof username !== 'string') {
      return fail(400, { message: 'Nutzer*innenname ist erforderlich' });
    }

    if (username === event.locals.user.username) {
      return fail(400, { message: 'Du kannst dich nicht selbst hinzufügen' });
    }

    // Find the user to add
    const targetUser = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .get();

    if (!targetUser) {
      return fail(404, { message: 'Nutzer*in nicht gefunden' });
    }

    // Check if friendship already exists
    const existingFriendship = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(
            eq(friendships.senderId, event.locals.user.id),
            eq(friendships.receiverId, targetUser.id)
          ),
          and(
            eq(friendships.senderId, targetUser.id),
            eq(friendships.receiverId, event.locals.user.id)
          )
        )
      )
      .get();

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return fail(400, { message: 'Ihr seid bereits befreundet' });
      }
      if (existingFriendship.status === 'pending') {
        return fail(400, { message: 'Freundschaftsanfrage bereits ausstehend' });
      }
    }

    await db.insert(friendships).values({
      id: uuidv4(),
      senderId: event.locals.user.id,
      receiverId: targetUser.id,
      status: 'pending'
    });

    return { success: true };
  },

  acceptRequest: async (event) => {
    if (!event.locals.user) return fail(401);
    const formData = await event.request.formData();
    const friendshipId = formData.get('friendshipId');

    await db
      .update(friendships)
      .set({ status: 'accepted' })
      .where(
        and(
          eq(friendships.id, friendshipId),
          eq(friendships.receiverId, event.locals.user.id)
        )
      );

    return { success: true };
  },

  rejectRequest: async (event) => {
    if (!event.locals.user) return fail(401);
    const formData = await event.request.formData();
    const friendshipId = formData.get('friendshipId');

    await db
      .delete(friendships)
      .where(
        and(
          eq(friendships.id, friendshipId),
          eq(friendships.receiverId, event.locals.user.id)
        )
      );

    return { success: true };
  }
};
