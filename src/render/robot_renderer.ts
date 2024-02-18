import * as THREE from "three";
import { RobotControl } from "../control/robot_controller";
import { RobotGeometry } from "../geometry/robot_geometry";

export class RobotRender implements RobotControl {
  torso: THREE.Mesh;
  swing: THREE.Object3D;
  arm: THREE.Mesh;
  elbow: THREE.Object3D;
  forearm: THREE.Mesh;
  wrist: THREE.Object3D;
  hand: THREE.Mesh;

  constructor(geometry: RobotGeometry) {
    const torsoGeometry = new THREE.BoxGeometry(
      geometry.thickness,
      geometry.thickness,
      geometry.torsoHeight
    );
    const armGeometry = new THREE.BoxGeometry(
      geometry.thickness,
      geometry.swingToElbow + geometry.thickness,
      geometry.thickness
    );
    const forearmGeometry = new THREE.BoxGeometry(
      geometry.thickness,
      geometry.elbowToWrist + 2 * geometry.thickness,
      geometry.thickness
    );
    const handGeometry = new THREE.BoxGeometry(
      geometry.thickness,
      geometry.wristToGripper + 2 * geometry.thickness,
      geometry.thickness
    );

    torsoGeometry.translate(0, 0, geometry.torsoHeight / 2);
    armGeometry.translate(
      0,
      (geometry.swingToElbow + geometry.thickness) / 2,
      geometry.minHeight
    );
    forearmGeometry.translate(
      0,
      (geometry.elbowToWrist + geometry.thickness) / 2,
      geometry.minHeight - geometry.thickness
    );
    handGeometry.translate(
      0,
      (geometry.wristToGripper + 2 * geometry.thickness) / 2,
      geometry.minHeight - 2 * geometry.thickness
    );

    const material = new THREE.MeshPhysicalMaterial({ color: 0xf84c24 });

    this.swing = new THREE.Object3D();
    this.elbow = new THREE.Object3D();
    this.wrist = new THREE.Object3D();

    this.swing.translateY(0);
    this.elbow.translateY(geometry.swingToElbow);
    this.wrist.translateY(geometry.elbowToWrist);

    this.hand = new THREE.Mesh(handGeometry, material);
    this.forearm = new THREE.Mesh(forearmGeometry, material);
    this.arm = new THREE.Mesh(armGeometry, material);
    this.torso = new THREE.Mesh(torsoGeometry, material);

    this.wrist.add(this.hand);
    this.forearm.add(this.wrist);
    this.elbow.add(this.forearm);
    this.arm.add(this.elbow);
    this.swing.add(this.arm);
    this.torso.add(this.swing);
  }

  getRender() {
    return this.torso;
  }

  moveLift(distance: number): void {
    this.arm.translateZ(distance);
  }

  rotateSwing(angle: number): void {
    this.swing.rotateZ(angle);
  }

  rotateElbow(angle: number): void {
    this.elbow.rotateZ(angle);
  }

  rotateWrist(angle: number): void {
    this.wrist.rotateZ(angle);
  }
}
