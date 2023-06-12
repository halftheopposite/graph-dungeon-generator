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
  START = "rgba(0,127,0,1)",
  ROOM = "rgba(0,0,127,1)",
  BOSS = "rgba(127,0,127,1)",
  CORRIDOR = "rgba(127,127,0,1)",
  END = "rgba(127,0,0,1)",
  WALL = "rgba(0,0,0,0)",
}

export const ROOM_BACKTRACK_ITERATIONS_MAX = 1000;
export const ROOM_ITERATIONS_MAX = 20;
export const ROOM_DISTANCE_MIN = 3;
export const ROOM_DISTANCE_MAX = 6;

export const CORRIDOR_ITERATIONS_MAX = 20;
export const CORRIDOR_WIDTH = 4;
