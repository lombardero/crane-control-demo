import { Point, Vector } from "./geometry";
import { RobotControl } from "./robot_controller";

export class RobotGeometry {
  swingToElbow: number;
  elbowToWrist: number;
  wristToGripper: number;

  thickness: number;

  torsoHeight: number;

  minHeight: number;

  constructor(
    swingToElbow: number,
    elbowToWrist: number,
    wristToGripper: number,
    thickness: number,
    torsoHeight: number,
    minHeight: number
  ) {
    this.swingToElbow = swingToElbow;
    this.elbowToWrist = elbowToWrist;
    this.thickness = thickness;
    this.wristToGripper = wristToGripper;
    this.torsoHeight = torsoHeight;
    this.minHeight = minHeight;
  }
}

class RoboticArm {
  start: Point;
  end: Point;
  attachedPiece: RoboticArm | null;
  attachementConnectionDistance: Vector | null;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
    this.attachedPiece = null;
    this.attachementConnectionDistance = null;
  }

  attach(piece: RoboticArm) {
    this.attachedPiece = piece;
    this.attachementConnectionDistance = new Vector(
      this.end.x - this.attachedPiece.start.x,
      this.end.y - this.attachedPiece.start.y,
      this.end.z - this.attachedPiece.start.z
    );
  }

  rotateZ(angle: number) {
    this.end.rotateZ(angle, this.start);

    if (this.attachedPiece != null) {
      this.moveAttachedPiece();
      this.attachedPiece?.rotateZ(angle);
    }
  }

  private moveAttachedPiece() {
    if (
      this.attachedPiece != null &&
      this.attachementConnectionDistance != null
    ) {
      const movementNeeded = new Vector(
        this.end.x -
          this.attachedPiece.start.x -
          this.attachementConnectionDistance.x,
        this.end.y -
          this.attachedPiece.start.y -
          this.attachementConnectionDistance.y,
        this.end.z -
          this.attachedPiece.start.z -
          this.attachementConnectionDistance.z
      );

      this.attachedPiece.move(movementNeeded);
    }
  }

  move(amount: Vector) {
    this.start.move(amount);
    this.end.move(amount);

    if (this.attachedPiece != null) {
      this.attachedPiece.move(amount);
    }
  }

  getRotation() {
    const roboticArm = new Vector(
      this.end.x - this.start.x,
      this.end.y - this.start.y,
      this.end.z - this.start.z
    );
    const zAxis = new Vector(0, 0, 1);

    return Vector.angleBetween(zAxis, roboticArm);
  }
}

export class RobotGeometryCalculator implements RobotControl {
  arm: RoboticArm;
  forearm: RoboticArm;
  hand: RoboticArm;

  constructor(arm: RoboticArm, forearm: RoboticArm, hand: RoboticArm) {
    this.arm = arm;
    this.forearm = forearm;
    this.hand = hand;

    this.arm.attach(this.forearm);
    this.forearm.attach(this.hand);
  }

  moveLift(distance: number) {
    this.arm.move(new Vector(0, 0, distance));
  }

  rotateSwing(angle: number) {
    this.arm.rotateZ(angle);
    console.log(`Rotate swign ${angle}`);
    this.getGripperCoordinates();
  }

  rotateElbow(angle: number) {
    this.forearm.rotateZ(angle);
    console.log(`Rotate elbow ${angle}`);
    this.getGripperCoordinates();
  }

  rotateWrist(angle: number) {
    this.hand.rotateZ(angle);
    console.log(`Rotate wrist ${angle}`);
    this.getGripperCoordinates();
  }

  getGripperCoordinates(): number[] {
    // console.log(this.arm.start.getAsList());
    // console.log(this.arm.end.getAsList());
    // console.log(this.forearm.start.getAsList());
    // console.log(this.forearm.end.getAsList());
    // console.log(this.hand.start.getAsList());
    // console.log(this.hand.end.getAsList());
    return this.hand.end.getAsList();
  }
}

export function loadGeometryCalculatorfromRobotGeometry(
  robotGeometry: RobotGeometry
): RobotGeometryCalculator {
  const arm = new RoboticArm(
    new Point(0, 0, robotGeometry.minHeight),
    new Point(0, robotGeometry.swingToElbow, robotGeometry.minHeight)
  );
  const forearm = new RoboticArm(
    new Point(
      0,
      robotGeometry.swingToElbow,
      robotGeometry.minHeight - robotGeometry.thickness
    ),
    new Point(
      0,
      robotGeometry.swingToElbow + robotGeometry.elbowToWrist,
      robotGeometry.minHeight - robotGeometry.thickness
    )
  );
  const hand = new RoboticArm(
    new Point(
      0,
      robotGeometry.swingToElbow + robotGeometry.elbowToWrist,
      robotGeometry.minHeight - 2 * robotGeometry.thickness
    ),
    new Point(
      0,
      robotGeometry.swingToElbow +
        robotGeometry.elbowToWrist +
        robotGeometry.wristToGripper,
      robotGeometry.minHeight - 2 * robotGeometry.thickness
    )
  );
  return new RobotGeometryCalculator(arm, forearm, hand);
}
