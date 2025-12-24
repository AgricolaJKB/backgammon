<script>
    import {onMount, getContext} from 'svelte';
    import Draggable from './Draggable.svelte';

    const game = getContext('game');

    /**
     * @typedef {Object} Props
     * @property {any} id
     * @property {any} position
     * @property {any} color
     * @property {any} hasBeenMoved
     * @property {boolean} [draggable]
     * @property {(any) => void} [onMove]
     * @property {any} [send]
     * @property {any} [receive]
     */

    /** @type {Props} */
    let {
        id,
        position,
        color,
        hasBeenMoved,
        draggable = true,
        onMove = () => {},
        send,
        receive,
        dragOrigin = null,
    } = $props();

    $effect(() => {
        draggable = color === game.currentPlayerColor && game.onTheMove;
    });

    const onDragEnd = ({coordinates, reset}) => {
        onMove({
            checkerId: id,
            fromPos: String(position),
            coordinates,
            reset,
        });
    };
</script>

<Draggable
    {id}
    {send}
    {receive}
    deactivated={!draggable}
    {onDragEnd}
    {dragOrigin}
>
    <div
        class="checker {color}"
        style="background-color: {color}; border: {hasBeenMoved
            ? '2px'
            : '1px'} solid black"
    >
        {#if hasBeenMoved}
            <div
                class="moved"
                style="background-color: {color === 'white'
                    ? 'black'
                    : 'white'}"
            ></div>
        {/if}
    </div>
</Draggable>

<style>
    .checker {
        position: relative;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin: 0.25rem;
        box-sizing: border-box;
    }
    .moved {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        border-width: 2px;
    }

    @media (max-width: 768px) {
        .checker {
            width: 1rem;
            height: 1rem;
            margin: 0.05rem;
        }
        .moved {
            width: 0.4rem;
            height: 0.4rem;
        }
    }
</style>
