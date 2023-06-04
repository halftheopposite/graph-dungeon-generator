import { InputDungeon } from "./types";

export const TILE_SIZE = 32;

export const TILE_VOID = 0;
export const TILE_WALL = 1;

export const TILE_VOID_COLOR = "rgba(127,0,0)";
export const TILE_WALL_COLOR = "rgba(0,0,0)";

export const DUNGEON_WIDTH_UNIT = 128;
export const DUNGEON_HEIGHT_UNIT = 128;

export const ROOM_PLACEMENT_ITERATIONS_MAX = 1000;

export const TEST_DUNGEON: InputDungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["B", "C"],
  },
  B: {
    id: "B",
    type: "room",
    children: ["D", "E"],
  },
  C: {
    id: "C",
    type: "room",
    children: [],
  },
  D: {
    id: "D",
    type: "room",
    children: ["end"],
  },
  E: {
    id: "E",
    type: "room",
    children: [],
  },
  end: {
    id: "end",
    type: "end",
    children: [],
  },
};
