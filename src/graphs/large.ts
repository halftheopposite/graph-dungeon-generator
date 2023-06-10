import { InputDungeon } from "../types";

export const LARGE: InputDungeon = {
  start: {
    id: "start",
    type: "start",
    children: ["A", "G"],
  },
  A: {
    id: "A",
    type: "room",
    children: ["B", "C"],
  },
  G: {
    id: "G",
    type: "room",
    children: ["H", "I"],
  },
  H: {
    id: "H",
    type: "room",
    children: [],
  },
  I: {
    id: "I",
    type: "room",
    children: [],
  },
  B: {
    id: "B",
    type: "room",
    children: ["D", "E"],
  },
  C: {
    id: "C",
    type: "room",
    children: [],
  },
  D: {
    id: "D",
    type: "room",
    children: ["F", "boss"],
  },
  E: {
    id: "E",
    type: "room",
    children: ["J", "K"],
  },
  J: {
    id: "J",
    type: "room",
    children: [],
  },
  K: {
    id: "K",
    type: "room",
    children: [],
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
