<script>
    import {onMount} from 'svelte';

    let {position, color, type, children} = $props();

    let numberOfChildren = $state();
    let el = $state();

    onMount(() => {
        // check via el if there are children
        // update via mutation observer
        const observer = new MutationObserver(() => {
            numberOfChildren = el.querySelectorAll('.draggable').length;
        });

        observer.observe(el, {childList: true});
    });
</script>

<div
    class="{color} checkerContainer {type} box"
    data-position={position}
    bind:this={el}
>
    <span class="label {color}"></span>
    {@render children()}
    {#if numberOfChildren > 1}
        <span class="bottom-info">+{numberOfChildren - 1}</span>
    {/if}
</div>

<style lang="scss">
    .hit {
        background-color: darkgrey;
    }
    .out {
        background-color: rgb(159, 201, 156);
    }

    .hit,
    .out {
        position: relative;

        .label {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            height: 0.5rem;
            width: 0.5rem;
            border-radius: 50%;

            &.white {
                background-color: white;
            }
            &.black {
                background-color: black;
            }
        }
        &.checkerContainer {
            justify-content: space-evenly;
            // display only first 4 checkers
            :global(.draggable) {
                display: none !important;
                &:nth-child(-n + 2) {
                    display: block !important;
                }
            }
        }

        .bottom-info {
            position: absolute;
            bottom: 0.5rem;
            left: 50%;
            transform: translateX(-50%);
            color: white;
        }
    }
</style>
