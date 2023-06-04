import { Dungeon } from "./types";

export const TEST_DUNGEON: Dungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["B"],
  },
  B: {
    id: "B",
    type: "room",
    children: ["C", "D"],
  },
  C: {
    id: "C",
    type: "room",
    children: ["end"],
  },
  D: {
    id: "D",
    type: "room",
  },
  end: {
    id: "end",
    type: "end",
  },
};
