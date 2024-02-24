import { draw } from "./draw";
import { generate } from "./generate";
import { LARGE, MEDIUM, SMALL } from "./graphs";
import { InputDungeon } from "./types";
import { logStep } from "./utils";

let inputGraph: InputDungeon = LARGE;

/**
 * Entry point to run a dungeon generation and drawing it 🧙‍♂️.
 */
function generateAndDraw() {
  const rootNode = logStep(`Generate ✅`, () => generate(inputGraph));
  logStep(`Draw ✅`, () =>
    draw(rootNode, {
      padding: 4,
      debugWidgets: true,
    })
  );
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

  // Graph selection
  const selectGraph = document.getElementById(
    "select-graph"
  ) as HTMLSelectElement;
  selectGraph.onchange = (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value;
    switch (value) {
      case "small":
        inputGraph = SMALL;
        break;
      case "medium":
        inputGraph = MEDIUM;
        break;
      case "large":
        inputGraph = LARGE;
        break;
    }

    // Once the value changes, we generate and draw the dungeon again
    generateAndDraw();
  };

  // Generate
  const buttonGenerate = document.getElementById(
    "button-generate"
  ) as HTMLButtonElement;
  buttonGenerate.onclick = () => generateAndDraw();

  // GitHub repository
  const buttonGitHub = document.getElementById(
    "button-github"
  ) as HTMLButtonElement;
  buttonGitHub.onclick = () =>
    window.open("https://github.com/halftheopposite/graph-dungeon-generator");
};
