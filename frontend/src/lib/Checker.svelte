<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Draggable from "./Draggable.svelte";

  import { currentPlayer, onTheMove } from "../store.js";

  export let id;
  export let position;
  export let color;
  export let draggable = false;
  export let invertX = false;
  export let invertY = false;

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
      start: position,
      coordinates: checkerCenter,
    });
    resetDrag();
    cache.style.pointerEvents = "none";
    checker.style.position = "static";
  };
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
    style="background-color: {color}; border: 1px solid black"
  />
</Draggable>

<style>
  .checker {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin: 0.5rem;
    box-sizing: border-box;
  }
</style>
