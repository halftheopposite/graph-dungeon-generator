import { GraphDungeon } from "./types";

export const TEST_DUNGEON: GraphDungeon = {
  width: 32,
  height: 32,
  rooms: {
    start: {
      id: "start",
      type: "start",
      parent: undefined,
      children: ["roomA"],
    },
    roomA: {
      id: "roomA",
      type: "room",
      parent: "start",
      children: ["roomB", "roomC"],
    },
    roomB: {
      id: "roomB",
      type: "room",
      parent: "roomA",
      children: ["end"],
    },
    roomC: {
      id: "roomC",
      type: "room",
      parent: "roomA",
      children: [],
    },
    end: {
      id: "end",
      type: "end",
      parent: "roomB",
      children: [],
    },
  },
};
