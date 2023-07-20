import { Dimensions, Node, Room, Tiles } from "../types";
import { traverseTree } from "../utils";

/**
 * Initialize an array of array with the `fill` value.
 */
export function createTilemap(
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

/**
 * Create and return a deep copy of a tilemap.
 */
export function duplicateTilemap(tiles: Tiles): Tiles {
  return tiles.map((row) => {
    return [...row];
  });
}

/**
 * Get the dungeon width and height in tiles unit.
 */
export function getDungeonDimensions(rootNode: Node<Room>): Dimensions {
  let dimensions: Dimensions = {
    width: 0,
    height: 0,
  };

  traverseTree((node) => {
    if (!node.value.position || !node.value.dimensions) {
      return;
    }

    const maxX = node.value.position.x + node.value.dimensions.width;
    if (maxX > dimensions.width) {
      dimensions.width = maxX;
    }

    const maxY = node.value.position.y + node.value.dimensions.height;
    if (maxY > dimensions.height) {
      dimensions.height = maxY;
    }
  }, rootNode);

  return dimensions;
}

/**
 * Get the scaled tile size to ensure the dungeon fits into the window.
 */
export function getTileSize(
  canvasDimensions: Dimensions,
  dungeonDimensions: Dimensions
): number {
  const tileWidth = Math.floor(
    canvasDimensions.width / dungeonDimensions.width
  );
  const tileHeight = Math.floor(
    canvasDimensions.height / dungeonDimensions.height
  );

  return tileWidth < tileHeight ? tileWidth : tileHeight;
}
