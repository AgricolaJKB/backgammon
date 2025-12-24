import {db} from '$lib/server/db';
import {user, games} from '$lib/server/db/schema';
import {ne, eq, or, and, isNull} from 'drizzle-orm';

export const load = async (event) => {
    const locals = event.locals;
    let opponents = [];

    if (locals.user) {
        const userId = locals.user.id;

        const allUsers = await db
            .select({
                id: user.id,
                username: user.username,
            })
            .from(user)
            .where(ne(user.id, userId));

        const activeGames = await db
            .select({
                whitePlayerId: games.whitePlayerId,
                blackPlayerId: games.blackPlayerId,
            })
            .from(games)
            .where(
                and(
                    or(
                        eq(games.whitePlayerId, userId),
                        eq(games.blackPlayerId, userId),
                    ),
                    isNull(games.winnerId),
                ),
            );

        const activeOpponentIds = new Set();
        for (const game of activeGames) {
            if (game.whitePlayerId === userId) {
                activeOpponentIds.add(game.blackPlayerId);
            } else {
                activeOpponentIds.add(game.whitePlayerId);
            }
        }

        opponents = allUsers.filter((u) => !activeOpponentIds.has(u.id));
    }

    return {
        user: locals.user,
        opponents,
    };
};
