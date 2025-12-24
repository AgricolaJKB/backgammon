import {error, redirect} from '@sveltejs/kit';
import {db} from '$lib/server/db';
import {games, moves, diceRolls} from '$lib/server/db/schema';
import {eq, desc} from 'drizzle-orm';

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

export const actions = {
    roll: async ({params, locals}) => {
        const {slug: id} = params;

        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        // Get last roll to determine next turn
        const lastRoll = await db
            .select()
            .from(diceRolls)
            .where(eq(diceRolls.gameId, id))
            .orderBy(desc(diceRolls.id))
            .limit(1);

        let player = 'white';
        let turn = 1;

        if (lastRoll.length > 0) {
            const lastColor = lastRoll[0].playerColor;
            const isLastWhite = lastColor === 'white' || lastColor === 'w';
            player = isLastWhite ? 'black' : 'white';
            turn = lastRoll[0].turnNumber + 1;
        }

        // Verify user
        const game = await db
            .select()
            .from(games)
            .where(eq(games.id, id))
            .limit(1);
        if (game.length === 0) {
            throw error(404, 'Game not found');
        }

        const expectedUserId =
            player === 'white' ? game[0].whitePlayerId : game[0].blackPlayerId;

        if (locals.user.id !== expectedUserId) {
            throw error(403, 'Not your turn to roll');
        }

        const dice1 = rollDice();
        const dice2 = rollDice();

        await db.insert(diceRolls).values({
            gameId: id,
            turnNumber: turn,
            playerColor: player,
            dice1,
            dice2,
        });

        return {success: true, dice1, dice2};
    },

    move: async ({params, request, locals}) => {
        const {slug: id} = params;

        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const movesData = JSON.parse(formData.get('moves'));

        // Get context for turn/player from the last dice roll
        const lastRoll = await db
            .select()
            .from(diceRolls)
            .where(eq(diceRolls.gameId, id))
            .orderBy(desc(diceRolls.id))
            .limit(1);

        if (lastRoll.length === 0) {
            throw error(400, 'No dice roll found for this game');
        }

        const player = lastRoll[0].playerColor;
        const turn = lastRoll[0].turnNumber;

        // Verify user is the correct player
        const game = await db
            .select()
            .from(games)
            .where(eq(games.id, id))
            .limit(1);
        if (game.length === 0) {
            throw error(404, 'Game not found');
        }

        const isWhite = player === 'white' || player === 'w';
        const expectedUserId = isWhite
            ? game[0].whitePlayerId
            : game[0].blackPlayerId;

        if (locals.user.id !== expectedUserId) {
            throw error(403, 'Not your turn');
        }

        // Insert all moves
        for (const move of movesData) {
            await db.insert(moves).values({
                gameId: id,
                turnNumber: turn,
                playerColor: player,
                checkerId: move.checkerId,
                fromPos: move.fromPos,
                toPos: move.toPos,
            });
        }

        return {success: true};
    },
};

export const load = async ({params, locals}) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const {slug: gameId} = params;
    const userId = locals.user.id;

    // 1. Fetch Game Metadata to verify user and get color
    const gameResult = await db
        .select()
        .from(games)
        .where(eq(games.id, gameId))
        .limit(1);

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
    const gameMoves = await db
        .select()
        .from(moves)
        .where(eq(moves.gameId, gameId));
    const gameRolls = await db
        .select()
        .from(diceRolls)
        .where(eq(diceRolls.gameId, gameId));

    const formattedMoves = gameMoves.map((m) => ({
        id: m.id,
        turnNumber: m.turnNumber,
        playerColor: m.playerColor,
        checkerId: m.checkerId,
        fromPos: m.fromPos,
        toPos: m.toPos,
        createdAt: m.createdAt,
    }));

    const formattedRolls = gameRolls.map((r) => ({
        id: r.id,
        turnNumber: r.turnNumber,
        playerColor: r.playerColor,
        dice1: r.dice1,
        dice2: r.dice2,
        createdAt: r.createdAt,
    }));

    return {
        gameId,
        userColor,
        initialGameState: {
            moves: formattedMoves,
            diceRolls: formattedRolls,
        },
    };
};
