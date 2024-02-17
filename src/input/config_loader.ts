import * as config from "../robot_geometry.json";
import { RobotGeometry } from "../geometry/robot_geometry";
import {
  RobotController,
  RobotPositionRange,
  PositionRange,
} from "../control/robot_controller";
import { RobotInputController } from "./input_parser";

function loadConfig(): RobotInputController {
  const robotGeometry = loadRobotGeometryFromConfig();
  const robotPositionRange = loadRobotRangeFromConfig();
  return new RobotInputController(
    new RobotController(robotGeometry, robotPositionRange)
  );
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

function loadRobotRangeFromConfig(): RobotPositionRange {
  return new RobotPositionRange(
    new PositionRange(
      config.movement_ranges.lift.min,
      config.movement_ranges.lift.max
    )
  );
}

export { loadConfig };
