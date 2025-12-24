import {db} from '$lib/server/db';
import {games, user, moves} from '$lib/server/db/schema';
import {eq, or, desc} from 'drizzle-orm';
import {alias} from 'drizzle-orm/sqlite-core';

export async function getGamesForUser(userId) {
    const whitePlayer = alias(user, 'whitePlayer');
    const blackPlayer = alias(user, 'blackPlayer');

    const userGames = await db
        .select({
            game: games,
            whitePlayer: whitePlayer,
            blackPlayer: blackPlayer,
        })
        .from(games)
        .leftJoin(whitePlayer, eq(games.whitePlayerId, whitePlayer.id))
        .leftJoin(blackPlayer, eq(games.blackPlayerId, blackPlayer.id))
        .where(
            or(
                eq(games.whitePlayerId, userId),
                eq(games.blackPlayerId, userId),
            ),
        );

    const gamesWithDetails = await Promise.all(
        userGames.map(async ({game, whitePlayer, blackPlayer}) => {
            const lastMove = await db
                .select()
                .from(moves)
                .where(eq(moves.gameId, game.id))
                .orderBy(desc(moves.id))
                .limit(1);

            let turn = 1;
            let currentPlayerColor = 'white';

            if (lastMove.length > 0) {
                // Logic from previous implementation
                currentPlayerColor =
                    lastMove[0].playerColor === 'white' ? 'black' : 'white';
                turn = lastMove[0].turnNumber + 1;
            }

            return {
                gameId: game.id,
                players: [
                    {...whitePlayer, color: 'white'},
                    {...blackPlayer, color: 'black'},
                ],
                status: game.winnerId ? 'finished' : 'running',
                turn,
                currentPlayer: currentPlayerColor,
                lastUpdate: game.updatedAt,
                dices: [],
                rolled: false,
                board: [],
                history: [],
                uncommittedMoves: [],
            };
        }),
    );

    return gamesWithDetails;
}
