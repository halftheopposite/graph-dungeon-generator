import { TEST_DUNGEON } from "./graph";
import { generateDungeon } from "./generate";

let lastStepInMS = 0;

function logStep(name: string) {
  console.log(`${name} (${performance.now() - lastStepInMS}ms)`);
  lastStepInMS = performance.now();
}

function start() {
  lastStepInMS = performance.now();

  //
  // Canvas
  //
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Could not find canvas element.`);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  logStep(`Canvas ✅`);

  //
  // Context
  //
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`Could not get context.`);
  }

  logStep(`Context ✅`);

  //
  // Generate
  //
  const dungeon = generateDungeon(TEST_DUNGEON);

  logStep(`Generate 🚧`);

  //
  // Draw
  //
  logStep(`Draw 🚧`);
}

start();
