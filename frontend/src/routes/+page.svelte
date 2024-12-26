<script>
  import { enhance } from "$app/forms";

  let { data } = $props();

  let testData = [
    {
      gameId: 1,
      players: [
        { id: "b4wybt3hhpj65dxuolcpmmda", username: "jakob", color: "white" },
        { id: "fletppfn5qezjmdeqw7efbqp", username: "kaspar", color: "black" }
      ],
      status: "running",
      turn: 1,
      dices: [1, 2],
      rolled: false,
      board: [
        { id: 0, color: "white", count: 2 },
        { id: 5, color: "white", count: 5 },
        { id: 7, color: "white", count: 3 },
        { id: 11, color: "white", count: 5 },
        { id: 12, color: "black", count: 5 },
        { id: 16, color: "black", count: 3 },
        { id: 18, color: "black", count: 5 },
        { id: 23, color: "black", count: 2 }
      ],
      history: [],
      moves: []
    },
    {
      gameId: 2,
      players: [
        { id: "tbujaebmrdywbksb5q6mtntx", username: "bauer", color: "white" },
        { id: "b4wybt3hhpj65dxuolcpmmda", username: "jakob", color: "black" }
      ],
      status: "running",
      turn: 1,
      dices: [1, 2],
      rolled: false,
      board: [
        { id: 0, color: "white", count: 2 },
        { id: 5, color: "white", count: 5 },
        { id: 7, color: "white", count: 3 },
        { id: 11, color: "white", count: 5 },
        { id: 12, color: "black", count: 5 },
        { id: 16, color: "black", count: 3 },
        { id: 18, color: "black", count: 5 },
        { id: 23, color: "black", count: 2 }
      ],
      history: [],
      moves: []
    }
  ];
</script>

<div class="container">
  <h1>Hallo, {data?.user?.username}!</h1>
  <p>Deine ID ist {data?.user?.id}.</p>
  <form method="post" action="?/logout" use:enhance>
    <button>Tschüs 👋</button>
  </form>
</div>

<style lang="scss">
  .container {
    width: 750px;
    max-width: 80vw;
    margin: 0 auto;
  }
</style>
