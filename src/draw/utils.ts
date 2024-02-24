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
 * Pad a tilemap on all sides.
 * ⚠️ Note: currently not used, but could serve as a convenient method.
 */
export function padTilemap(
  tiles: Tiles,
  paddingWidth: number,
  fill: number
): Tiles {
  const copy = duplicateTilemap(tiles);

  const newLine = new Array(tiles[0].length).fill(fill);

  for (let i = 0; i < paddingWidth; i++) {
    copy.unshift(newLine);
    copy.push(newLine);
  }

  return copy.map((row) => {
    return [
      ...new Array(paddingWidth).fill(fill),
      ...row,
      ...new Array(paddingWidth).fill(fill),
    ];
  });
}

/**
 * Pad a tree of nodes.
 */
export function padNodes(rootNode: Node<Room>, padding: number) {
  traverseTree((node) => {
    if (!node.value.position || !node.value.dimensions) {
      return;
    }

    node.value.position.y += padding;
    node.value.position.x += padding;

    if (node.value.corridor) {
      node.value.corridor.position.y += padding;
      node.value.corridor.position.x += padding;
    }
  }, rootNode);
}

/**
 * Get the dungeon width and height in tiles unit.
 */
export function getDungeonDimensions(
  rootNode: Node<Room>,
  padding: number
): Dimensions {
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

  // We add padding to the overall dimension
  dimensions.width += padding * 2;
  dimensions.height += padding * 2;

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
