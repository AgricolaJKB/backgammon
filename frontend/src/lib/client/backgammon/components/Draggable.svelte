<script>
    import {tick} from 'svelte';

    /**
     * @typedef {Object} Props
     * @property {any} [maxDrag]
     * @property {boolean} [deactivated]
     * @property {boolean} [invertX]
     * @property {boolean} [invertY]
     * @property {any} [el]
     * @property {any} [id]
     * @property {any} [cache]
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
        invertX = false,
        invertY = false,
        el = $bindable(),
        id = null,
        cache = null,
        onDragStart = () => {},
        onDragEnd = () => {},
        children,
        send,
        receive,
    } = $props();

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

    let left = $state(0);
    let top = $state(0);

    let initialLeft = $state();
    let initialTop = $state();

    let lastTouchX = 0;
    let lastTouchY = 0;

    let containerBeforeDrag = $state();

    let moving = $state(false);

    function onMouseDown(e) {
        if (deactivated) return;
        moving = true;
        // if cache exists, append the element to it
        if (cache) {
            containerBeforeDrag = el.parentElement;
            const {left, top} = el.getBoundingClientRect();
            initialLeft = left;
            initialTop = top;
            cache.style.pointerEvents = 'auto';
            cache.appendChild(el);
        }
        onDragStart();
        if (e.touches) {
            lastTouchX = e.touches[0].screenX;
            lastTouchY = e.touches[0].screenY;
        }
    }

    function onMouseMove(e) {
        if (moving && !e.touches) {
            left += (invertX ? -1 : 1) * e.movementX;
            top += (invertY ? -1 : 1) * e.movementY;
        } else if (moving && e.touches) {
            const touch = e.touches[0];
            if (lastTouchX !== 0 || lastTouchY !== 0) {
                const deltaX = touch.screenX - lastTouchX;
                const deltaY = touch.screenY - lastTouchY;
                left += (invertX ? -1 : 1) * deltaX;
                top += (invertY ? -1 : 1) * deltaY;
            }
            lastTouchX = touch.screenX;
            lastTouchY = touch.screenY;
            e.stopPropagation();
            e.preventDefault();
        }
        if (
            maxDrag &&
            (left > maxDrag[0] ||
                left < -maxDrag[0] ||
                top > maxDrag[1] ||
                top < -maxDrag[1])
        ) {
            onMouseUp();
        }
    }

    async function onMouseUp() {
        moving = false;
        onDragEnd(() => {
            containerBeforeDrag.appendChild(el);
        });

        await tick();

        // remove the element from the cache
        if (cache) {
            cache.style.pointerEvents = 'none';
            // remove all elements from cache
            // cache.innerHTML = "";
            try {
                // containerBeforeDrag.appendChild(el);
            } catch (e) {
                // do nothing
            }
        }
        left = 0;
        top = 0;
        initialLeft = 0;
        initialTop = 0;
    }

    let style = $derived.by(() => {
        if (!moving) return '';
        if ((initialLeft || initialTop) && cache) {
            return `transform: translate(${left}px, ${top}px); position: absolute; left: ${initialLeft}px; top: ${initialTop}px;`;
        }
        return `transform: translate(${left}px, ${top}px);`;
    });
</script>

<div
    {id}
    bind:this={el}
    in:inFn={{key: id}}
    out:outFn={{key: id}}
    role="button"
    tabindex="0"
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
    ontouchstart={onMouseDown}
    ontouchend={onMouseUp}
    {style}
    class="draggable {deactivated && 'deactivated'} {moving && 'moving'}"
>
    {@render children?.()}
</div>

<svelte:window onmousemove={onMouseMove} ontouchmove={onMouseMove} />

<style>
    .draggable {
        z-index: 1000;
        cursor: pointer;
        &.deactivated {
            cursor: not-allowed;
        }
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }
</style>
