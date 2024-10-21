<script>
  import { createEventDispatcher } from "svelte";
  import Draggable from "./Draggable.svelte";

  export let id;
  export let position;
  export let color;
  export let triangleCentroids;
  export let draggable = false;
  export let invertX = false;
  export let invertY = false;

  const dispatch = createEventDispatcher();

  let checker;
  let resetDrag = () => {};

  const onDragEnd = () => {
    // on drag end, get the center of the checker and find the closest triangle
    // if the triangle is empty or has checkers of the same color, move the checker
    // to the triangle and reset the drag; otherwise, only reset the drag
    // so that the checker goes back to its original position
    if (!triangleCentroids) return;
    const { left, top, width, height } = checker.getBoundingClientRect();
    const checkerCenter = { x: left + width / 2, y: top + height / 2 };
    const closestTriangle = triangleCentroids.reduce(
      (acc, curr) => {
        const distance = Math.sqrt(
          Math.pow(checkerCenter.x - curr.x, 2) +
            Math.pow(checkerCenter.y - curr.y, 2)
        );
        if (distance < acc.distance) {
          return { distance, ...curr };
        }
        return acc;
      },
      { distance: Infinity, triangle: null }
    );
    if (!closestTriangle.occupiedBy || closestTriangle.occupiedBy === color) {
      console.log(closestTriangle);
      closestTriangle.checkersContainer.appendChild(checker);
      dispatch("move", {
        checker_id: id,
        start: position,
        end: Number(closestTriangle.triangle.dataset.position),
      });
    }
    resetDrag();
  };
</script>

<Draggable
  {id}
  deactivated={!draggable}
  on:dragend={onDragEnd}
  bind:el={checker}
  bind:reset={resetDrag}
  {invertX}
  {invertY}
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
  }
</style>
