import { Point } from "./geometry";
import { RobotPosition } from "./robot_controller";
import { RobotGeometry } from "./robot_geometry";

// class RobotPosition = {
//   liftDistance: number;
//   swingRotation: number;
//   elbowRotation: number;
//   wristRotation: number;

//   constructor(
//     liftDistance: number,
//     swingRotation: number,
//     elbowRotation: number,
//     wristRotation: number
//   ) {
//     this.liftDistance = liftDistance;
//     this.swingRotation = swingRotation;
//     this.elbowRotation = elbowRotation;
//     this.wristRotation = wristRotation;
//   }
// };

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

    const desiredSwingToWristDistance =
      swingPosition.getDistance(desiredWristPosition);

    if (desiredWristPosition.x != 0) {
      var wristPositionSwingAngle = Math.acos(
        desiredSwingToWristDistance / desiredWristPosition.x
      );
    } else if (desiredWristPosition.y != 0) {
      var wristPositionSwingAngle = Math.asin(
        desiredSwingToWristDistance / desiredWristPosition.y
      );
    } else {
      throw new ImpossiblePositionError("Wrist can't be swing axis");
    }

    // Compute angle required between arm & forearm to match distance
    // Resolved with basic trigonometry

    const additionalSwingAngle = Math.acos(
      (desiredSwingToWristDistance ** 2 +
        this.geometry.swingToElbow ** 2 -
        this.geometry.elbowToWrist ** 2) /
        (2 * this.geometry.elbowToWrist * desiredSwingToWristDistance)
    );
    const additionalWristAngle = Math.acos(
      (desiredSwingToWristDistance ** 2 +
        this.geometry.elbowToWrist ** 2 -
        this.geometry.swingToElbow ** 2) /
        (2 * this.geometry.swingToElbow * desiredSwingToWristDistance)
    );

    const swingDesiredAngle = wristPositionSwingAngle + additionalSwingAngle;
    const elbowDesiredAngle =
      Math.PI - additionalSwingAngle - additionalWristAngle;
    const forearmAlignmentAngle = swingDesiredAngle + elbowDesiredAngle;

    return new RobotPosition(
      0,
      swingDesiredAngle,
      elbowDesiredAngle,
      forearmAlignmentAngle + gripperAlignmentAngle
    );
  }
}
