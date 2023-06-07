import { Direction, Node, Room } from "../types";
import { traverseTree } from "../utils";
import { AABB } from "./collisions";

/**
 * Get a random integer between `min` and `max`.
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Randomly pick an item in `values`.
 */
export function randomChoice<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Transform a Node<Room> to a bounding box.
 */
export function nodeRoomToAABB(node: Node<Room>): AABB {
  const box: AABB = {
    id: node.value.id,
    startX: node.value.position!.x,
    endX: node.value.position!.x + node.value.dimensions!.width,
    startY: node.value.position!.y,
    endY: node.value.position!.y + node.value.dimensions!.height,
  };

  return box;
}

/**
 * Normalize a node tree to avoid having negative positions.
 */
export function normalizeRoomsPositions(rootNode: Node<Room>) {
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

/**
 * Compute the direction of a `child` relative to its `parent`.
 */
export function getRelativeChildDirectionAndDistance(
  parent: Node<Room>,
  child: Node<Room>
): {
  distance: number;
  direction: Direction;
} {
  const parentBox = nodeRoomToAABB(parent);
  const childBox = nodeRoomToAABB(child);

  // North
  if (parentBox.startY >= childBox.endY) {
    const distance = Math.abs(parentBox.startY - childBox.endY);

    return {
      direction: "n",
      distance,
    };
  }
  // South
  else if (parentBox.endY <= childBox.startY) {
    const distance = Math.abs(parentBox.endY - childBox.startY);

    return {
      direction: "s",
      distance,
    };
  }
  // West
  else if (parentBox.startX >= childBox.endX) {
    const distance = Math.abs(parentBox.startX - childBox.endX);

    return {
      direction: "w",
      distance,
    };
  }
  // East
  else if (parentBox.endX <= childBox.startX) {
    const distance = Math.abs(parentBox.endX - childBox.startX);

    return {
      direction: "e",
      distance,
    };
  }

  throw new Error(
    `Could not compute direction between parent "${parent.value.id}" and child "${child.value.id}".`
  );
}
