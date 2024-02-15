import { InverseKinematicsCalculator } from "../src/geometry/inverse_kinematics";
import { RobotGeometry } from "../src/geometry/robot_geometry";
import { Point } from "../src/geometry/geometry";

describe("RobotGeometryCalculator", () => {
  let robotGeometry: RobotGeometry;
  let inverseKinematics: InverseKinematicsCalculator;

  beforeEach(() => {
    robotGeometry = new RobotGeometry(50, 50, 20, 10, 1500, 200);
    inverseKinematics = new InverseKinematicsCalculator(robotGeometry);
  });

  it("should compute the position correctlyn", () => {
    const position = inverseKinematics.getRobotPosition(
      new Point(0, 100, 180),
      new Point(0, 0, 0)
    );
    expect(position.swing).toBeCloseTo(Math.acos(40 / 50));
    expect(position.elbow).toBeCloseTo(-2 * Math.acos(40 / 50));
    expect(position.wrist).toBeCloseTo(Math.acos(40 / 50));
  });

  it("should compute the position correctly when desired x is negative", () => {
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
    // expect(position.wrist).toBeCloseTo(Math.acos(40 / 50));
  });
});
