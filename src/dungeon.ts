import { areRoomsColliding } from "./collisions";
import { ROOM_PLACEMENT_ITERATIONS_MAX } from "./config";
import { generateRoomDimensions } from "./rooms";
import {
  GraphDungeon,
  GraphRoom,
  PlacedRoom,
  PlacedRooms,
  RoomId,
} from "./types";

export function generateDungeon(graphDungeon: GraphDungeon): PlacedRooms {
  const rooms = generateRooms(
    graphDungeon,
    Object.keys(graphDungeon),
    "start",
    []
  );

  return rooms;
}

function generateRooms(
  graphDungeon: GraphDungeon,
  remainingRoomIds: RoomId[],
  nextRoomId: RoomId,
  placedRooms: PlacedRooms
): PlacedRooms {
  console.log(`Generating room "${nextRoomId}"`);

  const updatedRooms = [...placedRooms];
  const updatedRemainingRoomIds = [...remainingRoomIds];

  // If there are no more rooms to treat we return the array
  if (remainingRoomIds.length === 0) {
    return updatedRooms;
  }

  // We check if the given room exists in the graph
  const graphRoom = graphDungeon[nextRoomId];
  if (!graphRoom) {
    throw new Error(`Couldn't find roomId "${nextRoomId}" in dungeon graph.`);
  }

  let placed = false;
  let iterations = 0;
  while (!placed) {
    // Exit if we weren't able to place the room after the maximum allowed iterations
    if (iterations === ROOM_PLACEMENT_ITERATIONS_MAX) {
      throw new Error(
        `Couldn't place room "${nextRoomId}" after ${ROOM_PLACEMENT_ITERATIONS_MAX} iterations.`
      );
    }

    const room = generateRoom(graphRoom);

    // Can place the room?
    if (isRoomPlaceable(room, placedRooms)) {
      // If we can we add it to the existing list of rooms and we exit
      updatedRooms.push(room);
      placed = true;
    } else {
      // If we can't we iterate once more
      iterations++;
    }
  }

  const index = remainingRoomIds.findIndex(
    (remainingRoomId) => remainingRoomId === nextRoomId
  );
  updatedRemainingRoomIds.splice(index, 1);

  return generateRooms(
    graphDungeon,
    updatedRemainingRoomIds,
    graphRoom.connexions[0],
    updatedRooms
  );
}

function generateRoom(graphRoom: GraphRoom): PlacedRoom {
  const dimensions = generateRoomDimensions(graphRoom.type);

  return {
    id: graphRoom.id,
    type: graphRoom.type,
    position: {
      x: 0,
      y: 0,
    },
    dimensions,
  };
}

function isRoomPlaceable(room: PlacedRoom, placedRooms: PlacedRooms): boolean {
  for (let i = 0; i < placedRooms.length; i++) {
    if (areRoomsColliding(room, placedRooms[i])) {
      return false;
    }
  }

  return true;
}
