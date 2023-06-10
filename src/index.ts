import { draw } from "./draw";
import { generate } from "./generate";
import { LARGE } from "./graphs";
import { logStep } from "./utils";

//
// Entry point of everything 🧙‍♂️
//
function start() {
  const rootNode = logStep(`Generate ✅`, () => generate(LARGE));
  logStep(`Draw ✅`, () => draw(rootNode));
}

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
