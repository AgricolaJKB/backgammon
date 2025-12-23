import init from './initial.json';

const checkersById = init.reduce((acc, curr) => {
    acc[curr.id] = {id: curr.id, color: curr.color};
    return acc;
}, {});

export class Game {
    gameState = $state(null);
    localMoves = $state([]);
    userColor = $state(null);
    gameId = $state(null);
    debug = $state(false);

    constructor(userColor, gameId) {
        this.userColor = userColor;
        this.gameId = gameId;
    }

    updateState(gameState) {
        this.gameState = gameState;
    }

    setLocalMoves(moves) {
        this.localMoves = moves;
    }

    // --- Derived State from Server ---

    serverMoves = $derived(this.gameState?.moves || []);
    diceRolls = $derived(this.gameState?.diceRolls || []);

    currentPlayerColor = $derived.by(() => {
        if (!this.diceRolls.length) return "white";
        const lastRoll = this.diceRolls[this.diceRolls.length - 1];
        const lastRollColor = lastRoll?.playerColor || "white";

        // Check if the current player has finished their turn
        const lastMove = this.serverMoves.length ? this.serverMoves[this.serverMoves.length - 1] : null;
        if (lastMove && lastMove.turnNumber === lastRoll.turnNumber) {
            return lastRollColor === "white" ? "black" : "white";
        }

        return lastRollColor;
    });

    currentTurn = $derived.by(() => {
        if (!this.diceRolls.length) return 1;
        const lastRoll = this.diceRolls[this.diceRolls.length - 1];

        // Check if the current player has finished their turn
        const lastMove = this.serverMoves.length ? this.serverMoves[this.serverMoves.length - 1] : null;
        if (lastMove && lastMove.turnNumber === lastRoll.turnNumber) {
            return lastRoll.turnNumber + 1;
        }

        return lastRoll?.turnNumber || 1;
    });

    currentRoll = $derived.by(() => {
        if (!this.diceRolls.length) return [null, null];
        const lastRoll = this.diceRolls[this.diceRolls.length - 1];

        // Check if the current player has finished their turn
        const lastMove = this.serverMoves.length ? this.serverMoves[this.serverMoves.length - 1] : null;
        if (lastMove && lastMove.turnNumber === lastRoll.turnNumber) {
            return [null, null];
        }

        return [lastRoll?.dice1 || null, lastRoll?.dice2 || null];
    });

    onTheMove = $derived(this.currentPlayerColor === this.userColor);

    // --- Board Calculation ---

