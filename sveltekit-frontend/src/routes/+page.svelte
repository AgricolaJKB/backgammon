<script>
  import { enhance } from "$app/forms";

  let { data } = $props();
</script>

<div class="container">
  <h1>Hallo, {data?.user?.username}!</h1>
  <p>Deine ID ist {data?.user?.id}.</p>
  <form method="post" action="?/logout" use:enhance>
    <button>Tschüs 👋</button>
  </form>
</div>

<style lang="scss">
  .container {
    width: 750px;
    max-width: 80vw;
    margin: 0 auto;
  }
</style>
