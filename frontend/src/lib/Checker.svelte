<script>
  import Draggable from "./Draggable.svelte";

  export let position;
  export let color;
  export let triangleCentroids;
  export let draggable = false;

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
          return { distance, triangle: curr.triangle };
        }
        return acc;
      },
      { distance: Infinity, triangle: null }
    ).triangle;
    const newContainer = closestTriangle.querySelector(".checkerContainer");
    if (
      !newContainer.children.length ||
      newContainer.children[0].children[0].classList.contains(color)
    ) {
      console.log(newContainer?.children[0]?.children[0]?.classList);
      closestTriangle.querySelector(".checkerContainer").appendChild(checker);
    }
    resetDrag();
  };
</script>

<Draggable
  deactivated={!draggable}
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
  }
</style>
