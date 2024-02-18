import {
  RobotPositionCalculator,
  RobotGeometry,
} from "../src/geometry/robot_geometry";

describe("RobotGeometryCalculator", () => {
  let robotPositionCalculator: RobotPositionCalculator;

  beforeEach(() => {
    robotPositionCalculator = RobotPositionCalculator.loadFromGeometry(
      new RobotGeometry(100, 100, 20, 10, 1500, 200)
    );
  });

  it("should rotate swing correctly", () => {
    robotPositionCalculator.rotateSwing(Math.PI / 2);
    expect(robotPositionCalculator.getGripperCoordinates()).toEqual([
      220, 0, 180,
    ]);
    robotPositionCalculator.rotateSwing(-Math.PI);
    expect(robotPositionCalculator.getGripperCoordinates()).toEqual([
      -220, 0, 180,
    ]);
  });

  it("should rotate elbow correctly", () => {
    robotPositionCalculator.rotateElbow(Math.PI / 2);
    expect(robotPositionCalculator.getGripperCoordinates()).toStrictEqual([
      120, 100, 180,
    ]);
    robotPositionCalculator.rotateElbow(-Math.PI);
    expect(robotPositionCalculator.getGripperCoordinates()).toStrictEqual([
      -120, 100, 180,
    ]);
  });

  it("should rotate wrist correctly", () => {
    robotPositionCalculator.rotateWrist(Math.PI / 2);
    expect(robotPositionCalculator.getGripperCoordinates()).toStrictEqual([
      20, 200, 180,
    ]);
    robotPositionCalculator.rotateWrist(-Math.PI);
    expect(robotPositionCalculator.getGripperCoordinates()).toStrictEqual([
      -20, 200, 180,
    ]);
  });

  it("should rotate all components correctly", () => {
    robotPositionCalculator.rotateSwing(Math.PI / 4);
    robotPositionCalculator.rotateElbow(-Math.PI / 2);
    robotPositionCalculator.rotateWrist(Math.PI / 4);
    expect(robotPositionCalculator.getGripperCoordinates()[0]).toBeCloseTo(0);
    expect(robotPositionCalculator.getGripperCoordinates()[1]).toBeCloseTo(161);
    expect(robotPositionCalculator.getGripperCoordinates()[2]).toBeCloseTo(180);
  });
});
