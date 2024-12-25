<script>
  let { children } = $props();
  console.log(children, "children");
</script>

<div id="app">
  {@render children()}
</div>

<style lang="scss">
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
      display: flex;
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
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      background-color: #f9f9f9;

      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      /* border-color: #646cff; */
      border-color: #1f1f1f;
    }
    button:focus {
      outline: 4px auto -webkit-focus-ring-color;
    }
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    button.primary {
      //   background-color: #646cff;
      background-color: #4a574c;
      color: #ffffff;
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
        background-color: #f9f9f9;
      }
    }
  }
</style>
