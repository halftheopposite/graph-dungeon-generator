export type AABB = {
  id: string;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
};

export class AABBManager {
  private boxes: {
    [id: string]: AABB;
  };

  constructor() {
    this.boxes = {};
  }

  public addBox(box: AABB) {
    this.boxes[box.id] = {
      ...box,
    };
  }

  public removeBox(id: string) {
    delete this.boxes[id];
  }

  public collides(box: AABB): boolean {
    const ids = Object.keys(this.boxes);

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const currentBox = this.boxes[id];

      if (
        box.startX < currentBox.endX &&
        box.endX > currentBox.startX &&
        box.startY < currentBox.endY &&
        box.endY > currentBox.startY
      ) {
        return true;
      }
    }

    return false;
  }
}