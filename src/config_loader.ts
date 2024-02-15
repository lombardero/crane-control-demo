import * as config from "./robot_geometry.json";
import { RobotGeometry } from "./geometry/robot_geometry";
import { RobotController } from "./robot_controller";
import { RobotInputController } from "./input_parser";

export function loadConfig(): RobotInputController {
  const robotGeometry = loadRobotGeometryFromConfig();
  return new RobotInputController(new RobotController(robotGeometry));
}

function loadRobotGeometryFromConfig(): RobotGeometry {
  return new RobotGeometry(
    config.axis_distances.swing_to_elbow,
    config.axis_distances.elbow_to_wrist,
    config.axis_distances.wrist_to_gripper,
    config.geometry.width,
    config.geometry.torso.height,
    config.geometry.torso.min_height
  );
}
