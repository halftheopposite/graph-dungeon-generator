import { Dimensions, RoomType } from "./types";
import { getRandomInt } from "./utils";

export function generateRoomDimensions(type: RoomType): Dimensions {
  switch (type) {
    case "start":
      return {
        width: getRandomInt(3, 4),
        height: getRandomInt(3, 4),
      };
    case "end":
      return {
        width: getRandomInt(5, 7),
        height: getRandomInt(5, 7),
      };
  }
}
