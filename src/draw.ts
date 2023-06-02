import {
  DUNGEON_HEIGHT_UNIT,
  DUNGEON_WIDTH_UNIT,
  TILE_SIZE,
  TILE_VOID,
  TILE_VOID_COLOR,
  TILE_WALL,
  TILE_WALL_COLOR,
} from "./config";
import { Room, Tile, Tiles } from "./types";

//
// Dungeon
//
export function roomsToTiles(rooms: Room[]): Tiles {
  // Create empty tiles
  const tiles: Tiles = [];
  for (let y = 0; y < DUNGEON_HEIGHT_UNIT; y++) {
    tiles[y] = [];
    for (let x = 0; x < DUNGEON_WIDTH_UNIT; x++) {
      tiles[y][x] = TILE_WALL;
    }
  }

  // Carve rooms inside tiles
  rooms.forEach((room) => {
    for (let y = 0; y < room.dimensions.height; y++) {
      for (let x = 0; x < room.dimensions.width; x++) {
        const posY = room.position.y + y;
        const posX = room.position.x + x;
        tiles[posY][posX] = TILE_VOID;
      }
    }
  });

  return tiles;
}

//
// Tiles
//
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

//
// Helpers
//
export function drawGrid(context: CanvasRenderingContext2D) {
  for (let x = 0; x < DUNGEON_WIDTH_UNIT * TILE_SIZE; x += TILE_SIZE) {
    context.moveTo(x, 0);
    context.lineTo(x, DUNGEON_HEIGHT_UNIT * TILE_SIZE);
  }

  for (let y = 0; y < DUNGEON_HEIGHT_UNIT * TILE_SIZE; y += TILE_SIZE) {
    context.moveTo(0, y);
    context.lineTo(DUNGEON_WIDTH_UNIT * TILE_SIZE, y);
  }

  context.strokeStyle = "white";
  context.stroke();
}
