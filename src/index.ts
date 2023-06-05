import { TEST_DUNGEON } from "./config";
import { generateDungeon } from "./generate";
import { drawGrid, drawTiles, roomsToTiles } from "./draw";

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
  const rootNode = generateDungeon(TEST_DUNGEON);
  if (!rootNode) {
    throw new Error(`Could not generate dungeon.`);
  }

  logStep(`Generate ✅`);

  //
  // Draw
  //
  const tiles = roomsToTiles(rootNode);
  drawTiles(context, tiles);
  drawGrid(context);

  logStep(`Draw ✅`);
}

start();
