import { InverseKinematicsCalculator } from "../src/geometry/inverse_kinematics";
import { RobotGeometry } from "../src/geometry/robot_geometry";
import { Point } from "../src/geometry/geometry";

describe("RobotGeometryCalculator", () => {
  let robotGeometry: RobotGeometry;
  let inverseKinematics: InverseKinematicsCalculator;

  it("should compute the position correctly", () => {
    robotGeometry = new RobotGeometry(50, 50, 20, 10, 1500, 200);
    inverseKinematics = new InverseKinematicsCalculator(robotGeometry);
    const position = inverseKinematics.getRobotPosition(
      new Point(0, 100, 180),
      new Point(0, 0, 0)
    );
    expect(position.swing).toBeCloseTo(Math.acos(40 / 50));
    expect(position.elbow).toBeCloseTo(-2 * Math.acos(40 / 50));
    expect(position.wrist).toBeCloseTo(Math.acos(40 / 50));
  });

  it("should compute the position correctly when desired x is negative", () => {
    robotGeometry = new RobotGeometry(50, 50, 20, 10, 1500, 200);
    inverseKinematics = new InverseKinematicsCalculator(robotGeometry);
    const position = inverseKinematics.getRobotPosition(
      new Point(
        -80 * Math.cos(Math.PI / 4),
        20 + 80 * Math.sin(Math.PI / 4),
        180
      ),
      new Point(0, 0, 0)
    );
    expect(position.swing).toBeCloseTo(-Math.PI / 4 + Math.acos(40 / 50));
    expect(position.elbow).toBeCloseTo(-2 * Math.acos(40 / 50));
  });

  it("should compute the position correctly for different lengths", () => {
    const a = 100;
    robotGeometry = new RobotGeometry(
      2 * a,
      Math.sqrt(2) * a,
      20,
      10,
      1500,
      200
    );
    inverseKinematics = new InverseKinematicsCalculator(robotGeometry);
    const position = inverseKinematics.getRobotPosition(
      new Point(0, 20 + (1 + Math.sqrt(3)) * a, 180),
      new Point(0, 0, 0)
    );

    console.log([position.swing]);
    expect(position.swing).toBeCloseTo(Math.PI / 6);
    expect(position.elbow).toBeCloseTo(-Math.PI + (Math.PI / 4 + Math.PI / 3));
  });
});
