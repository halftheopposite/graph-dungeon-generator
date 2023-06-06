import {
  Dimensions,
  Direction,
  InputDungeon,
  Node,
  Room,
  RoomId,
  Vector2,
} from "../types";
import { AABB, AABBManager } from "./collisions";
import { getRandomInt, nodeRoomToAABB, randomChoice } from "./utils";

const MAX_ROOM_ITERATIONS = 20;
const MAX_CORRIDOR_ITERATIONS = 20;
const DISTANCE = 3;
const CORRIDOR_WIDTH = 2;

export function generateDungeon(dungeon: InputDungeon): Node<Room> {
  const baseTree = createTree(dungeon);
  const filledTree = generate(baseTree);

  return filledTree;
}

//
// Parse input dungeon
//
export function createTree(dungeon: InputDungeon): Node<Room> {
  return createNode(dungeon, "start");
}

function createNode(dungeon: InputDungeon, roomId: RoomId): Node<Room> {
  const room = dungeon[roomId];
  if (!room) {
    throw new Error(`Could not find "${roomId}" to generate tree.`);
  }

  const node = new Node<Room>({
    id: room.id,
    type: room.type,
  });

  room.children.map((item) => {
    const childNode = createNode(dungeon, item);
    node.addChild(childNode);
  });

  return node;
}

//
// Generate and place rooms
//
function generate(rootNode: Node<Room>) {
  const aabbManager = new AABBManager();

  // Initialize the queue with the root node
  const queue: Node<Room>[] = [rootNode];

  while (queue.length > 0) {
    const node = queue.shift() as Node<Room>;

    console.log(
      `→ Processing "${node.value.id}" (parent: "${node.parent?.value.id}")...`
    );

    // Attempt to place room
    placeRoom(aabbManager, node);
    placeCorridor(aabbManager, node);

    // Enqueue the children of the current node
    for (const child of node.children) {
      queue.push(child);
    }
  }

  return rootNode;
}

function placeRoom(
  aabbManager: AABBManager,
  node: Node<Room>,
  iterations: number = MAX_ROOM_ITERATIONS
) {
  if (iterations === 0) {
    throw new Error(
      `Could not place room under "${MAX_ROOM_ITERATIONS}" iterations.`
    );
  }

  // Generate dimensions and position
  const dimensions = generateRoomDimensions(node);
  const position = generateRoomPosition(node, dimensions);

  // Create box to check for collisions
  const box: AABB = {
    id: node.value.id,
    startX: position.x,
    startY: position.y,
    endX: position.x + dimensions.width,
    endY: position.y + dimensions.height,
  };

  // Check collisions
  if (aabbManager.collides(box)) {
    console.log(` ↳ Trying again (${iterations - 1} left)...`);
    return placeRoom(aabbManager, node, iterations - 1);
  }

  node.value.dimensions = dimensions;
  node.value.position = position;
  aabbManager.addBox(box);
}

function placeCorridor(
  aabbManager: AABBManager,
  node: Node<Room>,
  iterations: number = MAX_CORRIDOR_ITERATIONS
) {
  if (iterations === 0) {
    throw new Error(
      `Could not place corridor under "${MAX_CORRIDOR_ITERATIONS}" iterations.`
    );
  }

  // Find startX and startY: check on both axis for overlaps
  // Find endX and endY: check on both axis for overlaps
  // Infer dimensions
}

//
// Utils
//
function generateRoomDimensions(node: Node<Room>): Dimensions {
  switch (node.value.type) {
    case "start":
      return {
        width: getRandomInt(5, 6),
        height: getRandomInt(5, 6),
      };
    case "room":
      return {
        width: getRandomInt(8, 12),
        height: getRandomInt(8, 12),
      };
    case "end":
      return {
        width: getRandomInt(5, 7),
        height: getRandomInt(5, 7),
      };
  }
}

function generateRoomPosition(
  node: Node<Room>,
  dimensions: Dimensions
): Vector2 {
  if (!dimensions) {
    throw new Error(
      `Cannot generate position without dimensions on node "${node.value.id}".`
    );
  }

  // If there is no parent we place the room at the center
  if (!node.parent) {
    return {
      x: 0 - Math.floor(dimensions.width / 2),
      y: 0 - Math.floor(dimensions.height / 2),
    };
  }

  // Pick a direction to place the room
  const direction = randomChoice<Direction>(["n", "s", "e", "w"]);
  const distance = getRandomInt(DISTANCE, DISTANCE);
  const parentBox = nodeRoomToAABB(node.parent);

  switch (direction) {
    case "n": {
      const minStartX = parentBox.startX - dimensions.width + CORRIDOR_WIDTH;
      const maxStartX = parentBox.endX - CORRIDOR_WIDTH;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.startY - distance - dimensions.height,
      };
    }
    case "w": {
      const minStartY = parentBox.startY - dimensions.height + CORRIDOR_WIDTH;
      const maxStartY = parentBox.endY - CORRIDOR_WIDTH;

      return {
        x: parentBox.startX - distance - dimensions.width,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
    case "s": {
      const minStartX = parentBox.startX - dimensions.width + CORRIDOR_WIDTH;
      const maxStartX = parentBox.endX - CORRIDOR_WIDTH;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.endY + distance,
      };
    }
    case "e": {
      const minStartY = parentBox.startY - dimensions.height + CORRIDOR_WIDTH;
      const maxStartY = parentBox.endY - CORRIDOR_WIDTH;

      return {
        x: parentBox.endX + distance,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
  }
}
