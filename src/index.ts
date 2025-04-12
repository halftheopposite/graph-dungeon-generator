import { draw } from "./draw";
import { generate } from "./generate/index";
import { LARGE } from "./graphs";
import { InputDungeon } from "./types";
import { getDungeonById, logStep } from "./utils";

let inputGraph: InputDungeon = LARGE;

/**
 * Entry point to run a dungeon generation and drawing it 🧙‍♂️.
 */
function generateAndDraw(graph: InputDungeon) {
  try {
    const rootNode = logStep(`Generate ✅`, () => generate(graph));
    logStep(`Draw ✅`, () =>
      draw(rootNode, {
        padding: 4,
        debugWidgets: true,
      })
    );
  } catch (error) {
    console.error(error);
    return;
  }
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
      generate(inputGraph);
    } catch (error) {
      errorCount++;
    }
  }

  const percentage = (errorCount / 10000) * 100;
  console.log(`${percentage}% of rooms couldn't be placed.`);
}

window.onload = () => {
  generateAndDraw(inputGraph);

  // Graph selection
  const selectGraph = document.getElementById(
    "select-graph"
  ) as HTMLSelectElement;
  selectGraph.onchange = (event) => {
    const value = (event.currentTarget as HTMLSelectElement).value;
    inputGraph = getDungeonById(value);

    // Once the value changes, we generate and draw the dungeon again
    generateAndDraw(inputGraph);
  };

  // Generate
  const buttonGenerate = document.getElementById(
    "button-generate"
  ) as HTMLButtonElement;
  buttonGenerate.onclick = () => generateAndDraw(inputGraph);

  // GitHub repository
  const buttonGitHub = document.getElementById(
    "button-github"
  ) as HTMLButtonElement;
  buttonGitHub.onclick = () =>
    window.open("https://github.com/halftheopposite/graph-dungeon-generator");
};
