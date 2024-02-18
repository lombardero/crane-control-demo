import { Point } from "./geometry";
import { RobotPosition } from "../control/robot_controller";
import { RobotGeometry } from "./robot_geometry";

class UnreachablePositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnreachablePositionError";
  }
}

class ClashingPositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClashingPositionError";
  }
}

class ImpossiblePositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImpossiblePositionError";
  }
}

interface InverseKinematics {
  getRobotPosition(
    gripperPosition: Point,
    swingPosition: Point,
    gripperAlignmentAngle: number
  ): RobotPosition;
}

class InverseKinematicsCalculator implements InverseKinematics {
  geometry: RobotGeometry;

  constructor(robotGeometry: RobotGeometry) {
    this.geometry = robotGeometry;
  }

  getRobotPosition(
    gripperPosition: Point,
    swingPosition: Point,
    gripperAlignmentAngle: number = 0
  ): RobotPosition {
    // Compute coordinates of wrist to reduce problem to 2 DOF
    const desiredWristPosition = new Point(
      gripperPosition.x -
        this.geometry.wristToGripper * Math.sin(gripperAlignmentAngle),
      gripperPosition.y -
        this.geometry.wristToGripper * Math.cos(gripperAlignmentAngle),
      gripperPosition.z
    );

    const desiredSwingToWristDistanceXY = Math.sqrt(
      (swingPosition.x - desiredWristPosition.x) ** 2 +
        (swingPosition.y - desiredWristPosition.y) ** 2
    );
    swingPosition.getDistance(desiredWristPosition);

    if (desiredSwingToWristDistanceXY == 0) {
      throw new ClashingPositionError(
        "Can't perform this move, wrist would clash with swing!"
      );
    }

    const wristPositionSwingAngle = Math.atan(
      desiredWristPosition.x / desiredWristPosition.y
    );

    if (
      desiredSwingToWristDistanceXY >
      this.geometry.swingToElbow + this.geometry.elbowToWrist
    ) {
      throw new UnreachablePositionError("The desired position is too far!");
    }
    // Resolved with basic trigonometry
    const additionalSwingAngle = Math.acos(
      (desiredSwingToWristDistanceXY ** 2 -
        this.geometry.elbowToWrist ** 2 +
        this.geometry.swingToElbow ** 2) /
        (2 * this.geometry.swingToElbow * desiredSwingToWristDistanceXY)
    );

    console.log(
      `Additionla swing angle: ${(additionalSwingAngle * 180) / Math.PI}`
    );

    const additionalWristAngle = Math.acos(
      (desiredSwingToWristDistanceXY ** 2 -
        this.geometry.swingToElbow ** 2 +
        this.geometry.elbowToWrist ** 2) /
        (2 * this.geometry.elbowToWrist * desiredSwingToWristDistanceXY)
    );

    if (isNaN(additionalSwingAngle) || isNaN(additionalSwingAngle)) {
      throw new ImpossiblePositionError(
        "Robot geometry does not support this position!"
      );
    }

    var swingDesiredAngle = wristPositionSwingAngle + additionalSwingAngle;
    if (desiredWristPosition.y < 0) {
      swingDesiredAngle += Math.PI;
    }
    const elbowDesiredAngle = -(additionalSwingAngle + additionalWristAngle);
    const forearmAlignmentAngle = -(swingDesiredAngle + elbowDesiredAngle);

    return new RobotPosition(
      gripperPosition.z - this.geometry.minHeight + 2 * this.geometry.thickness,
      swingDesiredAngle,
      elbowDesiredAngle,
      forearmAlignmentAngle + gripperAlignmentAngle
    );
  }
}

export { InverseKinematicsCalculator };
