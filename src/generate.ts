import { AABBManager, AABB } from "./collisions";
import {
  Dimensions,
  InputDungeon,
  Node,
  Room,
  RoomId,
  RoomType,
  Vector2,
} from "./types";
import { getRandomInt } from "./utils";

export function generateDungeon(dungeon: InputDungeon) {
  const baseTree = createTree(dungeon);
  const filledTree = generate(baseTree);
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
}

const MAX_ITERATIONS = 100;

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
  const box: AABB = {
    id: node.value.id,
    startX: node.value.position.x,
    endX: node.value.position.x + node.value.dimensions.width,
    startY: node.value.position.y,
    endY: node.value.position.y + node.value.dimensions.height,
  };

  // Check collisions
  if (aabbManager.collides(box)) {
    // If it collides, try again.
    console.log(`   ↳ Trying again (${iterations - 1} left)...`);
    return placeRoom(aabbManager, node, iterations - 1);
  }

  // Otherwise add
  console.log(`   ↳ All good ✅\n`, JSON.stringify(box, null, 2));
  aabbManager.addBox(box);

  return;
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

const DISTANCE = 3;

function generateRoomPosition(node: Node<Room>): Vector2 {
  if (!node.value.dimensions) {
    throw new Error(
      `Cannot generate position without dimensions on node "${node.value.id}".`
    );
  }

  if (!node.parent) {
    return {
      x: 0 - Math.floor(node.value.dimensions?.width / 2),
      y: 0 - Math.floor(node.value.dimensions?.height / 2),
    };
  }

  return {
    x: 0 - Math.floor(node.value.dimensions.width / 2),
    // Dimensions can't be null on parent
    y:
      node.parent.value.position!.y +
      node.parent.value.dimensions!.height +
      DISTANCE,
  };
}
