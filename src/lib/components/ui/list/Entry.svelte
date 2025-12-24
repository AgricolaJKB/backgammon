<script>
    import {
        differenceInMinutes,
        differenceInHours,
        differenceInDays,
        differenceInWeeks,
    } from 'date-fns';
    import Bell from '$lib/assets/bell.svg.svelte';
    import BellCrossed from '$lib/assets/bell-crossed.svg.svelte';

    const {user, gameId, players, status, turn, lastUpdate} = $props();

    const player = $derived(players.find((p) => p.id === user.id));
    const opponent = $derived(players.find((p) => p.id !== user.id));

    let notificationsEnabled = $state(false);

    function toggleNotifications(e) {
        e.preventDefault();
        e.stopPropagation();
        notificationsEnabled = !notificationsEnabled;
    }

    const formattedLastUpdate = $derived.by(() => {
        if (!lastUpdate) {
            return 'vor 2 Minuten';
        }

        const now = new Date();
        const lastUpdateParsed = lastUpdate;
        const minDiff = differenceInMinutes(now, lastUpdateParsed);
        if (minDiff < 1) {
            return 'gerade eben';
        }
        if (minDiff < 60) {
            return `vor ${minDiff} Minute${minDiff > 1 ? 'n' : ''}`;
        }
        const hourDiff = differenceInHours(now, lastUpdateParsed);
        if (hourDiff < 24) {
            return `vor ${hourDiff} Stunde${hourDiff > 1 ? 'n' : ''}`;
        }
        const dayDiff = differenceInDays(now, lastUpdateParsed);
        if (dayDiff < 7) {
            return `vor ${dayDiff} Tag${dayDiff > 1 ? 'en' : ''}`;
        }
        const weekDiff = differenceInWeeks(now, lastUpdateParsed);
        return `vor ${weekDiff} Woche${weekDiff > 1 ? 'n' : ''}`;
    });
</script>

<div class="wrapper">
    <a href={gameId} class="container" data-id={gameId}>
        <svg class="hover" viewBox="0 0 100 100">
            <polygon points="0,0 100,50 0,100" />
        </svg>
        <div class="content">
            <div class="opponent">vs. {opponent.username}</div>
            <div class="state">Zug {turn} · im Ziel: 0 w, 0 b</div>
            <div class="last-update">{formattedLastUpdate}</div>
            <div class="checker {player.color}"></div>
        </div>
    </a>
    <button
        class="notification-toggle"
        class:active={notificationsEnabled}
        onclick={toggleNotifications}
        aria-label="Toggle notifications"
    >
        {#if notificationsEnabled}
            <Bell />
        {:else}
            <BellCrossed />
        {/if}
    </button>
</div>

<style lang="scss">
    .wrapper {
        display: flex;
        gap: 5px;
    }

    .container {
        position: relative;
        display: flex;
        flex: 1;
        border-left: $middlegray 1px solid;
        height: 5rem;
        text-decoration: none;
        background-color: $background-primary;

        &:hover {
            border-left: $darkgray 2px solid;
        }
    }

    .notification-toggle {
        background-color: $background-primary;
        border: none;
        cursor: pointer;
        color: $middlegray;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1 color 0.2s;
        // border-left: 5px solid white;

        &:hover {
            color: $text-primary;
        }

        &.active {
            color: $text-primary;
        }

        :global(svg) {
            width: 1.25rem;
            height: 1.25rem;
        }
    }

    .hover {
        position: relative;
        left: 0;
        width: 0;
        height: 100%;
        text-align: center;
        vertical-align: center;
        grid-area: hover;
        color: #fff;
        background-color: $middlegray;
        transition: width 0.2s;
        overflow: hidden;
        @include font-s;
    }

    .content {
        display: grid;
        width: 100%;
        grid-template-areas:
            'opponent checker'
            'state last-update';
        grid-template-columns: 1fr 1fr;
        gap: 0.25rem;
        padding: 0.75rem 0.75rem 0.5rem 0.75rem;

        .opponent {
            color: $text-primary;
            grid-area: opponent;
            font-weight: bold;
            @include font-m;
        }

        .checker {
            grid-area: checker;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            border: 1px solid $darkgray;
            margin-left: auto;

            &.white {
                background-color: white;
            }
            &.black {
                background-color: black;
            }
        }

        .state {
            color: $text-primary;
            grid-area: state;
            @include font-s;
        }

        .last-update {
            grid-area: last-update;
            @include font-s;
            color: $text-secondary;
            text-align: right;
        }
    }
</style>
