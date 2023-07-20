import { Node, Room, Tiles, Vector2 } from "./types";

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

export function logStep<T>(name: string, fn: () => T) {
  const lastStepInMS = performance.now();

  const result = fn();
  console.log(`${name} (${performance.now() - lastStepInMS}ms)`);

  return result;
}

export function printTiles(tiles: Tiles) {
  let print = "";
  tiles.forEach((row) => {
    print = print.concat(row.join(""), "\n");
  });
  console.log(print);
}
