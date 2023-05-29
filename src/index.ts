import { drawTiles } from "./draw";

function start() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Could not find canvas element.`);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log("Canvas ✅");

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`Could not get context.`);
  }

  console.log("Context ✅");

  drawTiles(context, [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
}

start();
