<script>
    import List from '$lib/client/components/list/index.svelte';
    import FriendsList from '$lib/client/components/FriendsList.svelte';

    import {enhance} from '$app/forms';

    let {data, form} = $props();

    $inspect(data);
</script>

<div class="page-layout">
    <div class="side-column">
        <FriendsList
            friends={data.friends}
            incomingRequests={data.incomingRequests}
            outgoingRequests={data.outgoingRequests}
            {form}
        />
    </div>

    <div class="main-column">
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
</div>

<style lang="scss">
    .page-layout {
        margin: 0 auto;
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 4rem;
        padding: 0rem 2rem;
        min-height: calc(100vh - 4.75rem);

        @media (max-width: 800px) {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }

    .main-column {
        padding-bottom: 4rem;
    }

    .section {
        display: block;
        margin-top: 0;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    /* Add margin to second section only */
    .main-column > .section:nth-of-type(2) {
        margin-top: 3rem;
    }
</style>
