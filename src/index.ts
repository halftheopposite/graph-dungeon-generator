function start() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Could not find canvas element.`);
  }

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`Could not get context.`);
  }

  context.fillStyle = "#FF0000";
  context.fillRect(0, 0, 150, 75);
}

start();
