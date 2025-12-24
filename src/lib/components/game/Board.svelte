<script>
    import Triangle from './Triangle.svelte';
    import Checker from './Checker.svelte';
    import SideBoard from './SideBoard.svelte';
    import Box from './Box.svelte';

    import {onMount, setContext} from 'svelte';
    import {crossfade} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';
    import {Game} from '../../logic/game.svelte.js';
    import DragLayer from './DragLayer.svelte';
    import {invalidateAll} from '$app/navigation';

    let {data} = $props();

    let game = new Game(data?.userColor, data?.gameId, data?.initialGameState);
    setContext('game', game);

    let lastUpdate = data?.lastUpdate;

    $effect(() => {
        if (data) {
            if (data.lastUpdate !== lastUpdate) {
                if (data.gameId !== game.gameId) {
                    game.gameId = data.gameId;
                    game.userColor = data.userColor;
                }
                game.updateState(data.initialGameState);
                lastUpdate = data.lastUpdate;
            }
        }
    });

    $effect(() => {
        if (data?.gameId) {
            const es = new EventSource(`/api/game/${data.gameId}/events`);
            es.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'update') {
                    invalidateAll();
                }
            };

            return () => {
                es.close();
            };
        }
    });

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
            };
        },
    });

    let forcedCheckerPositions = $state(null);

    let _checkerPositions = $derived(forcedCheckerPositions || game.board);

    let recentDrops = $state({});

    const handleCheckerDrop = ({checkerId, fromPos, coordinates, reset}) => {
        const elements = document.elementsFromPoint(
            coordinates.x,
            coordinates.y,
        );
        const container = elements.find((el) => el.dataset?.position);

        if (!container) {
            reset();
            return;
        }

        const toPos = container.dataset.position;

        const success = game.attemptMove(checkerId, fromPos, toPos);
        if (!success) {
            reset();
        } else {
            recentDrops[checkerId] = coordinates;
        }
    };
</script>

<div class="backgammon">
    <div class="side-area">
        <SideBoard bind:forcedCheckerPositions />
        <div class="hit-area">
            <span class="label">Geschlagen</span>
            <div class="boxes">
                {#each ['white', 'black'] as color}
                    <Box position={`hit-area-${color}`} {color} type="hit">
                        {#each _checkerPositions[`hit-area-${color}`] || [] as checker (checker.id)}
                            <Checker
                                {...checker}
                                {send}
                                {receive}
                                position={`hit-area-${color}`}
                                onMove={handleCheckerDrop}
                                dragOrigin={recentDrops[checker.id]}
                            />
                        {/each}
                    </Box>
                {/each}
            </div>
        </div>
        <div class="out-area">
            <span class="label">Im Ziel</span>
            <div class="boxes">
                {#each ['white', 'black'] as color}
                    <Box position={`out-area-${color}`} {color} type="out">
                        {#each _checkerPositions[`out-area-${color}`] || [] as checker (checker.id)}
                            <Checker
                                {...checker}
                                {send}
                                {receive}
                                position={`out-area-${color}`}
                                onMove={handleCheckerDrop}
                                dragOrigin={recentDrops[checker.id]}
                            />
                        {/each}
                    </Box>
                {/each}
            </div>
        </div>
    </div>
    <div class="main-area">
        <!-- 1 board, 2 sides, 12 triangles per side  -->
        <div class="board {game.userColor}">
            {#each Array.from({length: 2}) as _, i}
                {@const isUpper = i === 0}
                {@const side = game.userColor === 'black' ? 1 - i : i}
                <div class="side {isUpper ? 'upper' : 'lower'}">
                    {#each Array.from({length: 12}) as _, j}
                        {@const index = side * 12 + j}
                        <div
                            class="triangle root-triangle"
                            style="width: {100 / 12}%"
                        >
                            <Triangle
                                color={j % 2 === 0 ? 'darkgrey' : 'grey'}
                                reversed={isUpper}
                            />
                            <div
                                class="checkerContainer {!isUpper &&
                                    'reversed'} "
                                data-position={index}
                            >
                                {#each _checkerPositions[index] || [] as checker (checker.id)}
                                    <Checker
                                        {...checker}
                                        {send}
                                        {receive}
                                        position={index}
                                        onMove={handleCheckerDrop}
                                        dragOrigin={recentDrops[checker.id]}
                                    />
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
<DragLayer />

<style lang="scss">
    .backgammon {
        height: calc(100dvh - 6rem);
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .main-area {
        width: calc(75% - 6vw);
        height: 100%;

        @media (max-width: 768px) {
            width: 70%;
        }
    }

    .side-area {
        width: 25%;
        height: 100%;
        max-height: 100%;
        align-self: flex-start;

        display: grid;
        grid-template-rows: auto 1fr 1fr;
        gap: 1rem;

        .hit-area,
        .out-area {
            display: flex;
            flex-direction: column;

            .label {
                font-weight: bold;
                margin-bottom: 0.5rem;
                text-align: center;
            }

            .boxes {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                flex-grow: 1;
            }
        }
    }

    .marker {
        position: fixed !important;
        width: 1rem;
        height: 1rem;
        background-color: red;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }
    .board {
        position: relative;
        width: 100%;
        // height: 90dvh;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        background-color: darkgrey;

        @media (max-width: 768px) {
            width: 95vw;
            height: 95dvh;
        }

        &.black {
            // transform: scale(-1);
        }
    }
    .side {
        position: absolute;
        width: calc(100% - 4rem);
        height: calc(50% - 3rem);
        background-color: white;
        margin: 2rem;
        display: flex;

        @media (max-width: 768px) {
            width: calc(100% - 2rem);
            height: calc(50% - 1.5rem);
            margin: 1rem;
        }

        &.upper {
            top: 0;
            flex-direction: row-reverse;

            & > div {
                &:nth-child(6) {
                    margin-left: 1.5rem;
                }
                &:nth-child(7) {
                    margin-right: 1.5rem;
                }
            }
        }
        &.lower {
            bottom: 0;

            & > div {
                &:nth-child(6) {
                    margin-right: 1.5rem;
                }
                &:nth-child(7) {
                    margin-left: 1.5rem;
                }
            }
        }
    }
    .triangle {
        position: relative;
        height: calc(100% - 1rem);
        margin: 0.5rem;
    }
    :global(.checkerContainer) {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;

        &.reversed {
            flex-direction: column-reverse;
            justify-content: end;
        }
    }
</style>
