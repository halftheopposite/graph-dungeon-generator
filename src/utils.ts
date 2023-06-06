import { Node, Room, Vector2 } from "./types";

export function traverseTree(fn: (node: Node<Room>) => void, node: Node<Room>) {
  fn(node);

  node.children.forEach((item) => traverseTree(fn, item));
}

export function getRoomCenter(node: Node<Room>): Vector2 {
  const centerX =
    node.value.position!.x + Math.abs(node.value.dimensions!.width / 2);
  const centerY =
    node.value.position!.y + Math.abs(node.value.dimensions!.height / 2);

  return {
    x: centerX,
    y: centerY,
  };
}
