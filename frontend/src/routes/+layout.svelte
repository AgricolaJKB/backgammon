<script>
  import House from "$lib/client/assets/house-solid.svg.svelte";
  import Logout from "$lib/client/assets/right-to-bracket.svg.svelte";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  console.log(page.data);
  let { children } = $props();
</script>

{#if page.route.id !== "/login"}
  <header>
    <div class="left">{page?.data?.user?.username}</div>
    <div class="right">
      {#if page.route.id === "/"}
        <div class="by">
          <form method="post" action="/?/logout" use:enhance>
            <button><Logout /></button>
          </form>
        </div>
      {:else}
        <a href="/" title="Home">
          <House />
        </a>
      {/if}
    </div>
  </header>
{/if}
<div id="app">
  {@render children()}
</div>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    // background-color: #f9f9f9;
    // border-bottom: 1px solid #e0e0e0;

    .left {
      @include font-l;
    }

    .right {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.25s;

      .by,
      a,
      form,
      button,
      svg {
        width: 100%;
        height: 100%;
      }

      &:hover {
        path {
          fill: #f9f9f9;
        }
      }
    }
  }

  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    /* color: rgba(255, 255, 255, 0.87); */
    color: #213547;
    /* background-color: #242424; */
    background-color: #ffffff;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global {
    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    body {
      width: 100%;
      margin: 0;
      // display: flex;
      //   place-items: center;
      min-width: 320px;
      min-height: 100vh;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    .card {
      padding: 2em;
    }

    #app {
      max-width: 1500px;
      margin: 0 auto;
      width: 100%;
      height: 100%;
      /* padding: 2rem; */
      /* text-align: center; */
    }

    button {
      padding: 0;
      border: none;
      cursor: pointer;
      background-color: transparent;
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: #213547;
      background-color: #ffffff;
    }

    :global {
      a:hover {
        /* color: #747bff; */
        /* color:  */
      }
      button {
        // background-color: #f9f9f9;
      }
    }
  }
</style>
