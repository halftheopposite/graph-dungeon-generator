import { areRoomsColliding } from "./collisions";
import {
  Dimensions,
  GraphDungeon,
  GraphRoom,
  Room,
  RoomId,
  RoomType,
} from "./types";
import { getRandomInt } from "./utils";

export function generateDungeon(dungeon: GraphDungeon): Room[] {
  const rooms = generateRooms(dungeon, [], "start");

  return rooms;
}

function generateRooms(
  dungeon: GraphDungeon,
  rooms: Room[],
  roomId: RoomId
): Room[] {
  console.log(`Generating room "${roomId}"...`);

  // Make a copy of the rooms
  const updatedRooms = [...rooms];

  // Get the graph room
  const graphRoom = dungeon.rooms[roomId];

  // Place the room
  const room = placeRoom(updatedRooms, graphRoom);
  if (!room) {
    throw new Error(`Could not place room "${roomId}"`);
  }

  updatedRooms.push(room);

  // Does it have connections?
  if (graphRoom.children.length === 0) {
    // If no => do nothing
    return updatedRooms;
  }

  for (let i = 0; i < graphRoom.children.length; i++) {
    const childGraphRoomId = graphRoom.children[i];
    const childRooms = generateRooms(dungeon, updatedRooms, childGraphRoomId);
    updatedRooms.push(...childRooms);
  }

  return updatedRooms;
}

function placeRoom(rooms: Room[], graphRoom: GraphRoom): Room | null {
  let room: Room | undefined = undefined;

  // Direction
  for (let i = 0; i < 10; i++) {
    const direction = generateDirection();

    // Dimensions
    for (let j = 0; j < 10; j++) {
      const dimensions = generateRoomDimensions(graphRoom.type);

      // Distance
      for (let k = 0; k < 10; k++) {
        const distance = generateDistance();

        // Position
        for (let l = 0; l < 10; l++) {}
      }
    }
  }

  return null;
}

function generateDirection(): { x: number; y: number } {
  return { x: 0, y: 1 };
}

function generateRoomDimensions(type: RoomType): Dimensions {
  switch (type) {
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

function generateDistance(): number {
  return 2;
}

function isRoomPlaceable(room: Room, rooms: Room[]): boolean {
  for (let i = 0; i < rooms.length; i++) {
    if (areRoomsColliding(room, rooms[i])) {
      return false;
    }
  }

  return true;
}
