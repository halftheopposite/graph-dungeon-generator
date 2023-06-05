import { Tiles } from "../types";

export function createTiles(
  width: number,
  height: number,
  fill: number
): Tiles {
  const tiles: Tiles = [];

  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = fill;
    }
  }

  return tiles;
}
