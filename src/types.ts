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
// Graph
//
export type RoomId = string;
export type RoomType = "start" | "room" | "end";

export type Node = {
  id: RoomId;
  type: RoomType;
  children?: RoomId[];
};

export type NodesMap = {
  [roomId: RoomId]: Node;
};

//
// Placed
//
export type Room = {
  id: RoomId;
  type: RoomType;
  position: Vector2;
  dimensions: Dimensions;
  parent?: RoomId;
  children: RoomId[];
};

export type RoomsMap = {
  [roomId: RoomId]: Room;
};

//
// Tiles
//
export type Tile = number;
export type Tiles = number[][];
