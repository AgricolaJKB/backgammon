<script>
  import { onMount } from "svelte";
  import Draggable from "./Draggable.svelte";

  import { currentPlayer, onTheMove } from "../store.js";

  /**
   * @typedef {Object} Props
   * @property {any} id
   * @property {any} position
   * @property {any} color
   * @property {any} hasBeenMoved
   * @property {boolean} [draggable]
   * @property {(any) => void} [onMove]
   */

  /** @type {Props} */
  let {
    id,
    position,
    color,
    hasBeenMoved,
    draggable = $bindable(false),
    onMove = () => {}
  } = $props();

  let checker = $state();
  let cache;
  let resetDrag = $state(() => {});

  let containerBeforeDrag;

  onMount(() => {
    cache = document.querySelector(".moving-checker-cache");
  });

  $effect(() => {
    draggable = color === $currentPlayer && $onTheMove;
  });

  const onDragStart = () => {
    containerBeforeDrag = checker.parentElement;
    const { left, top } = checker.getBoundingClientRect();
    console.log("onDragStart", left, top, checker);
    cache.appendChild(checker);
    checker.style.position = "absolute";
    checker.style.left = `${left}px`;
    checker.style.top = `${top}px`;
    cache.style.pointerEvents = "auto";
  };

  const onDragEnd = () => {
    const { left, top, width, height } = checker.getBoundingClientRect();
    const checkerCenter = { x: left + width / 2, y: top + height / 2 };
    onMove({
      checker_id: id,
      start: String(position),
      coordinates: checkerCenter,
      reset: () => containerBeforeDrag.appendChild(checker)
    });
    resetDrag();
    cache.style.pointerEvents = "none";
    checker.style.position = "static";
  };
</script>

<Draggable
  {id}
  deactivated={!draggable}
  {onDragStart}
  {onDragEnd}
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
      ></div>
    {/if}
  </div>
</Draggable>

<style>
  .checker {
    position: relative;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin: 0.25rem;
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

  @media (max-width: 768px) {
    .checker {
      width: 1rem;
      height: 1rem;
      margin: 0.05rem;
    }
    .moved {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
</style>
