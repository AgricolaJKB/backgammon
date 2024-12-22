<script>
  import Board from "./lib/Board.svelte";
</script>

<div class="game">
  <Board />
</div>

<style lang="scss">
  .game {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
</style>
