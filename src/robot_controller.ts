import { RobotGeometry, RobotGeometryCalculator } from "./robot_geometry";
import { RobotRender } from "./robot_renderer";
import { loadGeometryCalculatorfromRobotGeometry } from "./robot_geometry";
import { InverseKinematicsCalculator } from "./robot_inverse_kinematics";
import { Point } from "./geometry";

export interface RobotControl {
  moveLift(distance: number): void;

  rotateSwing(angle: number): void;

  rotateElbow(angle: number): void;

  rotateWrist(angle: number): void;
}

export class RobotPosition {
  lift: number;
  swing: number;
  elbow: number;
  wrist: number;

  constructor(
    lift: number = 0,
    swing: number = 0,
    elbow: number = 0,
    wrist: number = 0
  ) {
    this.lift = lift;
    this.swing = swing;
    this.elbow = elbow;
    this.wrist = wrist;
  }

  static subtract(first: RobotPosition, second: RobotPosition) {
    return new RobotPosition(
      first.lift - second.lift,
      first.swing - second.swing,
      first.elbow - second.elbow,
      first.wrist - second.wrist
    );
  }
}

interface RobotForwardInstructions {
  setPosition(positiom: RobotPosition): void;
}

interface RobotReverseInstructions {
  reach(gripperPosition: Point, gripperAlignmentAngle: number): void;
}

export class RobotController
  implements RobotForwardInstructions, RobotReverseInstructions
{
  currentPosition: RobotPosition;
  geometryCalculator: RobotGeometryCalculator;
  inverseKinematicsCalculator: InverseKinematicsCalculator;
  render: RobotRender;

  constructor(geometry: RobotGeometry) {
    this.currentPosition = new RobotPosition();
    this.geometryCalculator = loadGeometryCalculatorfromRobotGeometry(geometry);
    this.inverseKinematicsCalculator = new InverseKinematicsCalculator(
      geometry
    );
    this.render = new RobotRender(geometry);
  }

  setPosition(position: RobotPosition): void {
    const deltaPosition = RobotPosition.subtract(
      position,
      this.currentPosition
    );

    this.moveLift(deltaPosition.lift);
    this.rotateSwing(deltaPosition.swing);
    this.rotateElbow(deltaPosition.elbow);
    this.rotateWrist(deltaPosition.wrist);
    this.currentPosition = position;
  }

  reach(gripperPosition: Point, gripperAlignmentAngle: number): void {
    const desiredPosition = this.inverseKinematicsCalculator.getRobotPosition(
      gripperPosition,
      new Point(0, 0, 0),
      gripperAlignmentAngle
    );
    this.setPosition(desiredPosition);
  }

  moveLift(distance: number): void {
    this.geometryCalculator.moveLift(distance);
    this.render.moveLift(distance);
  }

  rotateSwing(angle: number): void {
    this.geometryCalculator.rotateSwing(angle);
    this.render.rotateSwing(angle);
  }

  rotateElbow(angle: number): void {
    this.geometryCalculator.rotateElbow(angle);
    this.render.rotateElbow(angle);
  }

  rotateWrist(angle: number): void {
    this.geometryCalculator.rotateWrist(angle);
    this.render.rotateWrist(angle);
  }
}
