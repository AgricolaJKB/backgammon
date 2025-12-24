<script>
    import {getContext} from 'svelte';
    import initial from '../initial.json';

    const game = getContext('game');

    let {
        forcedCheckerPositions = $bindable(),
        forcedPlayerColor = $bindable(),
        forcedTurn = $bindable(),
        forcedDices = $bindable(),
    } = $props();

    let infoByTurn = $derived(
        Array.from({length: Math.max(0, game.currentTurn - 1)}, (_, i) => {
            return {
                moves: game.serverMoves.filter((m) => m.turnNumber === i + 1),
                throw: game.diceRolls.find((t) => t.turnNumber === i + 1),
                playerColor: i % 2 === 0 ? 'white' : 'black',
            };
        }),
    );

    let lastViewedTurn;

    const handleMouseEnter = (turnNumber) => {
        lastViewedTurn = turnNumber;
        const {moves, throw: _throw, playerColor} = infoByTurn[turnNumber];

        forcedPlayerColor = playerColor;
        forcedTurn = turnNumber + 1;
        forcedDices = [_throw.dice1, _throw.dice2];
        forcedCheckerPositions = game.history[turnNumber];
    };

    const handleMouseOut = () => {
        forcedCheckerPositions = null;
        forcedPlayerColor = null;
        forcedTurn = null;
        forcedDices = null;
        lastViewedTurn = null;
    };
</script>

<div class="container">
    {#each infoByTurn as info, i (i)}
        <div
            class="info {info.playerColor}"
            role="button"
            tabindex="0"
            onmouseenter={() => handleMouseEnter(i)}
            onmouseout={() => handleMouseOut()}
            onfocus={() => handleMouseEnter(i)}
            onblur={() => handleMouseOut()}
        ></div>
    {/each}
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 1.5rem;
        width: 100%;
        background-color: #c3c3c3;
        padding: 0.2rem;
        gap: 0.2rem;
        box-sizing: border-box;

        .info {
            height: 100%;
            flex-grow: 1;
            background-color: white;
            cursor: pointer;
            &.black {
                background-color: black;
            }
            &:hover {
                flex-grow: 1;
                // height: 100%;
                // background-color: rebeccapurple;
            }
        }
    }
</style>
