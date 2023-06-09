import { InputDungeon } from "../types";

export const MEDIUM: InputDungeon = {
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
    children: ["F", "end"],
  },
  E: {
    id: "E",
    type: "room",
    children: [],
  },
  F: {
    id: "F",
    type: "room",
    children: [],
  },
  end: {
    id: "end",
    type: "end",
    children: [],
  },
};
