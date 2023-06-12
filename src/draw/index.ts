import { TILES_COLORS, TILES_TYPES } from "../config";
import { Dimensions, Node, Room, Tile, Tiles } from "../types";
import { getRoomCenter, traverseTree } from "../utils";
import { initializeContext } from "./canvas";
import { getDungeonDimensions, getTileSize, initializeTilemap } from "./utils";

/**
 * Entrypoint method to:
 * - Get a reference to the Canvas' context
 * - Transform rooms and corridors to tiles
 * - Draw widgets such as room names and connections
 *
 * Note: all transformations to data are done by reference.
 */
export function draw(rootNode: Node<Room>) {
  const { context, canvasDimensions } = initializeContext();

  // Find dungeon's width and height
  const dungeonDimensions = getDungeonDimensions(rootNode);
  const tileSize = getTileSize(canvasDimensions, dungeonDimensions);

  // Create empty tilesmap
  const tiles = initializeTilemap(
    dungeonDimensions.width,
    dungeonDimensions.height,
    TILES_TYPES.WALL
  );

  // Carve rooms and corridors into the tilesmap
  carveRooms(tiles, rootNode);
  carveCorridors(tiles, rootNode);

  // Draw everything on a canvas
  drawGrid(context, tileSize, canvasDimensions);
  drawTiles(context, tileSize, tiles);
  drawConnections(context, tileSize, rootNode);
  drawRoomIds(context, tileSize, rootNode);
}

//
// Carve
//
function carveRooms(tiles: Tiles, node: Node<Room>) {
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
            tiles[posY][posX] = TILES_TYPES.START;
            break;
          case "room":
            tiles[posY][posX] = TILES_TYPES.ROOM;
            break;
          case "boss":
            tiles[posY][posX] = TILES_TYPES.BOSS;
            break;
          case "end":
            tiles[posY][posX] = TILES_TYPES.END;
            break;
        }
      }
    }
  }, node);
}

function carveCorridors(tiles: Tiles, node: Node<Room>) {
  traverseTree((node) => {
    if (!node.value.corridor) {
      return;
    }

    for (let y = 0; y < node.value.corridor.dimensions.height; y++) {
      for (let x = 0; x < node.value.corridor.dimensions.width; x++) {
        const posY = node.value.corridor.position.y + y;
        const posX = node.value.corridor.position.x + x;

        tiles[posY][posX] = TILES_TYPES.CORRIDOR;
      }
    }
  }, node);
}

//
// Draw
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
    case TILES_TYPES.START:
      context.fillStyle = TILES_COLORS.START;
      break;
    case TILES_TYPES.ROOM:
      context.fillStyle = TILES_COLORS.ROOM;
      break;
    case TILES_TYPES.BOSS:
      context.fillStyle = TILES_COLORS.BOSS;
      break;
    case TILES_TYPES.CORRIDOR:
      context.fillStyle = TILES_COLORS.CORRIDOR;
      break;
    case TILES_TYPES.END:
      context.fillStyle = TILES_COLORS.END;
      break;
    case TILES_TYPES.WALL:
      context.fillStyle = TILES_COLORS.WALL;
      break;
  }

  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
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
