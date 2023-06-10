import { draw } from "./draw";
import { generate } from "./generate";
import { LARGE } from "./graphs";
import { logStep } from "./utils";

/**
 * Entry point to run a dungeon generation and drawing it 🧙‍♂️.
 */
function start() {
  const rootNode = logStep(`Generate ✅`, () => generate(LARGE));
  logStep(`Draw ✅`, () => draw(rootNode));
}

/**
 * Will run a high number of dungeon generation and compute a percentage of failed ones.
 * Note: useful to know if you're making progress or regression when updating the dungeon generation code.
 */
function startGenerationTesting() {
  let errorCount = 0;

  for (let i = 0; i < 10000; i++) {
    try {
      generate(LARGE);
    } catch (error) {
      errorCount++;
    }
  }

  const percentage = (errorCount / 10000) * 100;
  console.log(`${percentage}% of rooms couldn't be placed.`);
}

start();
// startGenerationTesting();
