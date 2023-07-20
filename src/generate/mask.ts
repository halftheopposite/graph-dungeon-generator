import { TilesTypes } from "../config";
import { duplicateTilemap } from "../draw/utils";
import { Tiles } from "../types";

const MASK_TO_TILE_ID = {
  2: 1,
  8: 2,
  10: 3,
  11: 4,
  16: 5,
  18: 6,
  22: 7,
  24: 8,
  26: 9,
  27: 10,
  30: 11,
  31: 12,
  64: 13,
  66: 14,
  72: 15,
  74: 16,
  75: 17,
  80: 18,
  82: 19,
  86: 20,
  88: 21,
  90: 22,
  91: 23,
  94: 24,
  95: 25,
  104: 26,
  106: 27,
  107: 28,
  120: 29,
  122: 30,
  123: 31,
  126: 32,
  127: 33,
  208: 34,
  210: 35,
  214: 36,
  216: 37,
  218: 38,
  219: 39,
  222: 40,
  223: 41,
  246: 36,
  248: 42,
  250: 43,
  251: 44,
  254: 45,
  255: 46,
  0: 47,
};

enum TileDirection {
  NorthWest = 1,
  North = 2,
  NorthEast = 4,
  West = 8,
  East = 16,
  SouthWest = 32,
  South = 64,
  SouthEast = 128,
}

export function computeTilesMask(tiles: Tiles) {
  const copy = duplicateTilemap(tiles);

  for (let y = 0; y < copy.length; y++) {
    for (let x = 0; x < copy[y].length; x++) {
      if (copy[y][x] === 1) {
        copy[y][x] = computeTileMask(x, y, copy);
      }
    }
  }

  return copy;
}

function computeTileMask(x: number, y: number, tiles: Tiles): number {
  let mask = 0;

  if (tileCollidesOnSide(x, y, "north", tiles)) {
    mask |= TileDirection.North;
  }

  if (tileCollidesOnSide(x, y, "west", tiles)) {
    mask |= TileDirection.West;
  }

  if (tileCollidesOnSide(x, y, "east", tiles)) {
    mask |= TileDirection.East;
  }

  if (tileCollidesOnSide(x, y, "south", tiles)) {
    mask |= TileDirection.South;
  }

  if (
    mask & TileDirection.North &&
    mask & TileDirection.West &&
    tileCollidesOnSide(x, y, "north-west", tiles)
  ) {
    mask |= TileDirection.NorthWest;
  }

  if (
    mask & TileDirection.North &&
    mask & TileDirection.East &&
    tileCollidesOnSide(x, y, "north-east", tiles)
  ) {
    mask |= TileDirection.NorthEast;
  }

  if (
    mask & TileDirection.South &&
    mask & TileDirection.West &&
    tileCollidesOnSide(x, y, "south-west", tiles)
  ) {
    mask |= TileDirection.SouthWest;
  }

  if (
    mask & TileDirection.South &&
    mask & TileDirection.East &&
    tileCollidesOnSide(x, y, "south-east", tiles)
  ) {
    mask |= TileDirection.SouthEast;
  }

  return MASK_TO_TILE_ID[mask];
}

function tileCollidesOnSide(
  x: number,
  y: number,
  side:
    | "north"
    | "west"
    | "east"
    | "south"
    | "north-west"
    | "north-east"
    | "south-west"
    | "south-east",
  tiles: Tiles
): boolean {
  const isLeft = x === 0;
  const isRight = x === tiles[y].length - 1;
  const isTop = y === 0;
  const isBottom = y === tiles.length - 1;

  switch (side) {
    case "north":
      return isTop || tiles[y - 1][x] > 0;
    case "west":
      return isLeft || tiles[y][x - 1] > 0;
    case "east":
      return isRight || tiles[y][x + 1] > 0;
    case "south":
      return isBottom || tiles[y + 1][x] > 0;
    case "north-west":
      return isLeft || isTop || tiles[y - 1][x - 1] > 0;
    case "north-east":
      return isRight || isTop || tiles[y - 1][x + 1] > 0;
    case "south-west":
      return isLeft || isBottom || tiles[y + 1][x - 1] > 0;
    case "south-east":
      return isRight || isBottom || tiles[y + 1][x + 1] > 0;
  }
}
