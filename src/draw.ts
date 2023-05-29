import { Tile, Tiles } from "./types";
import {
  TILE_VOID,
  TILE_VOID_COLOR,
  TILE_WALL,
  TILE_WALL_COLOR,
  TILE_SIZE,
} from "./config";

export function drawTile(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  tile: Tile
) {
  switch (tile) {
    case TILE_VOID:
      {
        context.fillStyle = TILE_VOID_COLOR;
      }
      break;
    case TILE_WALL:
      {
        context.fillStyle = TILE_WALL_COLOR;
      }
      break;
  }

  context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

export function drawTiles(context: CanvasRenderingContext2D, tiles: Tiles) {
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      drawTile(context, x, y, tiles[y][x]);
    }
  }
}
