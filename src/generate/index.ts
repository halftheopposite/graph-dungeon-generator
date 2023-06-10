import {
  CORRIDOR_ITERATIONS_MAX,
  CORRIDOR_WIDTH,
  ROOM_BACKTRACK_ITERATIONS_MAX,
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
  getChildDirection,
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
  let backTrackIterations = ROOM_BACKTRACK_ITERATIONS_MAX;

  // Treat all the nodes we add to the queue (Breadth-First Search)
  while (queue.length > 0) {
    const node = queue.shift() as Node<Room>;

    // Attempt to place room and corridor
    try {
      placeRoom(aabbManager, node);
      placeCorridor(aabbManager, node);
    } catch (error) {
      // If we can't place a room or a corridor we will go back to
      // its parent node and delete all existing children. We will
      // then attempt to generate the parent again.

      if (backTrackIterations === 0) {
        throw new Error(`Could not backtrack room generation under `);
      }

      const parent = node.parent!;

      // Unshift parent node of current node back in front of the queue
      queue.unshift(parent);

      // Delete parent AABB
      aabbManager.removeBox(`room-${parent.value.id}`);
      aabbManager.removeBox(`corridor-${parent.value.id}`);

      // Delete children AABBs
      for (const child of parent?.children) {
        aabbManager.removeBox(`room-${child.value.id}`);
        aabbManager.removeBox(`corridor-${child.value.id}`);
      }

      backTrackIterations -= 1;
    }

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
    id: `room-${node.value.id}`,
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
    id: `corridor-${node.value.id}`,
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
  aabbManager.addBox(box);
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
    case "boss":
      return {
        width: getRandomInt(12, 20),
        height: getRandomInt(12, 20),
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
  const corridorWidth = CORRIDOR_WIDTH;
  const parentBox = nodeRoomToAABB(node.parent);

  switch (direction) {
    case "n": {
      const minStartX = parentBox.startX - dimensions.width + corridorWidth;
      const maxStartX = parentBox.endX - corridorWidth;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.startY - distance - dimensions.height,
      };
    }
    case "w": {
      const minStartY = parentBox.startY - dimensions.height + corridorWidth;
      const maxStartY = parentBox.endY - corridorWidth;

      return {
        x: parentBox.startX - distance - dimensions.width,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
    case "s": {
      const minStartX = parentBox.startX - dimensions.width + corridorWidth;
      const maxStartX = parentBox.endX - corridorWidth;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.endY + distance,
      };
    }
    case "e": {
      const minStartY = parentBox.startY - dimensions.height + corridorWidth;
      const maxStartY = parentBox.endY - corridorWidth;

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

  let position: Vector2 = {
    x: 0,
    y: 0,
  };
  let dimensions: Dimensions = {
    width: 0,
    height: 0,
  };

  const direction = getChildDirection(parentBox, childBox);

  switch (direction) {
    case "n":
      {
        // Compute vertical distance between two rooms
        const corridorLength = Math.abs(parentBox.startY - childBox.endY);

        // Compute horizontal overlap between the two rooms
        const horizontalSegment = getOverlappingSegment(
          parentBox,
          childBox,
          direction
        );

        // Compute offset to center the corridor if applicable
        const segmentWidth = Math.abs(
          horizontalSegment[0] - horizontalSegment[1]
        );
        const leftoverWidth = segmentWidth - CORRIDOR_WIDTH;
        const offset = Math.floor(leftoverWidth / 2);

        // Set position and dimensions
        position.x = horizontalSegment[0] + offset;
        position.y = childBox.endY;
        dimensions.width = CORRIDOR_WIDTH;
        dimensions.height = corridorLength;
      }
      break;
    case "s":
      {
        // Compute vertical distance between two rooms
        const corridorLength = Math.abs(parentBox.endY - childBox.startY);

        // Compute horizontal overlap between the two rooms
        const horizontalSegment = getOverlappingSegment(
          parentBox,
          childBox,
          direction
        );

        // Compute offset to center the corridor if applicable
        const segmentWidth = Math.abs(
          horizontalSegment[0] - horizontalSegment[1]
        );
        const leftoverWidth = segmentWidth - CORRIDOR_WIDTH;
        const offset = Math.floor(leftoverWidth / 2);

        // Set position and dimensions
        position.x = horizontalSegment[0] + offset;
        position.y = parentBox.endY;
        dimensions.width = CORRIDOR_WIDTH;
        dimensions.height = corridorLength;
      }
      break;
    case "e":
      {
        // Compute horizontal distance between two rooms
        const corridorLength = Math.abs(parentBox.endX - childBox.startX);

        // Compute vertical overlap between the two rooms
        const verticalSegment = getOverlappingSegment(
          parentBox,
          childBox,
          direction
        );

        // Compute offset to center the corridor if applicable
        const segmentHeight = Math.abs(verticalSegment[0] - verticalSegment[1]);
        const leftoverHeight = segmentHeight - CORRIDOR_WIDTH;
        const offset = Math.floor(leftoverHeight / 2);

        // Set position and dimensions
        position.x = parentBox.endX;
        position.y = verticalSegment[0] + offset;
        dimensions.width = corridorLength;
        dimensions.height = CORRIDOR_WIDTH;
      }
      break;
    case "w":
      {
        // Compute horizontal distance between two rooms
        const corridorLength = Math.abs(parentBox.startX - childBox.endX);

        // Compute vertical overlap between the two rooms
        const verticalSegment = getOverlappingSegment(
          parentBox,
          childBox,
          direction
        );

        // Compute offset to center the corridor if applicable
        const segmentHeight = Math.abs(verticalSegment[0] - verticalSegment[1]);
        const leftoverHeight = segmentHeight - CORRIDOR_WIDTH;
        const offset = Math.floor(leftoverHeight / 2);

        // Set position and dimensions
        position.x = childBox.endX;
        position.y = verticalSegment[0] + offset;
        dimensions.width = corridorLength;
        dimensions.height = CORRIDOR_WIDTH;
      }
      break;
  }

  return {
    position,
    dimensions,
  };
}

function getOverlappingSegment(
  parentBox: AABB,
  childBox: AABB,
  direction: Direction
): number[] {
  let segment: number[] | null;

  switch (direction) {
    case "n":
      {
        segment = computeOverlapSegment(
          parentBox.startX,
          parentBox.endX,
          childBox.startX,
          childBox.endX
        );
      }
      break;
    case "s":
      {
        segment = computeOverlapSegment(
          parentBox.startX,
          parentBox.endX,
          childBox.startX,
          childBox.endX
        );
      }
      break;
    case "e":
      {
        segment = computeOverlapSegment(
          parentBox.startY,
          parentBox.endY,
          childBox.startY,
          childBox.endY
        );
      }
      break;
    case "w":
      {
        segment = computeOverlapSegment(
          parentBox.startY,
          parentBox.endY,
          childBox.startY,
          childBox.endY
        );
      }
      break;
  }

  if (!segment) {
    throw new Error(`Could not find overlapping segment.`);
  }

  return segment;
}
