<script>
    const {children, ...props} = $props();
</script>

<button {...props}>{@render children()}</button>

<style lang="scss">
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
</style>
