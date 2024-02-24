import { Dimensions } from "../types";

/**
 * Initialize a canvas and a rendering context.
 */
export function initializeContext(): {
  context: CanvasRenderingContext2D;
  canvasDimensions: Dimensions;
} {
  //
  // Canvas
  //
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Could not find canvas element.`);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  //
  // Context
  //
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`Could not get context.`);
  }

  return {
    context,
    canvasDimensions: {
      width: canvas.width,
      height: canvas.height,
    },
  };
}
