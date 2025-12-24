<script>
    import House from '$lib/client/assets/house-solid.svg.svelte';
    import Logout from '$lib/client/assets/right-to-bracket.svg.svelte';
    import Plus from '$lib/client/assets/plus.svg.svelte';
    import Bell from '$lib/client/assets/bell.svg.svelte';
    import {page} from '$app/state';
    import {enhance} from '$app/forms';

    let {children} = $props();
    let showNewGameMenu = $state(false);
</script>

{#if page.route.id !== '/login'}
    <header>
        <div class="left">{page?.data?.user?.username}</div>
        <div class="right">
            <div class="action-item">
                <button class="icon-btn" title="Nachrichten">
                    <Bell />
                </button>
            </div>

            {#if page.route.id === '/'}
                <div class="action-item">
                    <button
                        class="icon-btn"
                        onclick={() => (showNewGameMenu = !showNewGameMenu)}
                        title="Neues Spiel"
                    >
                        <Plus />
                    </button>
                    {#if showNewGameMenu}
                        <div class="dropdown">
                            <h3>Neues Spiel gegen:</h3>
                            {#if page.data.opponents?.length > 0}
                                {#each page.data.opponents as opponent}
                                    <form
                                        method="POST"
                                        action="/?/createGame"
                                        use:enhance
                                    >
                                        <input
                                            type="hidden"
                                            name="opponentId"
                                            value={opponent.id}
                                        />
                                        <button
                                            type="submit"
                                            class="dropdown-item"
                                        >
                                            {opponent.username}
                                        </button>
                                    </form>
                                {/each}
                            {:else}
                                <div class="dropdown-item empty">
                                    Keine Gegner gefunden
                                </div>
                            {/if}
                        </div>
                        <!-- Backdrop to close -->
                        <div
                            class="backdrop"
                            onclick={() => (showNewGameMenu = false)}
                        ></div>
                    {/if}
                </div>
            {/if}

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

        .dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 0.5rem;
            background: white;
            border: 1px solid $middlegray;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            width: 200px;
            z-index: 100;
            padding: 0.5rem 0;

            h3 {
                margin: 0;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                border-bottom: 1px solid $lightgray;
                color: $text-secondary;
            }

            .dropdown-item {
                display: block;
                width: 100%;
                text-align: left;
                padding: 0.5rem 1rem;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                color: $text-primary;

                &:hover {
                    background-color: $lightgray;
                }

                &.empty {
                    color: $text-secondary;
                    font-style: italic;
                    cursor: default;
                    &:hover {
                        background: none;
                    }
                }
            }
        }

        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 99;
            cursor: default;
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
            // max-width: 1500px;
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
