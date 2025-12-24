<script>
    import {enhance} from '$app/forms';
    import Button from '$lib/client/components/button/index.svelte';
    import {invalidate} from '$app/navigation';
    import {onMount} from 'svelte';

    let {friends, incomingRequests, outgoingRequests, form} = $props();

    onMount(() => {
        const interval = setInterval(() => {
            invalidate('app:friends');
        }, 2000);

        return () => clearInterval(interval);
    });
</script>

<div class="friends-container">
    <p class="section-title">Freunde</p>

    <div class="add-friend">
        <form method="POST" action="?/addFriend" use:enhance class="add-form">
            <input type="text" name="username" placeholder="Name..." required />
            <Button class="small">Hinzufügen</Button>
        </form>
        {#if form?.message}
            <p class="error">{form.message}</p>
        {/if}
    </div>

    <p class="sub-title">Meine Freunde</p>
    {#if friends.length === 0}
        <p class="empty">Noch keine Freunde :(</p>
    {:else}
        <ul class="list">
            {#each friends as friend}
                <li class="item">
                    <div class="friend-info">
                        <span class="avatar">{friend.friendEmoji}</span>
                        <span class="name">{friend.friendUsername}</span>
                    </div>
                    <form method="POST" action="?/createGame" use:enhance>
                        <input
                            type="hidden"
                            name="opponentId"
                            value={friend.friendId}
                        />
                        <button class="icon-btn" title="Spiel starten">
                            🎮
                        </button>
                    </form>
                </li>
            {/each}
        </ul>
    {/if}

    <div class="lists">
        {#if incomingRequests.length > 0}
            <p class="sub-title">Anfragen ({incomingRequests.length})</p>
            <ul class="list">
                {#each incomingRequests as req}
                    <li class="item">
                        <div class="friend-info">
                            <span class="avatar">{req.friendEmoji}</span>
                            <span class="name">{req.friendUsername}</span>
                        </div>
                        <div class="actions">
                            <form
                                method="POST"
                                action="?/acceptRequest"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="friendshipId"
                                    value={req.id}
                                />
                                <button
                                    class="icon-btn success"
                                    title="Annehmen"
                                >
                                    ✓
                                </button>
                            </form>
                            <form
                                method="POST"
                                action="?/rejectRequest"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="friendshipId"
                                    value={req.id}
                                />
                                <button
                                    class="icon-btn danger"
                                    title="Ablehnen"
                                >
                                    ✗
                                </button>
                            </form>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}

        {#if outgoingRequests.length > 0}
            <p class="sub-title">Offene Anfragen ({outgoingRequests.length})</p>
            <ul class="list">
                {#each outgoingRequests as req}
                    <li class="item">
                        <div class="friend-info">
                            <span class="avatar">{req.friendEmoji}</span>
                            <span class="name">{req.friendUsername}</span>
                        </div>
                        <div class="actions">
                            <span class="status-icon" title="Wartet...">
                                ⏳
                            </span>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style lang="scss">
    .friends-container {
        height: 100%;
        // border-left: 1px solid #eee;
        // padding-left: 2rem;
    }

    .section-title {
        display: block;
        margin-top: 0; /* Align with top of games list */
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .sub-title {
        font-size: 0.9rem;
        text-transform: uppercase;
        color: #888;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .add-form {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;

        input {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-bottom: 1px solid #000;
            background: transparent;
            font-size: 1rem;
            outline: none;
            min-width: 0; /* Prevent overflow */
        }
    }

    .list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 0;
        // border-bottom: 1px solid #eee;
    }

    .friend-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .avatar {
        font-size: 1.2rem;
    }

    .name {
        font-weight: 500;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .status-icon {
        font-size: 1rem;
        cursor: help;
    }

    .icon-btn {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        &.success {
            color: #10b981;
        }
        &.danger {
            color: #ef4444;
        }
    }

    .error {
        color: #dc2626;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }

    .empty {
        color: #999;
        font-style: italic;
        font-size: 0.9rem;
    }
</style>
