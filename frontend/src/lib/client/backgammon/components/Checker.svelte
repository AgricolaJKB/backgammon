<script>
    import {onMount} from 'svelte';
    import Draggable from './Draggable.svelte';

    import {currentPlayerColor, onTheMove} from '../store.js';

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
    } = $props();

    let checker = $state();
    let cache = $state();

    onMount(() => {
        cache = document.querySelector('.moving-checker-cache');
    });

    $effect(() => {
        draggable = color === $currentPlayerColor && $onTheMove;
    });

    const onDragEnd = (reset) => {
        const {left, top, width, height} = checker.getBoundingClientRect();
        const checkerCenter = {x: left + width / 2, y: top + height / 2};
        onMove({
            checker_id: id,
            start: String(position),
            coordinates: checkerCenter,
            reset,
        });
    };
</script>

<Draggable
    {id}
    {send}
    {receive}
    {cache}
    bind:el={checker}
    deactivated={!draggable}
    {onDragEnd}
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
