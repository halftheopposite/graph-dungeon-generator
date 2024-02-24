import { TilesColors, TilesTypes } from "../config";
import { Dimensions, Node, Room, Tile, Tiles } from "../types";
import { getRoomCenter, traverseTree } from "../utils";
import { initializeContext } from "./canvas";
import { computeTilesMask } from "./mask";
import { tilesTextures } from "./tiles";
import {
  createTilemap,
  duplicateTilemap,
  getDungeonDimensions,
  getTileSize,
  padNodes,
} from "./utils";

interface DrawOptions {
  /** The amount of padding to apply to the dungeon's tilemap. */
  padding?: number;
  /** Wether or not to draw debugging widgets (ex: grid lines, connections, ids, etc.). */
  debugWidgets?: boolean;
}

/**
 * Entrypoint method to:
 * - Get a reference to the Canvas' context
 * - Transform rooms and corridors to tiles
 * - Draw widgets such as room names and connections (optional)
 *
 * Note: all transformations to data are done by reference.
 */
export function draw(rootNode: Node<Room>, options: DrawOptions = {}) {
  const { context, canvasDimensions } = initializeContext();

  const padding =
    !!options.padding && !isNaN(options.padding) && options.padding > 0
      ? options.padding
      : 0;
  const debugWidgets = !!options.debugWidgets;

  // Find dungeon's width and height
  const dungeonDimensions = getDungeonDimensions(rootNode, padding);
  const tileSize = getTileSize(canvasDimensions, dungeonDimensions);

  // Create empty tilesmap
  let tiles = createTilemap(
    dungeonDimensions.width,
    dungeonDimensions.height,
    TilesTypes.WALL
  );

  // Add some padding to the tilemap for a more visually appealing result
  padNodes(rootNode, padding);

  // Carve rooms and corridors into the tilesmap
  tiles = carveRooms(tiles, rootNode);
  tiles = carveCorridors(tiles, rootNode);

  // Draw tiles
  drawTilesMask(context, tileSize, tiles);
  drawTiles(context, tileSize, tiles);

  // Draw widgets
  if (debugWidgets) {
    drawGrid(context, tileSize, canvasDimensions);
    drawConnections(context, tileSize, rootNode);
    drawRoomIds(context, tileSize, rootNode);
  }
}

//
// Carve
//
function carveRooms(tiles: Tiles, node: Node<Room>): Tiles {
  let copy = duplicateTilemap(tiles);

  traverseTree((node) => {
    if (!node.value.position || !node.value.dimensions) {
      return;
    }

    for (let y = 0; y < node.value.dimensions.height; y++) {
      for (let x = 0; x < node.value.dimensions.width; x++) {
        const posY = node.value.position.y + y;
        const posX = node.value.position.x + x;

        switch (node.value.type) {
          case "start":
            copy[posY][posX] = TilesTypes.START;
            break;
          case "room":
            copy[posY][posX] = TilesTypes.ROOM;
            break;
          case "boss":
            copy[posY][posX] = TilesTypes.BOSS;
            break;
          case "end":
            copy[posY][posX] = TilesTypes.END;
            break;
        }
      }
    }
  }, node);

  return copy;
}

function carveCorridors(tiles: Tiles, node: Node<Room>): Tiles {
  let copy = duplicateTilemap(tiles);

  traverseTree((node) => {
    if (!node.value.corridor) {
      return;
    }

    for (let y = 0; y < node.value.corridor.dimensions.height; y++) {
      for (let x = 0; x < node.value.corridor.dimensions.width; x++) {
        const posY = node.value.corridor.position.y + y;
        const posX = node.value.corridor.position.x + x;

        copy[posY][posX] = TilesTypes.CORRIDOR;
      }
    }
  }, node);

  return copy;
}

//
// Draw: widgets
//
function drawGrid(
  context: CanvasRenderingContext2D,
  tileSize: number,
  canvasDimensions: Dimensions
) {
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = "rgba(0,200,0,0.5)";

  // Draw columns
  for (let x = 0.5; x < canvasDimensions.width; x += tileSize) {
    context.moveTo(x, 0);
    context.lineTo(x, canvasDimensions.height);
  }

  // Draw rows
  for (let y = 0.5; y < canvasDimensions.height; y += tileSize) {
    context.moveTo(0, y);
    context.lineTo(canvasDimensions.width, y);
  }

  context.stroke();
  context.closePath();
}

function drawConnections(
  context: CanvasRenderingContext2D,
  tileSize: number,
  rootNode: Node<Room>
) {
  context.beginPath();
  context.lineWidth = 1.5;
  context.strokeStyle = "white";

  traverseTree((node) => {
    const parentCenter = getRoomCenter(node);

    node.children.forEach((child) => {
      const childCenter = getRoomCenter(child);

      context.moveTo(parentCenter.x * tileSize, parentCenter.y * tileSize);
      context.lineTo(childCenter.x * tileSize, childCenter.y * tileSize);
    });
  }, rootNode);

  context.stroke();
  context.closePath();
}

function drawRoomIds(
  context: CanvasRenderingContext2D,
  tileSize: number,
  rootNode: Node<Room>
) {
  context.font = "16px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";

  traverseTree((node) => {
    const parentCenter = getRoomCenter(node);

    context.fillText(
      node.value.id,
      parentCenter.x * tileSize,
      parentCenter.y * tileSize
    );
  }, rootNode);
}

//
// Draw: tiles
//
function drawTiles(
  context: CanvasRenderingContext2D,
  tileSize: number,
  tiles: Tiles
) {
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      drawTile(context, tileSize, x, y, tiles[y][x]);
    }
  }
}

function drawTile(
  context: CanvasRenderingContext2D,
  tileSize: number,
  x: number,
  y: number,
  tile: Tile
) {
  switch (tile) {
    case TilesTypes.WALL:
      context.fillStyle = TilesColors.WALL;
      break;
    case TilesTypes.START:
      context.fillStyle = TilesColors.START;
      break;
    case TilesTypes.ROOM:
      context.fillStyle = TilesColors.ROOM;
      break;
    case TilesTypes.BOSS:
      context.fillStyle = TilesColors.BOSS;
      break;
    case TilesTypes.CORRIDOR:
      context.fillStyle = TilesColors.CORRIDOR;
      break;
    case TilesTypes.END:
      context.fillStyle = TilesColors.END;
      break;
  }

  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

//
// Draw: tiles mask
//
function drawTilesMask(
  context: CanvasRenderingContext2D,
  tileSize: number,
  tiles: Tiles
) {
  // Normalize the tilemap (1 for walls, 0 for everything else)
  const normalized = normalizeTilemap(tiles);

  // Compute the bitmask tilesmap
  const mask = computeTilesMask(normalized);

  for (let y = 0; y < mask.length; y++) {
    for (let x = 0; x < mask[y].length; x++) {
      const tileId = mask[y][x];
      const texture = tilesTextures[tileId];

      if (texture) {
        context.drawImage(
          texture,
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
}

function normalizeTilemap(tiles: Tiles): Tiles {
  const copy = duplicateTilemap(tiles);

  for (let y = 0; y < copy.length; y++) {
    for (let x = 0; x < copy[y].length; x++) {
      copy[y][x] = copy[y][x] === TilesTypes.WALL ? 1 : 0;
    }
  }

  return copy;
}
