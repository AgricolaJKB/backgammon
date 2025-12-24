<script>
    import House from '$lib/assets/house-solid.svg.svelte';
    import Logout from '$lib/assets/right-to-bracket.svg.svelte';
    import {page} from '$app/state';
    import {enhance} from '$app/forms';

    let {children} = $props();
</script>

{#if page.route.id !== '/login' && page.route.id !== '/register'}
    <header>
        <div class="left">
            <span class="emoji">{page?.data?.user?.emoji}</span>
            {page?.data?.user?.username}
        </div>
        <div class="right">
            {#if page.route.id === '/'}
                <div class="by action-item">
                    <form method="post" action="/?/logout" use:enhance>
                        <button class="icon-btn" title="Logout">
                            <Logout />
                        </button>
                    </form>
                </div>
            {:else}
                <a href="/" title="Home" class="action-item icon-btn">
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
        padding: 1rem 2rem;
        margin-bottom: 1rem;

        .left {
            @include font-l;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .emoji {
                font-size: 1.5rem;
            }
        }

        .right {
            display: flex;
            gap: 1.5rem;
            align-items: center;
        }

        .action-item {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;

            form {
                width: 100%;
                height: 100%;
            }
        }

        .icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: inherit;

            :global(svg) {
                width: 100%;
                height: 100%;
            }

            &:hover {
                opacity: 0.7;
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
            margin: 0 auto;
            width: 100%;
            height: 100%;
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
