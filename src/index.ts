import { TEST_DUNGEON } from "./graph";
import { generate } from "./dungeon";

function start() {
  //
  // Canvas
  //
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Could not find canvas element.`);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log("Canvas ✅");

  //
  // Context
  //
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`Could not get context.`);
  }

  console.log("Context ✅");

  //
  // Generate
  //
  const dungeon = generate(TEST_DUNGEON);

  console.log("Generate 🚧");

  //
  // Draw
  //
  console.log("Draw (🚧)");
}

start();
