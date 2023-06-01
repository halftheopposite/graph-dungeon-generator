//
// Generic
//
export type Position = {
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

export type GraphRoom = {
  id: RoomId;
  type: RoomType;
  parent: RoomId | undefined;
  children: RoomId[];
};

export type GraphDungeon = {
  width: number;
  height: number;
  rooms: {
    [roomId: RoomId]: GraphRoom;
  };
};

//
// Placed
//
export type Room = {
  id: RoomId;
  type: RoomType;
  position: Position;
  dimensions: Dimensions;
  parent?: RoomId;
  children: RoomId[];
};

//
// Tiles
//
export type Tile = number;
export type Tiles = number[][];
