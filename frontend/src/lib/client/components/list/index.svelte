<script>
  import Entry from "./Entry.svelte";

  import { getTestData } from "./default.js";

  const { data, user } = $props();

  const testData = $derived(getTestData(user));
</script>

<ul>
  {#each data || testData || [] as game}
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
