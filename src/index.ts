import { draw } from "./draw";
import { generate } from "./generate";
import { LARGE } from "./graphs";
import { logStep } from "./utils";

/**
 * Entry point to run a dungeon generation and drawing it 🧙‍♂️.
 */
function generateAndDraw() {
  const rootNode = logStep(`Generate ✅`, () => generate(LARGE));
  logStep(`Draw ✅`, () => draw(rootNode));
}

/**
 * ⚠️ UNCOMMENT WHEN NEEDED ⚠️
 * Will run a high number of dungeon generations and compute a percentage of failed ones.
 * Useful to know if you're making progress or regressing when updating the dungeon generation algorithm.
 */
function testGenerationSuccessRate() {
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

window.onload = () => {
  generateAndDraw();

  const buttonGenerate = document.getElementById(
    "button-generate"
  ) as HTMLButtonElement;
  buttonGenerate.onclick = () => generateAndDraw();

  const buttonGitHub = document.getElementById(
    "button-github"
  ) as HTMLButtonElement;
  buttonGitHub.onclick = () =>
    window.open("https://github.com/halftheopposite/graph-dungeon-generator");
};
