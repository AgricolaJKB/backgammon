<script>
    import Button from '$lib/components/ui/button/index.svelte';
    import {enhance} from '$app/forms';

    let {form} = $props();

    const emojis = [
        '🐱',
        '🐭',
        '🐹',
        '🐰',
        '🦊',
        '🐻',
        '🐼',
        '🐨',
        '🐯',
        '🦁',
        '🐮',
        '🐷',
        '🐸',
        '🐵',
        '🐔',
        '🐧',
        '🦆',
        '🦉',
        '🐺',
        '🐗',
        '🐴',
        '🦡',
        '🐝',
        '🦋',
        '🐢',
        '🐙',
        '🐳',
        '🦖',
        '🐘',
        '🦫',
        '🦓',
        '🦦',
    ];
    let selectedEmoji = $state(emojis[0]);
</script>

<div class="container">
    <!-- <h1>Werde ein Gammonhead :)</h1> -->

    <form class="form" method="POST" use:enhance>
        <label>
            Dein Nutzer*innenname
            <input type="text" name="username" required />
        </label>

        <label>
            E-Mail Adresse
            <input type="email" name="email" required />
        </label>

        <label>
            Passwort
            <input type="password" name="password" required />
        </label>

        <label>
            Passwort wiederholen
            <input type="password" name="confirmPassword" required />
        </label>

        <div class="emoji-section">
            <span class="label-text">Wähle deinen Avatar</span>
            <input type="hidden" name="emoji" value={selectedEmoji} />
            <div class="emoji-grid">
                {#each emojis as emoji}
                    <button
                        type="button"
                        class="emoji-btn"
                        class:selected={selectedEmoji === emoji}
                        onclick={() => (selectedEmoji = emoji)}
                    >
                        {emoji}
                    </button>
                {/each}
            </div>
        </div>

        {#if form?.message}
            <p class="alarm">🚨 {form.message} 🚨</p>
        {/if}

        <div class="controls">
            <Button class="primary">Registrieren</Button>
            <a href="/login" class="login-link">Zum Login</a>
        </div>
    </form>
</div>

<style lang="scss">
    .container {
        width: 450px;
        max-width: 80vw;
        margin: 0 auto;
        height: 100%;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        background: transparent;
    }

    .emoji-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .label-text {
        font-weight: 500;
    }

    .emoji-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        max-width: 400px;
    }

    .emoji-btn {
        background: none;
        border: 2px solid transparent;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        &.selected {
            border-color: #000;
            background-color: rgba(0, 0, 0, 0.05);
        }
    }

    .controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-top: 1rem;
    }

    .login-link {
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

    .alarm {
        color: $alarm;
    }
</style>