    calculateBoardState(moves, turnNumber) {
        const initialPositionPerChecker = init.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});

        const filteredMoves = (turnNumber || turnNumber === 0)
            ? moves.filter((move) => move.turnNumber <= turnNumber)
            : moves;

        const movesInTurn = (turnNumber || turnNumber === 0)
            ? filteredMoves.filter((move) => move.turnNumber === turnNumber)
            : [];

        const lastMovesPerChecker = filteredMoves.reduce((acc, move) => {
            acc[move.checkerId] = move;
            return acc;
        }, {});

        const board = init.reduce((acc, curr) => {
            const position =
                lastMovesPerChecker[curr.id]?.toPos ||
                initialPositionPerChecker[curr.id].position;

            if (!acc[position]) {
                acc[position] = [];
            }
            acc[position].push({
                id: curr.id,
                color: curr.color,
                hasBeenMoved: !!movesInTurn.find((move) => move.checkerId === curr.id)
            });
            return acc;
        }, {});
        return board;
    }

    getBoardHistory(moves) {
        const lastTurn = moves[moves.length - 1]?.turnNumber || 0;
        return Array.from({ length: lastTurn }, (_, i) => {
            return this.calculateBoardState(moves, i + 1);
        });
    }

    // Derived board state combining server state and local moves
    board = $derived.by(() => {
        // 1. Calculate base board from server moves
        // We pass 'undefined' as turnNumber to get the latest state
        // But wait, the original store logic for 'hasBeenMoved' relied on 'movesInTurn'.
        // For the main board, we probably want to know if a checker moved in the *current* turn?
        // Or just the latest position.

        // Let's use the server moves to get the base state.
        // We can't easily use calculateBoardState for the *optimistic* updates because
        // localMoves don't have turnNumbers yet (or they are tentative).

        // Better approach:
        // 1. Get board from server moves.
        // 2. Apply local moves on top.

        const baseBoard = this.calculateBoardState(this.serverMoves);

        // Deep copy to avoid mutating base state
        const positions = JSON.parse(JSON.stringify(baseBoard));

        for (const move of this.localMoves) {
            const { checkerId, fromPos, toPos } = move;

            // Remove from old position
            if (positions[fromPos]) {
                positions[fromPos] = positions[fromPos].filter(c => c.id !== checkerId);
            }

            // Find checker details
            const checker = checkersById[checkerId];

            // Add to new position
            if (!positions[toPos]) {
                positions[toPos] = [];
            }
            // We need to reconstruct the checker object for the board
            // For local moves, hasBeenMoved is definitely true
            positions[toPos].push({ id: checkerId, color: checker.color, hasBeenMoved: true });
        }
        return positions;
    });

    history = $derived(this.getBoardHistory(this.serverMoves));

    isMovingBackwards(checker, fromPos, toPos) {
        // Special areas (Bar/Out) don't follow numeric direction rules here
        if (fromPos.includes('hit') || fromPos.includes('out')) return false;

        const start = Number(fromPos);
        const end = Number(toPos);

        if (checker.color === 'white') return start > end; // White moves up (0 -> 24)
        if (checker.color === 'black') return start < end; // Black moves down (24 -> 0)
        return false;
    }

    numerisePosition(position) {
        if (position === "hit-area-white" || position === "out-area-black") return -1;
        if (position === "hit-area-black" || position === "out-area-white") return 24;
        return parseInt(position);
    }

    getUsableDice(fromPos, toPos) {
        const lastRoll = this.diceRolls[this.diceRolls.length - 1];

        const dices = [lastRoll.dice1, lastRoll.dice2];

        // Calculate dice options (doubles allow four moves)
        const allDices = dices[0] === dices[1]
            ? Array(4).fill(dices[0])
            : [...dices];

        // Remove used dice from available pool
        for (const move of this.localMoves) {
            const used = move.usedDice;
            // Ignore empty usedDice (e.g. from hit moves)
            if (Array.isArray(used) && used.length === 0) continue;

            const index = allDices.indexOf(used);
            if (index !== -1) {
                allDices.splice(index, 1);
            }
        }

        if (allDices.length === 0) return undefined;

        // Check if single dice is sufficient for the current move
        const currentDistance = Math.abs(
            this.numerisePosition(toPos) - this.numerisePosition(fromPos)
        );

        return allDices.find(dice => dice === currentDistance);
    }

    attemptMove(checkerId, fromPos, toPos) {
        const checker = checkersById[checkerId];
        const usedDice = this.getUsableDice(fromPos, toPos);

        // Basic validations: available dice, no-op move, not moving backwards
        if (
            !usedDice ||
            fromPos === toPos ||
            this.isMovingBackwards(checker, fromPos, toPos)
        ) {
            return false;
        }

        // Check target position occupancy; cannot land on point with 2+ opponent checkers
        const targetPosCheckers = this.board[toPos] || [];

        if (
            targetPosCheckers.length > 1 &&
            targetPosCheckers[0].color !== checker.color
        ) {
            return false;
        }

        // Handle hitting an opponent
        if (
            targetPosCheckers.length === 1 &&
            targetPosCheckers[0].color !== checker.color
        ) {
            const hitChecker = targetPosCheckers[0];
            this.localMoves.push({
                checkerId: hitChecker.id,
                fromPos: toPos,
                toPos: `hit-area-${hitChecker.color}`,
                usedDice: []
            });
        }

        // Add the main move
        this.localMoves.push({
            checkerId,
            fromPos,
            toPos,
            usedDice
        });
        return true;
    }
}



