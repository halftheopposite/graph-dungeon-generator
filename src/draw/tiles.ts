function getImage(path: string) {
  const image = new Image();
  image.src = path;

  return image;
}

const tilesImages = {
  ground: getImage("assets/tiles/ground.png"),
  n: getImage("assets/tiles/n.png"),
  s: getImage("assets/tiles/s.png"),
  e: getImage("assets/tiles/e.png"),
  w: getImage("assets/tiles/w.png"),
  ne: getImage("assets/tiles/ne.png"),
  nw: getImage("assets/tiles/nw.png"),
  "w-e": getImage("assets/tiles/w-e.png"),
  "n-nw-w": getImage("assets/tiles/n-nw-w.png"),
  "n-ne-e": getImage("assets/tiles/n-ne-e.png"),
  all: getImage("assets/tiles/all.png"),
};

export const tilesTextures = {
  0: tilesImages["ground"],
  1: tilesImages["s"],
  2: tilesImages["s"],
  3: tilesImages["s"],
  4: tilesImages["s"],
  5: tilesImages["s"],
  7: tilesImages["s"],
  6: tilesImages["s"],
  8: tilesImages["s"],
  9: tilesImages["s"],
  10: tilesImages["s"],
  11: tilesImages["s"],
  12: tilesImages["s"],
  13: tilesImages["w-e"],
  14: tilesImages["w-e"],
  15: tilesImages["w-e"],
  16: tilesImages["w-e"],
  17: tilesImages["w-e"],
  18: tilesImages["w-e"],
  19: tilesImages["w-e"],
  20: tilesImages["w-e"],
  21: tilesImages["w-e"],
  22: tilesImages["w-e"],
  23: tilesImages["w-e"],
  24: tilesImages["w-e"],
  25: tilesImages["w-e"],
  26: tilesImages["n-ne-e"],
  27: tilesImages["n-ne-e"],
  28: tilesImages["e"],
  29: tilesImages["n-ne-e"],
  30: tilesImages["n-ne-e"],
  31: tilesImages["e"],
  32: tilesImages["n-ne-e"],
  33: tilesImages["e"],
  34: tilesImages["n-nw-w"],
  35: tilesImages["n-nw-w"],
  36: tilesImages["w"],
  37: tilesImages["n-nw-w"],
  38: tilesImages["n-nw-w"],
  39: tilesImages["n-nw-w"],
  40: tilesImages["w"],
  41: tilesImages["w"],
  42: tilesImages["n"],
  43: tilesImages["n"],
  44: tilesImages["ne"],
  45: tilesImages["nw"],
  46: tilesImages["all"],
  47: tilesImages["s"],
};
