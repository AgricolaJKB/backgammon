<script>
    import Backgammon from '$lib/client/backgammon/App.svelte';
    let {data} = $props();
</script>

<div class="game">
    <Backgammon {data} />
</div>

<style lang="scss">
    .game {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
