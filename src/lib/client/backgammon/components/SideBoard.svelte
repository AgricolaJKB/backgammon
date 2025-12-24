<script>
    import Button from '$lib/client/components/button/index.svelte';
    import Dice from './Dice.svelte';
    import Draggable from './Draggable.svelte';
    import History from './History.svelte';
    import {onMount, getContext} from 'svelte';
    import {enhance} from '$app/forms';

    const game = getContext('game');

    let {forcedCheckerPositions = $bindable(null)} = $props();

    let forcedTurn = $state();
    let forcedPlayerColor = $state();
    let forcedDices = $state();

    let playerToDisplay = $derived(
        forcedPlayerColor || game.currentPlayerColor,
    );
    let turnToDisplay = $derived(forcedTurn || game.currentTurn);
    let isForced = $derived(forcedPlayerColor && forcedTurn);

    let dices = $state([0, 0]);

    $effect(() => {
        dices = forcedDices || game.currentRoll;
    });

    let rollForm;
    const roll = ({reset}) => {
        rollForm.requestSubmit();
        reset();
    };

    let movesValue = $derived(
        JSON.stringify(
            Object.values(game.localMoves).map((m) => {
                // remove usedDice property
                const {usedDice, ...rest} = m;
                return rest;
            }),
        ),
    );

    $inspect(game.userColor, playerToDisplay);
</script>

<div class="container">
    <div class="header">
        <div class="info {playerToDisplay}">
            <p class="player">
                {#if isForced}
                    {playerToDisplay === 'white' ? 'Weiß' : 'Schwarz'} war
                {:else if game.userColor === playerToDisplay}
                    Du bist
                {:else}
                    {playerToDisplay === 'white' ? 'Weiß' : 'Schwarz'} ist
                {/if} am Zug
            </p>
            <p class="turn">Zug {turnToDisplay}</p>
        </div>
        <History
            bind:forcedCheckerPositions
            bind:forcedPlayerColor
            bind:forcedTurn
            bind:forcedDices
        />
    </div>

    <div class="dice-container">
        {#if !dices[0] && !dices[1] && game.onTheMove}
            <span>
                Zieh die Würfel mit der Maus,
                <br />
                um zu würfeln
            </span>
        {/if}

        <form
            method="POST"
            action="?/roll"
            bind:this={rollForm}
            use:enhance={() => {
                return async ({result}) => {
                    if (result.type === 'success') {
                        dices = [result.data.dice1, result.data.dice2];
                    }
                };
            }}
            style="display: none;"
        ></form>

        <Draggable
            onDragEnd={roll}
            maxDrag={[150, 150]}
            deactivated={!!dices[0] || !game.onTheMove}
        >
            <div class="dices">
                <Dice number={dices[0]} />
                <Dice number={dices[1]} />
            </div>
        </Draggable>
    </div>

    {#if dices[0] && dices[1] && game.onTheMove}
        <div class="actions">
            <form
                method="POST"
                action="?/move"
                use:enhance={() => {
                    return async ({result}) => {
                        if (result.type === 'success') {
                            game.confirmTurn();
                        }
                    };
                }}
            >
                <input type="hidden" name="moves" value={movesValue} />
                <Button type="submit">Zug beenden</Button>
            </form>
        </div>
    {/if}
</div>

<style lang="scss">
    .container {
        height: 100%;

        & > :global(*) {
            margin-bottom: 2rem;
        }
    }

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 0.25rem;
    }

    .info {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding: 2rem;

        p {
            margin: 0;
            font-weight: bold;
            &.turn {
                font-size: 0.75rem;
            }
        }

        &.black {
            color: white;
            background-color: black;
            border: 2px solid black;
            .turn {
                color: rgb(220, 220, 220);
            }
        }
        &.white {
            color: black;
            background-color: white;
            border: 2px solid black;
            .turn {
                color: darkslategray;
            }
        }
    }

    .dices {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .dice-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        color: #c3c3c3;

        span {
            text-align: center;
            font-size: 0.75rem;
        }
    }

    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
</style>
