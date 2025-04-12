import { InputDungeon } from "../types";

export const MEDIUM_CIRCULAR: InputDungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["B1", "B2"],
  },
  B1: {
    id: "B1",
    type: "room",
    children: ["C"],
  },
  B2: {
    id: "B2",
    type: "room",
    children: ["C"],
  },
  C: {
    id: "C",
    type: "room",
    children: ["D"],
  },
  D: {
    id: "D",
    type: "room",
    children: [],
  },
  E: {
    id: "E",
    type: "room",
    children: ["boss", "F"],
  },
  F: {
    id: "F",
    type: "room",
    children: [],
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
