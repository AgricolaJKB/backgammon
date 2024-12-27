<script>
  import List from "$lib/client/components/list/index.svelte";

  import { enhance } from "$app/forms";

  let { data } = $props();
</script>

<div class="container">
  <!-- <h1>Hallo, {data?.user?.username}!</h1>
  <p>Deine ID ist {data?.user?.id}.</p> -->
  <p class="section">Du bist dran:</p>
  <List user={data?.user} />
  <p class="section">Die anderen sind dran:</p>
  <List user={data?.user} />
</div>

<style lang="scss">
  .container {
    width: 750px;
    max-width: 80vw;
    margin: 0 auto;
  }

  .section {
    display: block;
    margin-top: 2rem;
  }
</style>
