import { Node, Room } from "./types";

export function traverseTree(fn: (node: Node<Room>) => void, node: Node<Room>) {
  fn(node);

  node.children.forEach((item) => traverseTree(fn, item));
}
