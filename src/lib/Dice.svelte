<script>
  export let number;
</script>

<div class="dice">
  {#if number}
    {#if [1, 3, 5].includes(number)}
      <div class="dot center" />
    {/if}
    {#if [2, 3, 4, 5, 6].includes(number)}
      <div class="dot top-left" />
      <div class="dot bottom-right" />
    {/if}
    {#if [4, 5, 6].includes(number)}
      <div class="dot top-right" />
      <div class="dot bottom-left" />
    {/if}
    {#if number === 6}
      <div class="dot center-left" />
      <div class="dot center-right" />
    {/if}
  {:else}
    <span>?</span>
  {/if}
</div>

<style>
  .dice {
    width: 40px;
    height: 40px;
    background-color: white;
    border: 2px solid black;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    border-radius: 5px;
    padding: 3px;
  }
  span {
    grid-column: 2;
    grid-row: 2;
    justify-self: center;
    align-self: center;
    font-weight: bold;
  }
  .dot {
    width: 5px;
    height: 5px;
    background-color: black;
    border-radius: 50%;
    justify-self: center;
    align-self: center;
  }
  .center {
    grid-column: 2;
    grid-row: 2;
  }
  .top-left {
    grid-column: 1;
    grid-row: 1;
  }
  .top-right {
    grid-column: 3;
    grid-row: 1;
  }
  .bottom-left {
    grid-column: 1;
    grid-row: 3;
  }
  .bottom-right {
    grid-column: 3;
    grid-row: 3;
  }
  .center-left {
    grid-column: 1;
    grid-row: 2;
  }
  .center-right {
    grid-column: 3;
    grid-row: 2;
  }
</style>
