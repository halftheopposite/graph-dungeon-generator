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
  START = "rgb(0,127,0)",
  ROOM = "rgb(0,0,127)",
  BOSS = "rgb(127,0,127)",
  CORRIDOR = "rgb(127,127,0)",
  END = "rgb(127,0,0)",
  WALL = "rgb(0,0,0)",
}

export const ROOM_ITERATIONS_MAX = 100;
export const ROOM_DISTANCE_MIN = 3;
export const ROOM_DISTANCE_MAX = 8;

export const CORRIDOR_ITERATIONS_MAX = 100;
export const CORRIDOR_WIDTH = 4;
