import { Point } from "../src/geometry/geometry";

describe("Point", () => {
  let point: Point;

  beforeEach(() => {
    point = new Point(10, 10, 10);
  });

  it("should rotate around Z axis correctly", () => {
    const center = new Point(0, 0, 0);
    point.rotateZ(Math.PI / 2, center);
    expect(point.x).toBeCloseTo(10);
    expect(point.y).toBeCloseTo(-10);
    expect(point.z).toBe(10);
  });

  it("should rotate around Z axis correctly for negative angles", () => {
    const center = new Point(0, 0, 0);
    point.rotateZ(-Math.PI / 2, center);
    expect(point.x).toBe(-10);
    expect(point.y).toBeCloseTo(10);
    expect(point.z).toBe(10);
  });

  it("should rotate around Z axis correctly in non-origin points", () => {
    const center = new Point(5, 5, 10);
    point.rotateZ(-Math.PI / 2, center);
    expect(point.x).toBeCloseTo(0);
    expect(point.y).toBeCloseTo(10);
    expect(point.z).toBe(10);
  });
});
