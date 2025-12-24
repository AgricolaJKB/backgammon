<script>
    import List from '$lib/client/components/list/index.svelte';

    import {enhance} from '$app/forms';

    let {data} = $props();

    $inspect(data);
</script>

<div class="container">
    <p class="section">Du bist dran:</p>
    <List
        user={data?.user}
        data={data?.myTurnGames}
        emptyText="Du bist gerade bei keinem Spiel am Zug."
    />
    <p class="section">Die anderen sind dran:</p>
    <List
        user={data?.user}
        data={data?.otherTurnGames}
        emptyText="Keine Spiele, bei denen andere am Zug sind."
    />
</div>

<style lang="scss">
    .container {
        width: 750px;
        max-width: 80vw;
        margin: 0 auto;
        padding-bottom: 4rem;
    }

    .section {
        display: block;
        margin-top: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
</style>
