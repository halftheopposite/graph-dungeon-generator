import { TEST_DUNGEON } from "./config";
import { draw } from "./draw";
import { generate } from "./generate";
import { Node, Room } from "./types";
import { logStep } from "./utils";

function start() {
  const rootNode = logStep<Node<Room>>(`Generate ✅`, () =>
    generate(TEST_DUNGEON)
  );

  logStep(`Draw ✅`, () => draw(rootNode));
}

start();
