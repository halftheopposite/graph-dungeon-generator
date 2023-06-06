import {
  DUNGEON_HEIGHT_UNIT,
  DUNGEON_WIDTH_UNIT,
  TILE_SIZE,
  TILE_VOID_END,
  TILE_VOID_END_COLOR,
  TILE_VOID_ROOM,
  TILE_VOID_ROOM_COLOR,
  TILE_VOID_START,
  TILE_VOID_START_COLOR,
  TILE_WALL,
  TILE_WALL_COLOR,
} from "../config";
import { Node, Room, Tile, Tiles } from "../types";
import { traverseTree, getRoomCenter } from "../utils";
import { createTiles } from "./utils";

//
// Carve
//
export function roomsToTiles(rootNode: Node<Room>): Tiles {
  // Create empty tiles
  const tiles = createTiles(DUNGEON_WIDTH_UNIT, DUNGEON_HEIGHT_UNIT, TILE_WALL);

  // Normalize positions
  normalizeNodesPositions(rootNode);

  // Carve rooms inside tiles
  carveNode(tiles, rootNode);

  return tiles;
}

function normalizeNodesPositions(rootNode: Node<Room>) {
  let lowestX = 0;
  let lowestY = 0;

  // Find lowest X and Y
  traverseTree((node) => {
    if (node.value.position!.x < lowestX) {
      lowestX = node.value.position!.x;
    }

    if (node.value.position!.y < lowestY) {
      lowestY = node.value.position!.y;
    }
  }, rootNode);

  // Offset all positions to avoid negative values
  traverseTree((node) => {
    node.value.position!.x += Math.abs(lowestX);
    node.value.position!.y += Math.abs(lowestY);
  }, rootNode);
}

function carveNode(tiles: Tiles, node: Node<Room>) {
  traverseTree((node) => {
    // Carve current room
    for (let y = 0; y < node.value.dimensions!.height; y++) {
      for (let x = 0; x < node.value.dimensions!.width; x++) {
        const posY = node.value.position!.y + y;
        const posX = node.value.position!.x + x;

        switch (node.value.type) {
          case "start":
            tiles[posY][posX] = TILE_VOID_START;
            break;
          case "room":
            tiles[posY][posX] = TILE_VOID_ROOM;
            break;
          case "end":
            tiles[posY][posX] = TILE_VOID_END;
            break;
        }
      }
    }
  }, node);
}

//
// Draw
//
export function drawTiles(context: CanvasRenderingContext2D, tiles: Tiles) {
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
    case TILE_VOID_START:
      context.fillStyle = TILE_VOID_START_COLOR;
      break;
    case TILE_VOID_ROOM:
      context.fillStyle = TILE_VOID_ROOM_COLOR;
      break;
    case TILE_VOID_END:
      context.fillStyle = TILE_VOID_END_COLOR;
      break;
    case TILE_WALL:
      context.fillStyle = TILE_WALL_COLOR;
      break;
  }

  context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

export function drawConnections(
  context: CanvasRenderingContext2D,
  rootNode: Node<Room>
) {
  context.lineWidth = 2;
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

export function drawGrid(context: CanvasRenderingContext2D) {
  context.lineWidth = 1;
  context.strokeStyle = "white";

  for (let x = 0; x < DUNGEON_WIDTH_UNIT * TILE_SIZE; x += TILE_SIZE) {
    context.moveTo(x, 0);
    context.lineTo(x, DUNGEON_HEIGHT_UNIT * TILE_SIZE);
  }

  for (let y = 0; y < DUNGEON_HEIGHT_UNIT * TILE_SIZE; y += TILE_SIZE) {
    context.moveTo(0, y);
    context.lineTo(DUNGEON_WIDTH_UNIT * TILE_SIZE, y);
  }

  context.stroke();
}
