<script>
    import {dragManager} from '../../logic/drag.svelte.js';

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
        dragOrigin = null,
    } = $props();

    let el = $state();
    let isDragging = $state(false);

    function noop() {
        return {duration: 0};
    }

    function flyFrom(node, {x, y, duration = 400}) {
        const rect = node.getBoundingClientRect();
        const dx = x - (rect.left + rect.width / 2);
        const dy = y - (rect.top + rect.height / 2);

        return {
            duration,
            css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px)`,
        };
    }

    function inFn(node, params) {
        if (dragOrigin)
            return flyFrom(node, {x: dragOrigin.x, y: dragOrigin.y});
        if (receive) return receive(node, params);
        return noop();
    }

    function outFn(node, params) {
        if (isDragging) return noop();
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
                onDragEnd({
                    coordinates: center,
                    reset: () => {
                        isDragging = false;
                    },
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
