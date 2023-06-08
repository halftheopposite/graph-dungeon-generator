import {
  CORRIDOR_ITERATIONS_MAX,
  CORRIDOR_WIDTH_MIN,
  ROOM_DISTANCE_MAX,
  ROOM_DISTANCE_MIN,
  ROOM_ITERATIONS_MAX,
} from "../config";
import {
  Corridor,
  Dimensions,
  Direction,
  InputDungeon,
  Node,
  Room,
  RoomId,
  Vector2,
} from "../types";
import { AABB, AABBManager } from "./collisions";
import {
  computeOverlapSegment,
  getRandomInt,
  nodeRoomToAABB,
  normalizePositions,
  randomChoice,
} from "./utils";

/**
 * Entrypoint method to generate the rooms and corridors
 * based on a provided graph file.
 */
export function generate(dungeon: InputDungeon): Node<Room> {
  const rootNode = parseInputDungeon(dungeon);

  placeRooms(rootNode);
  normalizePositions(rootNode);

  return rootNode;
}

//
// Parse
//
function parseInputDungeon(dungeon: InputDungeon): Node<Room> {
  return createRoomNode(dungeon, "start");
}

function createRoomNode(dungeon: InputDungeon, roomId: RoomId): Node<Room> {
  const room = dungeon[roomId];
  if (!room) {
    throw new Error(`Could not find "${roomId}" to generate tree.`);
  }

  const node = new Node<Room>({
    id: room.id,
    type: room.type,
  });

  room.children.map((item) => {
    const childNode = createRoomNode(dungeon, item);
    node.addChild(childNode);
  });

  return node;
}

//
// Generate
//
function placeRooms(rootNode: Node<Room>) {
  // Create collisions manager
  const aabbManager = new AABBManager();

  // Initialize the queue with the root node
  const queue: Node<Room>[] = [rootNode];

  // Treat all the nodes we add to the queue (Breadth-First Search)
  while (queue.length > 0) {
    const node = queue.shift() as Node<Room>;

    // Attempt to place room and corridor
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
  iterations: number = ROOM_ITERATIONS_MAX
) {
  if (iterations === 0) {
    throw new Error(
      `Could not place room under "${ROOM_ITERATIONS_MAX}" iterations.`
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
    return placeRoom(aabbManager, node, iterations - 1);
  }

  node.value.dimensions = dimensions;
  node.value.position = position;
  aabbManager.addBox(box);
}

function placeCorridor(
  aabbManager: AABBManager,
  node: Node<Room>,
  iterations: number = CORRIDOR_ITERATIONS_MAX
) {
  if (!node.parent) {
    return;
  }

  if (iterations === 0) {
    throw new Error(
      `Could not place corridor under "${CORRIDOR_ITERATIONS_MAX}" iterations.`
    );
  }

  // Compute corridor position
  const corridor = generateCorridor(node.parent, node);

  // Create box to check for collisions
  const box: AABB = {
    id: node.value.id,
    startX: corridor.position.x,
    startY: corridor.position.y,
    endX: corridor.position.x + corridor.dimensions.width,
    endY: corridor.position.y + corridor.dimensions.height,
  };

  // Check collisions
  if (aabbManager.collides(box)) {
    throw new Error(`Could not place corridor as it is colliding.`);
  }

  node.value.corridor = corridor;
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
  const distance = getRandomInt(ROOM_DISTANCE_MIN, ROOM_DISTANCE_MAX);
  const parentBox = nodeRoomToAABB(node.parent);

  switch (direction) {
    case "n": {
      const minStartX =
        parentBox.startX - dimensions.width + CORRIDOR_WIDTH_MIN;
      const maxStartX = parentBox.endX - CORRIDOR_WIDTH_MIN;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.startY - distance - dimensions.height,
      };
    }
    case "w": {
      const minStartY =
        parentBox.startY - dimensions.height + CORRIDOR_WIDTH_MIN;
      const maxStartY = parentBox.endY - CORRIDOR_WIDTH_MIN;

      return {
        x: parentBox.startX - distance - dimensions.width,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
    case "s": {
      const minStartX =
        parentBox.startX - dimensions.width + CORRIDOR_WIDTH_MIN;
      const maxStartX = parentBox.endX - CORRIDOR_WIDTH_MIN;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.endY + distance,
      };
    }
    case "e": {
      const minStartY =
        parentBox.startY - dimensions.height + CORRIDOR_WIDTH_MIN;
      const maxStartY = parentBox.endY - CORRIDOR_WIDTH_MIN;

      return {
        x: parentBox.endX + distance,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
  }
}

function generateCorridor(parent: Node<Room>, child: Node<Room>): Corridor {
  const parentBox = nodeRoomToAABB(parent);
  const childBox = nodeRoomToAABB(child);

  // North
  if (parentBox.startY >= childBox.endY) {
    const height = Math.abs(parentBox.startY - childBox.endY);
    const segment = computeOverlapSegment(
      parentBox.startX,
      parentBox.endX,
      childBox.startX,
      childBox.endX
    );

    if (!segment) {
      throw new Error(`Could not find overlapping segment.`);
    }

    return {
      position: {
        x: segment[0],
        y: childBox.endY,
      },
      dimensions: {
        width: Math.abs(segment[0] - segment[1]),
        height,
      },
    };
  }
  // South
  else if (parentBox.endY <= childBox.startY) {
    const height = Math.abs(parentBox.endY - childBox.startY);
    const segment = computeOverlapSegment(
      parentBox.startX,
      parentBox.endX,
      childBox.startX,
      childBox.endX
    );

    if (!segment) {
      throw new Error(`Could not find overlapping segment.`);
    }

    return {
      position: {
        x: segment[0],
        y: parentBox.endY,
      },
      dimensions: {
        width: Math.abs(segment[0] - segment[1]),
        height,
      },
    };
  }
  // West
  else if (parentBox.startX >= childBox.endX) {
    const width = Math.abs(parentBox.startX - childBox.endX);
    const segment = computeOverlapSegment(
      parentBox.startY,
      parentBox.endY,
      childBox.startY,
      childBox.endY
    );

    if (!segment) {
      throw new Error(`Could not find overlapping segment.`);
    }

    return {
      position: {
        x: childBox.endX,
        y: segment[0],
      },
      dimensions: {
        width,
        height: Math.abs(segment[0] - segment[1]),
      },
    };
  }
  // East
  else if (parentBox.endX <= childBox.startX) {
    const width = Math.abs(parentBox.endX - childBox.startX);
    const segment = computeOverlapSegment(
      parentBox.startY,
      parentBox.endY,
      childBox.startY,
      childBox.endY
    );

    if (!segment) {
      throw new Error(`Could not find overlapping segment.`);
    }

    return {
      position: {
        x: parentBox.endX,
        y: segment[0],
      },
      dimensions: {
        width,
        height: Math.abs(segment[0] - segment[1]),
      },
    };
  }

  throw new Error(
    `Could not generate corridor between "${child.value.id}" and "${parent.value.id}".`
  );
}
