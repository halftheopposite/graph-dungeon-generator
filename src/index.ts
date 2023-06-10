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

start();
