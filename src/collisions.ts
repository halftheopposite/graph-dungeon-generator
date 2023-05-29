import { PlacedRoom } from "./types";

export function areRoomsColliding(room: PlacedRoom, other: PlacedRoom) {
  if (
    room.position.x < other.position.x + other.dimensions.width &&
    room.position.x + room.dimensions.width > other.position.x &&
    room.position.y < other.position.y + other.dimensions.height &&
    room.position.y + room.dimensions.height > other.position.y
  ) {
    return true;
  }
}
