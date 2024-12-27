<script>
  import Entry from "./Entry.svelte";

  import backupData from "./default.json";

  const { data, user } = $props();
</script>

<ul>
  {#each data || backupData as game}
    <li>
      <a href={`${game.gameId}`}>
        <Entry {...game} {user} />
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 1rem;
  }
</style>
