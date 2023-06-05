import { InputDungeon } from "./types";

export const TILE_SIZE = 64;

export const TILE_VOID_START = 1;
export const TILE_VOID_ROOM = 2;
export const TILE_VOID_END = 3;
export const TILE_WALL = 4;

export const TILE_VOID_START_COLOR = "rgba(0,127,0)";
export const TILE_VOID_ROOM_COLOR = "rgba(0,0,127)";
export const TILE_VOID_END_COLOR = "rgba(127,0,0)";
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
