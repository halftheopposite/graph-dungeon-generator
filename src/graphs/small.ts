import { InputDungeon } from "../types";

export const SMALL: InputDungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["B", "C"],
  },
  B: {
    id: "B",
    type: "room",
    children: [],
  },
  C: {
    id: "C",
    type: "room",
    children: ["boss"],
  },
  boss: {
    id: "boss",
    type: "boss",
    children: ["end"],
  },
  end: {
    id: "end",
    type: "end",
    children: [],
  },
};
