import { InputDungeon } from "../types";

export const MEDIUM: InputDungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A", "B"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["C"],
  },
  B: {
    id: "B",
    type: "room",
    children: ["D"],
  },
  C: {
    id: "C",
    type: "room",
    children: ["E", "F"],
  },
  D: {
    id: "D",
    type: "room",
    children: [],
  },
  E: {
    id: "E",
    type: "room",
    children: ["boss"],
  },
  F: {
    id: "F",
    type: "room",
    children: [],
  },
  boss: {
    id: "boss",
    type: "boss",
    children: ["G", "end"],
  },
  G: {
    id: "G",
    type: "room",
    children: [],
  },
  end: {
    id: "end",
    type: "end",
    children: [],
  },
};
