export enum TilesTypes {
  START = 1,
  ROOM = 2,
  BOSS = 3,
  CORRIDOR = 4,
  END = 5,
  WALL = 6,
}

export enum TilesColors {
  START = "rgba(0,127,0,0.5)",
  ROOM = "rgba(0,0,127,0.5)",
  BOSS = "rgba(127,0,127,0.5)",
  CORRIDOR = "rgba(127,127,0,0.5)",
  END = "rgba(127,0,0,0.5)",
  WALL = "rgba(0,0,0,0)",
}

export const ROOM_BACKTRACK_ITERATIONS_MAX = 1000;
export const ROOM_ITERATIONS_MAX = 20;
export const ROOM_DISTANCE_MIN = 3;
export const ROOM_DISTANCE_MAX = 6;

export const CORRIDOR_ITERATIONS_MAX = 20;
export const CORRIDOR_WIDTH = 4;
