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
export type RoomType = "start" | "end";

export type GraphRoom = {
  id: RoomId;
  type: RoomType;
  connexions: RoomId[];
};

export type GraphDungeon = {
  [roomId: RoomId]: GraphRoom;
};

//
// Placed
//
export type PlacedRoom = Omit<GraphRoom, "connexions"> & {
  position: Position;
  dimensions: Dimensions;
};

export type PlacedRooms = PlacedRoom[];

//
// Tiles
//
export type Tile = number;
export type Tiles = number[][];
