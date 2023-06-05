import { AABBManager, AABB } from "./collisions";
import {
  Dimensions,
  Direction,
  InputDungeon,
  Node,
  Room,
  RoomId,
  Vector2,
} from "./types";
import { getRandomInt, randomChoice } from "./utils";

const MAX_ITERATIONS = 100;
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
    const currentNode = queue.shift() as Node<Room>;

    // Process the current node
    console.log(
      `→ Processing "${currentNode.value.id}" (parent: "${currentNode.parent?.value.id}")...`
    );
    placeRoom(aabbManager, currentNode);

    // Enqueue the children of the current node
    for (const child of currentNode.children) {
      queue.push(child);
    }
  }

  return rootNode;
}

function placeRoom(
  aabbManager: AABBManager,
  node: Node<Room>,
  iterations: number = 100
) {
  if (iterations === 0) {
    throw new Error(
      `Could not place node under "${MAX_ITERATIONS}" iterations.`
    );
  }

  // Generate dimensions and position
  node.value.dimensions = generateRoomDimensions(node);
  node.value.position = generateRoomPosition(node);

  // Create box to check for collisions
  const box = toAABB(node);

  // Check collisions
  if (aabbManager.collides(box)) {
    // If it collides, try again.
    console.log(`   ↳ Trying again (${iterations - 1} left)...`);
    return placeRoom(aabbManager, node, iterations - 1);
  }

  // Otherwise, we're good and we add the node to the AABB manager
  aabbManager.addBox(box);

  console.log(`   ↳ All good ✅\n`, JSON.stringify(box, null, 2));

  return;
}

function toAABB(node: Node<Room>): AABB {
  const box: AABB = {
    id: node.value.id,
    startX: node.value.position!.x,
    endX: node.value.position!.x + node.value.dimensions!.width,
    startY: node.value.position!.y,
    endY: node.value.position!.y + node.value.dimensions!.height,
  };

  return box;
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

function generateRoomPosition(node: Node<Room>): Vector2 {
  if (!node.value.dimensions) {
    throw new Error(
      `Cannot generate position without dimensions on node "${node.value.id}".`
    );
  }

  // If there is no parent we place the room at the center
  if (!node.parent) {
    return {
      x: 0 - Math.floor(node.value.dimensions?.width / 2),
      y: 0 - Math.floor(node.value.dimensions?.height / 2),
    };
  }

  // Pick a direction to place the room
  const direction = randomChoice<Direction>(["n", "s", "e", "w"]);

  console.log("Direction:", direction);
  const distance = getRandomInt(DISTANCE, DISTANCE);
  const parentBox = toAABB(node.parent);

  switch (direction) {
    case "n": {
      const minStartX =
        parentBox.startX - node.value.dimensions.width + CORRIDOR_WIDTH;
      const maxStartX = parentBox.endX - CORRIDOR_WIDTH;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.startY - distance - node.value.dimensions.height,
      };
    }
    case "w": {
      const minStartY =
        parentBox.startY - node.value.dimensions.height + CORRIDOR_WIDTH;
      const maxStartY = parentBox.endY - CORRIDOR_WIDTH;

      return {
        x: parentBox.startX - distance - node.value.dimensions.width,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
    case "s": {
      const minStartX =
        parentBox.startX - node.value.dimensions.width + CORRIDOR_WIDTH;
      const maxStartX = parentBox.endX - CORRIDOR_WIDTH;

      return {
        x: getRandomInt(minStartX, maxStartX),
        y: parentBox.endY + distance,
      };
    }
    case "e": {
      const minStartY =
        parentBox.startY - node.value.dimensions.height + CORRIDOR_WIDTH;
      const maxStartY = parentBox.endY - CORRIDOR_WIDTH;

      return {
        x: parentBox.endX + distance,
        y: getRandomInt(minStartY, maxStartY),
      };
    }
  }
}
