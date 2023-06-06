import { TEST_DUNGEON } from "./config";
import { draw } from "./draw";
import { generate } from "./generate";
import { logStep } from "./utils";

//
// Entry point of everything 🧙‍♂️
//
function start() {
  const rootNode = logStep(`Generate ✅`, () => generate(TEST_DUNGEON));

  logStep(`Draw ✅`, () => draw(rootNode));
}

start();
