<script>
  import {
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths
  } from "date-fns";

  const { user, gameId, players, status, turn, lastUpdate } = $props();

  const player = $derived(players.find((p) => p.id === user.id));
  const opponent = $derived(players.find((p) => p.id !== user.id));

  const formattedLastUpdate = $derived.by(() => {
    if (!lastUpdate) {
      return "vor 2 Minuten";
    }

    const now = new Date();
    const lastUpdateParsed = Date.parse(lastUpdate);
    const minDiff = differenceInMinutes(now, lastUpdateParsed);
    if (minDiff < 1) {
      return "gerade eben";
    }
    if (minDiff < 60) {
      return `vor ${minDiff} Minute${minDiff > 1 ? "n" : ""}`;
    }
    const hourDiff = differenceInHours(now, lastUpdateParsed);
    if (hourDiff < 24) {
      return `vor ${hourDiff} Stunde${hourDiff > 1 ? "n" : ""}`;
    }
    const dayDiff = differenceInDays(now, lastUpdateParsed);
    if (dayDiff < 7) {
      return `vor ${dayDiff} Tag${dayDiff > 1 ? "en" : ""}`;
    }
    const weekDiff = differenceInWeeks(now, lastUpdateParsed);
    return `vor ${weekDiff} Woche${weekDiff > 1 ? "n" : ""}`;
  });
</script>

<div class="container" data-id={gameId}>
  <!-- <div class="hover">zum Spiel</div>
    -->
  <!-- triangle to the left -->
  <!-- <svg class="hover" viewBox="0 0 3 1" preserveAspectRatio="xMinYMid"> -->
  <svg class="hover" viewBox="0 0 100 100">
    <polygon points="0,0 100,50 0,100" />
  </svg>
  <div class="content">
    <div class="opponent">vs. {opponent.username}</div>
    <div class="state">Zug {turn} · im Ziel: 0 w, 0 b</div>
    <div class="last-update">{formattedLastUpdate}</div>
    <div class="checker {player.color}"></div>
  </div>
</div>

<style lang="scss">
  .container {
    position: relative;
    display: flex;
    border-left: $middlegray 1px solid;
    background-color: $background-primary;
    height: 5rem;

    &:hover {
      border-left: $darkgray 2px solid;
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
      "opponent checker"
      "state last-update";
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;

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
