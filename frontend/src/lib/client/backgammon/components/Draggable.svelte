<script>
    import {dragManager} from '../drag.svelte.js';

    /**
     * @typedef {Object} Props
     * @property {any} [maxDrag]
     * @property {boolean} [deactivated]
     * @property {any} [id]
     * @property {() => void} [onDragStart]
     * @property {(any) => void} [onDragEnd]
     * @property {import('svelte').Snippet} [children]
     * @property {any} [send]
     * @property {any} [receive]
     */

    /** @type {Props} */
    let {
        maxDrag = [Infinity, Infinity],
        deactivated = false,
        id = null,
        onDragStart = () => {},
        onDragEnd = () => {},
        children,
        send,
        receive,
    } = $props();

    let el = $state();
    let isDragging = $state(false);

    function noop() {
        return {duration: 0};
    }

    function inFn(node, params) {
        if (receive) return receive(node, params);
        return noop();
    }

    function outFn(node, params) {
        if (send) return send(node, params);
        return noop();
    }

    function onMouseDown(e) {
        if (deactivated) return;

        const rect = el.getBoundingClientRect();
        let startX, startY;

        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }

        isDragging = true;
        onDragStart();

        dragManager.start(
            children,
            startX,
            startY,
            rect,
            (center) => {
                isDragging = false;
                // Pass a reset function that does nothing, as we don't move DOM nodes anymore
                // But we pass the center coordinates for drop detection
                onDragEnd({
                    coordinates: center,
                    reset: () => {},
                });
            },
            maxDrag,
        );
    }
</script>

<div
    {id}
    bind:this={el}
    in:inFn={{key: id}}
    out:outFn={{key: id}}
    role="button"
    tabindex="0"
    onmousedown={onMouseDown}
    ontouchstart={onMouseDown}
    class="draggable {deactivated && 'deactivated'} {isDragging && 'dragging'}"
    style:opacity={isDragging ? 0 : 1}
>
    {@render children?.()}
</div>

<style>
    .draggable {
        cursor: pointer;
        &.deactivated {
            cursor: not-allowed;
        }
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        touch-action: none;
    }
</style>
