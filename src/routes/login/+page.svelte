<script>
    import Button from '$lib/components/ui/button/index.svelte';
    import {enhance} from '$app/forms';

    let {form} = $props();
</script>

<div class="container">
    <h1>Hallo Gammonhead :)</h1>
    <form class="form" method="post" action="?/login" use:enhance>
        <label>
            Dein Nutzer*innenname
            <input name="username" />
        </label>
        <label>
            Passwort
            <input type="password" name="password" />
        </label>
        <p class="alarm">{form?.message ? `🚨 ${form?.message} 🚨` : ''}</p>
        <div class="controls">
            <Button class="primary">Einloggen</Button>
            <a href="/register" class="register-link">Registrieren</a>
        </div>
    </form>
</div>

<style lang="scss">
    .register-link {
        display: inline-block;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        text-decoration: none;
        color: inherit;
        background-color: #f9f9f9;
        border-radius: 8px;
        text-align: center;
        transition: background-color 0.25s;

        &:hover {
            background-color: #e0e0e0;
        }
    }

    .container {
        width: 750px;
        max-width: 80vw;
        margin: 0 auto;
        height: 100%;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
    }

    h1 {
        margin-top: 0;
        margin-bottom: 4rem;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .form input {
        border: none;
        outline: none;
        border-bottom: 1px solid #000;
        padding: 0.5rem;
        max-width: 300px;
    }

    .controls {
        display: flex;
        gap: 1rem;
    }

    .alarm {
        color: $alarm;
    }
</style>
