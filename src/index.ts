import { draw } from "./draw";
import { generate } from "./generate";
import { MEDIUM } from "./graphs";
import { logStep } from "./utils";

//
// Entry point of everything 🧙‍♂️
//
function start() {
  const rootNode = logStep(`Generate ✅`, () => generate(MEDIUM));

  logStep(`Draw ✅`, () => draw(rootNode));
}

start();
