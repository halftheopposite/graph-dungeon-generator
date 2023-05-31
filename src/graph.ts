import { GraphDungeon } from "./types";

export const TEST_DUNGEON: GraphDungeon = {
  width: 32,
  height: 32,
  rooms: {
    start: {
      id: "start",
      type: "start",
      connections: ["roomA"],
    },
    roomA: {
      id: "roomA",
      type: "room",
      connections: ["roomB", "roomC"],
    },
    roomB: {
      id: "roomB",
      type: "room",
      connections: ["end"],
    },
    roomC: {
      id: "roomC",
      type: "room",
      connections: [],
    },
    end: {
      id: "end",
      type: "end",
      connections: [],
    },
  },
};
