import { InputDungeon } from "../types";

export const LARGE: InputDungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A", "F"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["B"],
  },
  B: {
    id: "B",
    type: "room",
    children: ["C", "D"],
  },
  C: {
    id: "C",
    type: "room",
    children: [],
  },
  D: {
    id: "D",
    type: "room",
    children: ["E"],
  },
  E: {
    id: "E",
    type: "room",
    children: [],
  },
  F: {
    id: "F",
    type: "room",
    children: ["G", "H"],
  },
  G: {
    id: "G",
    type: "room",
    children: [],
  },
  H: {
    id: "H",
    type: "room",
    children: ["I"],
  },
  I: {
    id: "I",
    type: "room",
    children: ["J"],
  },
  J: {
    id: "J",
    type: "room",
    children: ["K", "L"],
  },
  K: {
    id: "K",
    type: "room",
    children: ["boss"],
  },
  L: {
    id: "L",
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
