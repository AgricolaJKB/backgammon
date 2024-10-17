<script>
  import Board from "./lib/Board.svelte";
  import SideBoard from "./lib/SideBoard.svelte";

  const startSettings = {
    0: { checkers: 2, color: "white" },
    5: { checkers: 5, color: "black" },
    7: { checkers: 3, color: "black" },
    11: { checkers: 5, color: "white" },
    12: { checkers: 5, color: "black" },
    16: { checkers: 3, color: "white" },
    18: { checkers: 5, color: "white" },
    23: { checkers: 2, color: "black" },
  };
</script>

<div class="game">
  <div class="main">
    <Board {startSettings} />
  </div>
  <div class="side">
    <SideBoard />
  </div>
</div>

<style lang="scss">
  .game {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .main {
      width: 65%;
      height: 100%;
      float: left;
    }

    .side {
      width: 25%;
      height: 100%;
      float: right;
      align-self: flex-start;
    }
  }
</style>
