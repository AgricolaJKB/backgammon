<script>
    import Entry from './Entry.svelte';

    const {data, user, emptyText = 'Keine Einträge vorhanden'} = $props();
</script>

<ul>
    {#each data || [] as game}
        <li>
            <Entry {...game} {user} />
        </li>
    {:else}
        <li class="empty">{emptyText}</li>
    {/each}
</ul>

<style lang="scss">
    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 1rem;

        &.empty {
            background-color: #f0f0f0;
            color: #888;
            font-style: italic;
            text-align: center;
            padding: 1rem;
        }
    }
</style>
