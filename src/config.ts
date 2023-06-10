export const TILE_SIZE = 16;

export enum TILES_TYPES {
  START = 1,
  ROOM = 2,
  BOSS = 3,
  CORRIDOR = 4,
  END = 5,
  WALL = 6,
}

export enum TILES_COLORS {
  START = "rgba(0,127,0)",
  ROOM = "rgba(0,0,127)",
  BOSS = "rgba(127,0,127)",
  CORRIDOR = "rgba(127,127,0)",
  END = "rgba(127,0,0)",
  WALL = "rgba(0,0,0)",
}

export const ROOM_ITERATIONS_MAX = 20;
export const ROOM_DISTANCE_MIN = 3;
export const ROOM_DISTANCE_MAX = 5;

export const CORRIDOR_ITERATIONS_MAX = 20;
export const CORRIDOR_WIDTH = 4;
