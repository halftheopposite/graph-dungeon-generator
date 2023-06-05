/**
 * Get a random integer between min and max.
 * @param {number} min - min number
 * @param {number} max - max number
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Randomly pick a value in an array.
 */
export function randomChoice<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}
