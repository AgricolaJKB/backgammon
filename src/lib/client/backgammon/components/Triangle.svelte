<script>
    /**
     * @typedef {Object} Props
     * @property {any} color
     * @property {boolean} [reversed]
     */

    /** @type {Props} */
    let {color, reversed = false} = $props();
</script>

<div class="container">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {#if reversed}
            <polygon points="0,0 100,0 50,100" fill={color} />
        {:else}
            <polygon points="0,100 100,100 50,0" fill={color} />
        {/if}
    </svg>
</div>

<style lang="scss">
    .container {
        width: 100%;
        height: 100%;
        // background-color: #c3c3c3;
    }
    svg {
        width: 100%;
        height: 100%;
    }
</style>
