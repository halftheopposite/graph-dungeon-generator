//
// Generic
//
export type Vector2 = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

//
// Tiles
//
export type Tile = number;
export type Tiles = number[][];

//
// Room
//
export type RoomId = string;
export type RoomType = "start" | "room" | "end";

export type Room = {
  id: RoomId;
  type: RoomType;
  position?: Vector2;
  dimensions?: Dimensions;
};

//
// Dungeon - Input value given to generate graph.
//
export type InputRoom = {
  id: RoomId;
  type: RoomType;
  children: RoomId[];
};

export type InputDungeon = {
  [roomId: RoomId]: InputRoom;
};

//
// Graph - Node data structure.
//
export class Node<T> {
  value: T;
  parent: Node<T> | null;
  children: Node<T>[];

  constructor(value: T, parent: Node<T> | null = null) {
    this.value = value;
    this.children = [];
    this.parent = parent;
  }

  public addChild(node: Node<T>) {
    node.parent = this;
    this.children.push(node);
  }
}
