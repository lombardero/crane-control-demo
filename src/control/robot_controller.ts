import {
  RobotGeometry,
  RobotPositionCalculator,
} from "../geometry/robot_geometry";
import { RobotRender } from "../render/robot_renderer";
import { InverseKinematicsCalculator } from "../geometry/inverse_kinematics";
import { Point } from "../geometry/geometry";

export interface RobotControl {
  // Instruction with delta positions.

  moveLift(distance: number): void;

  rotateSwing(angle: number): void;

  rotateElbow(angle: number): void;

  rotateWrist(angle: number): void;
}

class RobotPosition {
  // Instruction with absolute positions.
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
    console.log(`New position ${[lift, swing, elbow, wrist]}`);
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

interface RobotInverseInstructions {
  reach(gripperPosition: Point, gripperAlignmentAngle: number): void;
}

class RobotController
  implements RobotForwardInstructions, RobotInverseInstructions, RobotControl
{
  currentPosition: RobotPosition;
  previousPosition: RobotPosition;
  geometryCalculator: RobotPositionCalculator;
  inverseKinematicsCalculator: InverseKinematicsCalculator;
  render: RobotRender;
  // TODO: add actual robot proxy to instruct movement.

  constructor(geometry: RobotGeometry) {
    this.currentPosition = new RobotPosition();
    this.previousPosition = this.currentPosition;
    this.geometryCalculator =
      RobotPositionCalculator.loadFromGeometry(geometry);
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
    this.previousPosition = this.currentPosition;
    this.currentPosition = position;
  }

  revertToPreviousPosition(): void {
    this.setPosition(this.previousPosition);
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

export { RobotPosition, RobotController };
