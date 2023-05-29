import { GraphDungeon } from "./types";

export const TEST_DUNGEON: GraphDungeon = {
  start: {
    id: "start",
    type: "start",
    connexions: ["end"],
  },
  end: {
    id: "end",
    type: "end",
    connexions: ["start"],
  },
};
