<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Draggable from "./Draggable.svelte";

  import { currentPlayer, onTheMove } from "../store.js";

  export let id;
  export let position;
  export let color;
  export let hasBeenMoved;
  export let draggable = false;

  const dispatch = createEventDispatcher();

  $: draggable = color === $currentPlayer && $onTheMove;

  let checker;
  let cache;
  let resetDrag = () => {};

  let containerBeforeDrag;

  onMount(() => {
    cache = document.querySelector(".moving-checker-cache");
  });

  const onDragStart = () => {
    containerBeforeDrag = checker.parentElement;
    const { left, top } = checker.getBoundingClientRect();
    cache.appendChild(checker);
    checker.style.position = "absolute";
    checker.style.left = `${left}px`;
    checker.style.top = `${top}px`;
    cache.style.pointerEvents = "auto";
  };

  const onDragEnd = () => {
    const { left, top, width, height } = checker.getBoundingClientRect();
    const checkerCenter = { x: left + width / 2, y: top + height / 2 };
    dispatch("move", {
      checker_id: id,
      start: String(position),
      coordinates: checkerCenter,
      reset: () => containerBeforeDrag.appendChild(checker),
    });
    resetDrag();
    // containerBeforeDrag.appendChild(checker);
    cache.style.pointerEvents = "none";
    checker.style.position = "static";
  };

  onMount(() => {
    console.log("create checker", id, position, color, hasBeenMoved);
  });
</script>

<Draggable
  {id}
  deactivated={!draggable}
  on:dragstart={onDragStart}
  on:dragend={onDragEnd}
  bind:el={checker}
  bind:reset={resetDrag}
>
  <div
    class="checker {color}"
    style="background-color: {color}; border: {hasBeenMoved
      ? '2px'
      : '1px'} solid black"
  >
    {#if hasBeenMoved}
      <div
        class="moved"
        style="background-color: {color === 'white' ? 'black' : 'white'}"
      />
    {/if}
  </div>
</Draggable>

<style>
  .checker {
    position: relative;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin: 0.5rem;
    box-sizing: border-box;
  }
  .moved {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    border-width: 2px;
  }
</style>
