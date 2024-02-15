import { Point } from "./geometry";
import { RobotPosition } from "./robot_controller";
import { RobotGeometry } from "./robot_geometry";

class ImpossiblePositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImpossiblePositionError";
  }
}

class UnreachablePositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnreachablePositionError";
  }
}

interface InverseKinematics {
  getRobotPosition(
    gripperPosition: Point,
    swingPosition: Point,
    gripperAlignmentAngle: number
  ): RobotPosition;
}

export class InverseKinematicsCalculator implements InverseKinematics {
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

    console.log(
      `Desired wrist ${[
        desiredWristPosition.x,
        desiredWristPosition.y,
        desiredWristPosition.z,
      ]}`
    );
    console.log(
      `Swing position ${[swingPosition.x, swingPosition.y, swingPosition.z]}`
    );
    const desiredSwingToWristDistanceXY = Math.sqrt(
      (swingPosition.x - desiredWristPosition.x) ** 2 +
        (swingPosition.y - desiredWristPosition.y) ** 2
    );
    swingPosition.getDistance(desiredWristPosition);

    const wristPositionSwingAngle = Math.atan(
      desiredWristPosition.x / desiredWristPosition.y
    );

    if (
      desiredSwingToWristDistanceXY >
      this.geometry.swingToElbow + this.geometry.elbowToWrist
    ) {
      throw new UnreachablePositionError("The desired position is too far!");
    }

    // if (desiredWristPosition.x != 0) {
    //   var wristPositionSwingAngle = Math.acos(
    //     desiredSwingToWristDistance / desiredWristPosition.x
    //   );
    // } else if (desiredWristPosition.y != 0) {
    //   console.log("Not zerooo");
    //   var wristPositionSwingAngle = Math.asin(
    //     desiredSwingToWristDistance / desiredWristPosition.y
    //   );
    //   console.log(desiredSwingToWristDistance);
    //   console.log(desiredWristPosition.y);
    // } else {
    //   throw new ImpossiblePositionError("Wrist can't be swing axis");
    // }

    // Compute angle required between arm & forearm to match distance
    // Resolved with basic trigonometry
    const additionalSwingAngle = Math.acos(
      (desiredSwingToWristDistanceXY ** 2 +
        this.geometry.swingToElbow ** 2 -
        this.geometry.elbowToWrist ** 2) /
        (2 * this.geometry.elbowToWrist * desiredSwingToWristDistanceXY)
    );
    console.log(
      `Desired swing angle to wrist ${
        (wristPositionSwingAngle * 180) / Math.PI
      }`
    );
    // if (desiredWristPosition.y < 0) {
    //   wristPositionSwingAngle = 180 - wristPositionSwingAngle;
    // }
    console.log(
      `Desired swing angle to wrist (corrected) ${
        (wristPositionSwingAngle * 180) / Math.PI
      }`
    );
    console.log(`Additional swing ${(additionalSwingAngle * 180) / Math.PI}`);
    const additionalWristAngle = Math.acos(
      (desiredSwingToWristDistanceXY ** 2 +
        this.geometry.elbowToWrist ** 2 -
        this.geometry.swingToElbow ** 2) /
        (2 * this.geometry.swingToElbow * desiredSwingToWristDistanceXY)
    );

    var swingDesiredAngle = wristPositionSwingAngle + additionalSwingAngle;
    if (desiredWristPosition.y < 0) {
      swingDesiredAngle += Math.PI;
    }
    const elbowDesiredAngle = -(additionalSwingAngle + additionalWristAngle);
    const forearmAlignmentAngle = -(swingDesiredAngle + elbowDesiredAngle);

    return new RobotPosition(
      0,
      swingDesiredAngle,
      elbowDesiredAngle,
      forearmAlignmentAngle + gripperAlignmentAngle
    );
  }
}
