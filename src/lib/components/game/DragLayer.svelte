<script>
    import {dragManager} from '../../logic/drag.svelte.js';
</script>

{#if dragManager.active}
    <div
        class="drag-layer-item"
        style="
            top: {dragManager.currentPosition.top}px;
            left: {dragManager.currentPosition.left}px;
            width: {dragManager.currentPosition.width}px;
            height: {dragManager.currentPosition.height}px;
        "
    >
        {@render dragManager.snippet()}
    </div>
{/if}

<style>
    .drag-layer-item {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
    }
</style>
