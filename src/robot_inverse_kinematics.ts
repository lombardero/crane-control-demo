import { Point } from "./geometry";
import { RobotGeometry } from "./robot_geometry";

type RobotPosition = {
  liftDistance: number;
  swingRotation: number;
  elbowRotation: number;
  wristRotation: number;

  // constructor(
  //   liftDistance: number,
  //   swingRotation: number,
  //   elbowRotation: number,
  //   wristRotation: number
  // ) {
  //   this.liftDistance = liftDistance;
  //   this.swingRotation = swingRotation;
  //   this.elbowRotation = elbowRotation;
  //   this.wristRotation = wristRotation;
  // }
};

type TwoDimensionsCoordinates = {
  x: number;
  y: number;
};

interface InverseKinematics {
  getRobotPosition(gripperPosition: Point, torsoPosition: Point): RobotPosition;
}

class InverseKinematicsCalculator implements InverseKinematics {
  geometry: RobotGeometry;

  constructor(robotGeometry: RobotGeometry) {
    this.geometry = robotGeometry;
  }

  getRobotPosition(
    gripperPosition: Point,
    torsoPosition: Point
  ): RobotPosition {
    if (
      gripperPosition.getDistance(torsoPosition) >
      this.geometry.swingToElbow +
        this.geometry.elbowToWrist +
        this.geometry.wristToGripper
    ) {
      // return error
    }

    // Assume gripper is always aligned with swing
  }

  private twoDegreeOfFreedomInverseKinematics(
    distanceFromAxis: TwoDimensionsCoordinates
  ): TwoDimensionsCoordinates[] {}
}
