export class Point {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  rotateZ(angle: number, center: Point): void {
    console.log(
      `Rotate ${(angle * 180) / Math.PI} degrees: ${[this.x, this.y, this.z]}`
    );

    const relativeX = this.x - center.x;
    const relativeY = this.y - center.y;

    const newRelativeX =
      relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
    const newRelativeY =
      relativeX * Math.sin(angle) + relativeY * Math.cos(angle);

    this.x = center.x + newRelativeX;
    this.y = center.y + newRelativeY;
  }

  move(movement: Vector) {
    this.x += movement.x;
    this.y += movement.y;
    this.z += movement.z;
  }

  static getVector(point1: Point, point2: Point): Vector {
    return new Vector(
      point2.x - point1.x,
      point2.y - point1.y,
      point2.z - point1.z
    );
  }

  getDistance(other: Point): number {
    return Math.sqrt(
      (this.x - other.x) ** 2 +
        (this.y - other.y) ** 2 +
        (this.z - other.z) ** 2
    );
  }
}
export class Vector extends Point {
  getMagnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  getPoint(): Point {
    return new Point(this.x, this.y, this.z);
  }

  numericalProduct(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  dotProduct(other: Vector): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  crossProduct(other: Vector): Vector {
    const resultX = this.y * other.z - this.z * other.y;
    const resultY = this.z * other.x - this.x * other.z;
    const resultZ = this.x * other.y - this.y * other.x;

    return new Vector(resultX, resultY, resultZ);
  }

  static angleBetween(vector1: Vector, vector2: Vector): number {
    const dotProduct = vector1.dotProduct(vector2);
    const magnitude1 = vector1.getMagnitude();
    const magnitude2 = vector2.getMagnitude();

    return Math.acos(dotProduct / (magnitude1 * magnitude2));
  }
}
