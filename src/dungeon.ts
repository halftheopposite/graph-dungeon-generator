import { GraphDungeon, PlacedRooms } from "./types";

export function generateDungeon(graph: GraphDungeon): PlacedRooms {
  const start = graph["start"];
  if (!start) {
    throw new Error(`Couldn't find "start" room.`);
  }

  let rooms: PlacedRooms = [];

  // TODO

  return rooms;
}
