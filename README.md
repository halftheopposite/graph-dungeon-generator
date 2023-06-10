# Graph Dungeon Generator

A simple graph-based procedural dungeon generator.

Want to try the generator? Click [here](https://halftheopposite.github.io/graph-dungeon-generator/) and have some fun.

## Architecture

The project is split into 3 distinct modules (aka folders) in an effort to make it simpler to decouple responsabilities:

- `/draw`
- `/generate`
- `/graphs`

## What can it do?

It takes a input graph which determine in which order should the rooms of the dungeon be drawn, and outputs

## What can't it do?

This generator does not handle overly complex situations such as:

- Nodes with too many children
- L-shaped corridors
- Circular nodes (ex: A → B → C → A)
