(() => {
  // src/config.ts
  var TILE_SIZE = 16;
  var ROOM_BACKTRACK_ITERATIONS_MAX = 1e3;
  var ROOM_ITERATIONS_MAX = 20;
  var ROOM_DISTANCE_MIN = 3;
  var ROOM_DISTANCE_MAX = 6;
  var CORRIDOR_ITERATIONS_MAX = 20;
  var CORRIDOR_WIDTH = 4;

  // src/utils.ts
  function traverseTree(fn, node) {
    fn(node);
    node.children.forEach((item) => traverseTree(fn, item));
  }
  function getRoomCenter(node) {
    const centerX = node.value.position.x + Math.abs(node.value.dimensions.width / 2);
    const centerY = node.value.position.y + Math.abs(node.value.dimensions.height / 2);
    return {
      x: centerX,
      y: centerY
    };
  }
  function logStep(name, fn) {
    const lastStepInMS = performance.now();
    const result = fn();
    console.log(`${name} (${performance.now() - lastStepInMS}ms)`);
    return result;
  }

  // src/draw/canvas.ts
  function initializeContext() {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
      throw new Error(`Could not find canvas element.`);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error(`Could not get context.`);
    }
    return context;
  }

  // src/draw/utils.ts
  function initializeTilemap(width, height, fill) {
    const tiles = [];
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        tiles[y][x] = fill;
      }
    }
    return tiles;
  }
  function getDungeonDimensions(rootNode) {
    let dimensions = {
      width: 0,
      height: 0
    };
    traverseTree((node) => {
      if (!node.value.position || !node.value.dimensions) {
        return;
      }
      const maxX = node.value.position.x + node.value.dimensions.width;
      if (maxX > dimensions.width) {
        dimensions.width = maxX;
      }
      const maxY = node.value.position.y + node.value.dimensions.height;
      if (maxY > dimensions.height) {
        dimensions.height = maxY;
      }
    }, rootNode);
    return dimensions;
  }

  // src/draw/index.ts
  function draw(rootNode) {
    const context = initializeContext();
    const dimensions = getDungeonDimensions(rootNode);
    const tiles = initializeTilemap(
      dimensions.width,
      dimensions.height,
      6 /* WALL */
    );
    carveRooms(tiles, rootNode);
    carveCorridors(tiles, rootNode);
    drawTiles(context, tiles);
    drawGrid(context, dimensions);
    drawConnections(context, rootNode);
    drawRoomIds(context, rootNode);
  }
  function carveRooms(tiles, node) {
    traverseTree((node2) => {
      if (!node2.value.position || !node2.value.dimensions) {
        return;
      }
      for (let y = 0; y < node2.value.dimensions.height; y++) {
        for (let x = 0; x < node2.value.dimensions.width; x++) {
          const posY = node2.value.position.y + y;
          const posX = node2.value.position.x + x;
          switch (node2.value.type) {
            case "start":
              tiles[posY][posX] = 1 /* START */;
              break;
            case "room":
              tiles[posY][posX] = 2 /* ROOM */;
              break;
            case "boss":
              tiles[posY][posX] = 3 /* BOSS */;
              break;
            case "end":
              tiles[posY][posX] = 5 /* END */;
              break;
          }
        }
      }
    }, node);
  }
  function carveCorridors(tiles, node) {
    traverseTree((node2) => {
      if (!node2.value.corridor) {
        return;
      }
      for (let y = 0; y < node2.value.corridor.dimensions.height; y++) {
        for (let x = 0; x < node2.value.corridor.dimensions.width; x++) {
          const posY = node2.value.corridor.position.y + y;
          const posX = node2.value.corridor.position.x + x;
          tiles[posY][posX] = 4 /* CORRIDOR */;
        }
      }
    }, node);
  }
  function drawTiles(context, tiles) {
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        drawTile(context, x, y, tiles[y][x]);
      }
    }
  }
  function drawTile(context, x, y, tile) {
    switch (tile) {
      case 1 /* START */:
        context.fillStyle = "rgb(0,127,0)" /* START */;
        break;
      case 2 /* ROOM */:
        context.fillStyle = "rgb(0,0,127)" /* ROOM */;
        break;
      case 3 /* BOSS */:
        context.fillStyle = "rgb(127,0,127)" /* BOSS */;
        break;
      case 4 /* CORRIDOR */:
        context.fillStyle = "rgb(127,127,0)" /* CORRIDOR */;
        break;
      case 5 /* END */:
        context.fillStyle = "rgb(127,0,0)" /* END */;
        break;
      case 6 /* WALL */:
        context.fillStyle = "rgb(0,0,0)" /* WALL */;
        break;
    }
    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  function drawConnections(context, rootNode) {
    context.lineWidth = 1.5;
    context.strokeStyle = "white";
    traverseTree((node) => {
      const parentCenter = getRoomCenter(node);
      node.children.forEach((child) => {
        const childCenter = getRoomCenter(child);
        context.moveTo(parentCenter.x * TILE_SIZE, parentCenter.y * TILE_SIZE);
        context.lineTo(childCenter.x * TILE_SIZE, childCenter.y * TILE_SIZE);
      });
    }, rootNode);
    context.stroke();
  }
  function drawRoomIds(context, rootNode) {
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    traverseTree((node) => {
      const parentCenter = getRoomCenter(node);
      context.fillText(
        node.value.id,
        parentCenter.x * TILE_SIZE,
        parentCenter.y * TILE_SIZE
      );
    }, rootNode);
  }
  function drawGrid(context, dimensions) {
    context.lineWidth = 0.5;
    context.strokeStyle = "white";
    const dungeonWidthInPixel = dimensions.width * TILE_SIZE;
    const dungeonHeightInPixel = dimensions.height * TILE_SIZE;
    for (let x = 0; x <= dungeonWidthInPixel; x += TILE_SIZE) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, dungeonHeightInPixel);
      context.stroke();
    }
    for (let y = 0; y <= dungeonHeightInPixel; y += TILE_SIZE) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(dungeonWidthInPixel, y);
      context.stroke();
    }
  }

  // src/types.ts
  var Node = class {
    constructor(value, parent = null) {
      this.value = value;
      this.children = [];
      this.parent = parent;
    }
    addChild(node) {
      node.parent = this;
      this.children.push(node);
    }
    copyValue() {
      return {
        ...this.value
      };
    }
  };

  // src/generate/collisions.ts
  var AABBManager = class {
    constructor() {
      this.boxes = {};
    }
    addBox(box) {
      this.boxes[box.id] = {
        ...box
      };
    }
    removeBox(id) {
      delete this.boxes[id];
    }
    collides(box) {
      const ids = Object.keys(this.boxes);
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const currentBox = this.boxes[id];
        if (box.startX < currentBox.endX && box.endX > currentBox.startX && box.startY < currentBox.endY && box.endY > currentBox.startY) {
          return true;
        }
      }
      return false;
    }
  };

  // src/generate/utils.ts
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function randomChoice(values) {
    return values[Math.floor(Math.random() * values.length)];
  }
  function nodeRoomToAABB(node) {
    const box = {
      id: node.value.id,
      startX: node.value.position.x,
      endX: node.value.position.x + node.value.dimensions.width,
      startY: node.value.position.y,
      endY: node.value.position.y + node.value.dimensions.height
    };
    return box;
  }
  function normalizePositions(rootNode) {
    let lowestX = 0;
    let lowestY = 0;
    traverseTree((node) => {
      if (node.value.position.x < lowestX) {
        lowestX = node.value.position.x;
      }
      if (node.value.position.y < lowestY) {
        lowestY = node.value.position.y;
      }
    }, rootNode);
    traverseTree((node) => {
      node.value.position.x += Math.abs(lowestX);
      node.value.position.y += Math.abs(lowestY);
      if (node.value.corridor) {
        node.value.corridor.position.x += Math.abs(lowestX);
        node.value.corridor.position.y += Math.abs(lowestY);
      }
    }, rootNode);
  }
  function computeOverlapSegment(seg1Start, seg1End, seg2Start, seg2End) {
    const startOverlap = Math.max(seg1Start, seg2Start);
    const endOverlap = Math.min(seg1End, seg2End);
    if (startOverlap > endOverlap) {
      return null;
    } else {
      return [startOverlap, endOverlap];
    }
  }
  function getChildDirection(parentBox, childBox) {
    if (parentBox.startY >= childBox.endY) {
      return "n";
    } else if (parentBox.endY <= childBox.startY) {
      return "s";
    } else if (parentBox.startX >= childBox.endX) {
      return "w";
    } else if (parentBox.endX <= childBox.startX) {
      return "e";
    }
    throw new Error(
      `Could not determine child "${childBox.id}" direction against parent "${parentBox.id}".`
    );
  }

  // src/generate/index.ts
  function generate(dungeon) {
    const rootNode = parseInputDungeon(dungeon);
    placeRooms(rootNode);
    normalizePositions(rootNode);
    return rootNode;
  }
  function parseInputDungeon(dungeon) {
    return createRoomNode(dungeon, "start");
  }
  function createRoomNode(dungeon, roomId) {
    const room = dungeon[roomId];
    if (!room) {
      throw new Error(`Could not find "${roomId}" to generate tree.`);
    }
    const node = new Node({
      id: room.id,
      type: room.type
    });
    room.children.map((item) => {
      const childNode = createRoomNode(dungeon, item);
      node.addChild(childNode);
    });
    return node;
  }
  function placeRooms(rootNode) {
    const aabbManager = new AABBManager();
    const queue = [rootNode];
    let backTrackIterations = ROOM_BACKTRACK_ITERATIONS_MAX;
    while (queue.length > 0) {
      const node = queue.shift();
      try {
        placeRoom(aabbManager, node);
        placeCorridor(aabbManager, node);
      } catch (error) {
        if (backTrackIterations === 0) {
          throw new Error(`Could not backtrack room generation under `);
        }
        const parent = node.parent;
        queue.unshift(parent);
        aabbManager.removeBox(`room-${parent.value.id}`);
        aabbManager.removeBox(`corridor-${parent.value.id}`);
        for (const child of parent?.children) {
          aabbManager.removeBox(`room-${child.value.id}`);
          aabbManager.removeBox(`corridor-${child.value.id}`);
        }
        backTrackIterations -= 1;
      }
      for (const child of node.children) {
        queue.push(child);
      }
    }
    return rootNode;
  }
  function placeRoom(aabbManager, node, iterations = ROOM_ITERATIONS_MAX) {
    if (iterations === 0) {
      throw new Error(
        `Could not place room under "${ROOM_ITERATIONS_MAX}" iterations.`
      );
    }
    const dimensions = generateRoomDimensions(node);
    const position = generateRoomPosition(node, dimensions);
    const box = {
      id: `room-${node.value.id}`,
      startX: position.x,
      startY: position.y,
      endX: position.x + dimensions.width,
      endY: position.y + dimensions.height
    };
    if (aabbManager.collides(box)) {
      return placeRoom(aabbManager, node, iterations - 1);
    }
    node.value.dimensions = dimensions;
    node.value.position = position;
    aabbManager.addBox(box);
  }
  function placeCorridor(aabbManager, node, iterations = CORRIDOR_ITERATIONS_MAX) {
    if (!node.parent) {
      return;
    }
    if (iterations === 0) {
      throw new Error(
        `Could not place corridor under "${CORRIDOR_ITERATIONS_MAX}" iterations.`
      );
    }
    const corridor = generateCorridor(node.parent, node);
    const box = {
      id: `corridor-${node.value.id}`,
      startX: corridor.position.x,
      startY: corridor.position.y,
      endX: corridor.position.x + corridor.dimensions.width,
      endY: corridor.position.y + corridor.dimensions.height
    };
    if (aabbManager.collides(box)) {
      throw new Error(`Could not place corridor as it is colliding.`);
    }
    node.value.corridor = corridor;
    aabbManager.addBox(box);
  }
  function generateRoomDimensions(node) {
    switch (node.value.type) {
      case "start":
        return {
          width: getRandomInt(5, 6),
          height: getRandomInt(5, 6)
        };
      case "room":
        return {
          width: getRandomInt(8, 12),
          height: getRandomInt(8, 12)
        };
      case "boss":
        return {
          width: getRandomInt(12, 20),
          height: getRandomInt(12, 20)
        };
      case "end":
        return {
          width: getRandomInt(5, 7),
          height: getRandomInt(5, 7)
        };
    }
  }
  function generateRoomPosition(node, dimensions) {
    if (!dimensions) {
      throw new Error(
        `Cannot generate position without dimensions on node "${node.value.id}".`
      );
    }
    if (!node.parent) {
      return {
        x: 0 - Math.floor(dimensions.width / 2),
        y: 0 - Math.floor(dimensions.height / 2)
      };
    }
    const direction = randomChoice(["n", "s", "e", "w"]);
    const distance = getRandomInt(ROOM_DISTANCE_MIN, ROOM_DISTANCE_MAX);
    const corridorWidth = CORRIDOR_WIDTH;
    const parentBox = nodeRoomToAABB(node.parent);
    switch (direction) {
      case "n": {
        const minStartX = parentBox.startX - dimensions.width + corridorWidth;
        const maxStartX = parentBox.endX - corridorWidth;
        return {
          x: getRandomInt(minStartX, maxStartX),
          y: parentBox.startY - distance - dimensions.height
        };
      }
      case "w": {
        const minStartY = parentBox.startY - dimensions.height + corridorWidth;
        const maxStartY = parentBox.endY - corridorWidth;
        return {
          x: parentBox.startX - distance - dimensions.width,
          y: getRandomInt(minStartY, maxStartY)
        };
      }
      case "s": {
        const minStartX = parentBox.startX - dimensions.width + corridorWidth;
        const maxStartX = parentBox.endX - corridorWidth;
        return {
          x: getRandomInt(minStartX, maxStartX),
          y: parentBox.endY + distance
        };
      }
      case "e": {
        const minStartY = parentBox.startY - dimensions.height + corridorWidth;
        const maxStartY = parentBox.endY - corridorWidth;
        return {
          x: parentBox.endX + distance,
          y: getRandomInt(minStartY, maxStartY)
        };
      }
    }
  }
  function generateCorridor(parent, child) {
    const parentBox = nodeRoomToAABB(parent);
    const childBox = nodeRoomToAABB(child);
    let position = {
      x: 0,
      y: 0
    };
    let dimensions = {
      width: 0,
      height: 0
    };
    const direction = getChildDirection(parentBox, childBox);
    switch (direction) {
      case "n":
        {
          const corridorLength = Math.abs(parentBox.startY - childBox.endY);
          const horizontalSegment = getOverlappingSegment(
            parentBox,
            childBox,
            direction
          );
          const segmentWidth = Math.abs(
            horizontalSegment[0] - horizontalSegment[1]
          );
          const leftoverWidth = segmentWidth - CORRIDOR_WIDTH;
          const offset = Math.floor(leftoverWidth / 2);
          position.x = horizontalSegment[0] + offset;
          position.y = childBox.endY;
          dimensions.width = CORRIDOR_WIDTH;
          dimensions.height = corridorLength;
        }
        break;
      case "s":
        {
          const corridorLength = Math.abs(parentBox.endY - childBox.startY);
          const horizontalSegment = getOverlappingSegment(
            parentBox,
            childBox,
            direction
          );
          const segmentWidth = Math.abs(
            horizontalSegment[0] - horizontalSegment[1]
          );
          const leftoverWidth = segmentWidth - CORRIDOR_WIDTH;
          const offset = Math.floor(leftoverWidth / 2);
          position.x = horizontalSegment[0] + offset;
          position.y = parentBox.endY;
          dimensions.width = CORRIDOR_WIDTH;
          dimensions.height = corridorLength;
        }
        break;
      case "e":
        {
          const corridorLength = Math.abs(parentBox.endX - childBox.startX);
          const verticalSegment = getOverlappingSegment(
            parentBox,
            childBox,
            direction
          );
          const segmentHeight = Math.abs(verticalSegment[0] - verticalSegment[1]);
          const leftoverHeight = segmentHeight - CORRIDOR_WIDTH;
          const offset = Math.floor(leftoverHeight / 2);
          position.x = parentBox.endX;
          position.y = verticalSegment[0] + offset;
          dimensions.width = corridorLength;
          dimensions.height = CORRIDOR_WIDTH;
        }
        break;
      case "w":
        {
          const corridorLength = Math.abs(parentBox.startX - childBox.endX);
          const verticalSegment = getOverlappingSegment(
            parentBox,
            childBox,
            direction
          );
          const segmentHeight = Math.abs(verticalSegment[0] - verticalSegment[1]);
          const leftoverHeight = segmentHeight - CORRIDOR_WIDTH;
          const offset = Math.floor(leftoverHeight / 2);
          position.x = childBox.endX;
          position.y = verticalSegment[0] + offset;
          dimensions.width = corridorLength;
          dimensions.height = CORRIDOR_WIDTH;
        }
        break;
    }
    return {
      position,
      dimensions
    };
  }
  function getOverlappingSegment(parentBox, childBox, direction) {
    let segment;
    switch (direction) {
      case "n":
        {
          segment = computeOverlapSegment(
            parentBox.startX,
            parentBox.endX,
            childBox.startX,
            childBox.endX
          );
        }
        break;
      case "s":
        {
          segment = computeOverlapSegment(
            parentBox.startX,
            parentBox.endX,
            childBox.startX,
            childBox.endX
          );
        }
        break;
      case "e":
        {
          segment = computeOverlapSegment(
            parentBox.startY,
            parentBox.endY,
            childBox.startY,
            childBox.endY
          );
        }
        break;
      case "w":
        {
          segment = computeOverlapSegment(
            parentBox.startY,
            parentBox.endY,
            childBox.startY,
            childBox.endY
          );
        }
        break;
    }
    if (!segment) {
      throw new Error(`Could not find overlapping segment.`);
    }
    return segment;
  }

  // src/graphs/large.ts
  var LARGE = {
    start: {
      id: "start",
      type: "start",
      children: ["A", "G"]
    },
    A: {
      id: "A",
      type: "room",
      children: ["B", "C"]
    },
    G: {
      id: "G",
      type: "room",
      children: ["H", "I"]
    },
    H: {
      id: "H",
      type: "room",
      children: []
    },
    I: {
      id: "I",
      type: "room",
      children: []
    },
    B: {
      id: "B",
      type: "room",
      children: ["D", "E"]
    },
    C: {
      id: "C",
      type: "room",
      children: []
    },
    D: {
      id: "D",
      type: "room",
      children: ["F", "boss"]
    },
    E: {
      id: "E",
      type: "room",
      children: ["J", "K"]
    },
    J: {
      id: "J",
      type: "room",
      children: []
    },
    K: {
      id: "K",
      type: "room",
      children: []
    },
    F: {
      id: "F",
      type: "room",
      children: []
    },
    boss: {
      id: "boss",
      type: "boss",
      children: ["end"]
    },
    end: {
      id: "end",
      type: "end",
      children: []
    }
  };

  // src/index.ts
  function start() {
    const rootNode = logStep(`Generate \u2705`, () => generate(LARGE));
    logStep(`Draw \u2705`, () => draw(rootNode));
  }
  start();
})();
