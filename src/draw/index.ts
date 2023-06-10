import { TILE_SIZE, TILES_COLORS, TILES_TYPES } from "../config";
import { Dimensions, Node, Room, Tile, Tiles } from "../types";
import { getRoomCenter, traverseTree } from "../utils";
import { initializeContext } from "./canvas";
import { getDungeonDimensions, initializeTilemap } from "./utils";

/**
 * Entrypoint method to:
 * - Get a reference to the Canvas' context
 * - Transform rooms and corridors to tiles
 * - Draw widgets such as room names and connections
 */
export function draw(rootNode: Node<Room>) {
  const context = initializeContext();

  // Find dungeon's width and height
  const dimensions = getDungeonDimensions(rootNode);

  // Create empty tilesmap
  const tiles = initializeTilemap(
    dimensions.width,
    dimensions.height,
    TILES_TYPES.WALL
  );

  // Carve rooms and corridors into tilesmap
  carveRooms(tiles, rootNode);
  carveCorridors(tiles, rootNode);

  // Draw everything on a canvas
  drawTiles(context, tiles);
  drawGrid(context, dimensions);
  drawConnections(context, rootNode);
  drawRoomIds(context, rootNode);
}

//
// Carve
//
function carveRooms(tiles: Tiles, node: Node<Room>) {
  traverseTree((node) => {
    for (let y = 0; y < node.value.dimensions!.height; y++) {
      for (let x = 0; x < node.value.dimensions!.width; x++) {
        const posY = node.value.position!.y + y;
        const posX = node.value.position!.x + x;

        switch (node.value.type) {
          case "start":
            tiles[posY][posX] = TILES_TYPES.START;
            break;
          case "room":
            tiles[posY][posX] = TILES_TYPES.ROOM;
            break;
          case "room":
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

    for (let y = 0; y < node.value.corridor!.dimensions!.height; y++) {
      for (let x = 0; x < node.value.corridor!.dimensions!.width; x++) {
        const posY = node.value.corridor.position!.y + y;
        const posX = node.value.corridor.position!.x + x;

        tiles[posY][posX] = TILES_TYPES.CORRIDOR;
      }
    }
  }, node);
}

//
// Draw
//
function drawTiles(context: CanvasRenderingContext2D, tiles: Tiles) {
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      drawTile(context, x, y, tiles[y][x]);
    }
  }
}

function drawTile(
  context: CanvasRenderingContext2D,
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

  context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawConnections(
  context: CanvasRenderingContext2D,
  rootNode: Node<Room>
) {
  context.lineWidth = 1.5;
  context.strokeStyle = "white";

  traverseTree((node) => {
    const parentCenter = getRoomCenter(node);

    node.children.forEach((child) => {
      const childCenter = getRoomCenter(child);

      context.moveTo(parentCenter.x * TILE_SIZE, parentCenter.y * TILE_SIZE);
      context.lineTo(childCenter.x * TILE_SIZE, childCenter.y * TILE_SIZE);
    });
  }, rootNode);

  context.stroke();
}

function drawRoomIds(context: CanvasRenderingContext2D, rootNode: Node<Room>) {
  context.font = "16px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";

  traverseTree((node) => {
    const parentCenter = getRoomCenter(node);

    context.fillText(
      node.value.id,
      parentCenter.x * TILE_SIZE,
      parentCenter.y * TILE_SIZE
    );
  }, rootNode);
}

function drawGrid(context: CanvasRenderingContext2D, dimensions: Dimensions) {
  context.lineWidth = 0.5;
  context.strokeStyle = "white";

  const pixelWidth = dimensions.width * TILE_SIZE;
  const pixelHeight = dimensions.height * TILE_SIZE;

  // Draw columns
  for (let x = 0; x <= pixelWidth; x += TILE_SIZE) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, pixelHeight);
    context.stroke();
  }

  // Draw rows
  for (let y = 0; y <= pixelHeight; y += TILE_SIZE) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(pixelWidth, y);
    context.stroke();
  }
}
