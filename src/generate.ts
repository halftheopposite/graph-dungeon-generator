import { InputDungeon, Node, Room, RoomId } from "./types";

export function generateDungeon(dungeon: InputDungeon) {
  const baseTree = createTree(dungeon);
  const filledTree = traverse(baseTree);
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
// Traverse
//
function traverse(rootNode: Node<Room>) {
  // Initialize the queue with the root node
  const queue: Node<Room>[] = [rootNode];

  while (queue.length > 0) {
    const currentNode = queue.shift() as Node<Room>;

    // Process the current node
    placeRoom(currentNode);

    // Enqueue the children of the current node
    for (const child of currentNode.children) {
      queue.push(child);
    }
  }
}

function placeRoom(node: Node<Room>) {
  console.log(`${node.value.id} (parent: ${node.parent?.value.id})`);
}
