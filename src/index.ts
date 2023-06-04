import { TEST_DUNGEON } from "./config";
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
  const rooms = generateDungeon(TEST_DUNGEON);
  // if (rooms.length === 0) {
  //   throw new Error(`Could not generate any rooms.`);
  // }

  // logStep(`Generate ✅`);

  //
  // Draw
  //
  // const tiles = roomsToTiles(rooms);
  // drawTiles(context, tiles);
  // drawGrid(context);

  // logStep(`Draw ✅`);
}

start();
