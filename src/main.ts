import { setScene, set3DView } from "./renderer";
import { configLoader } from "./config_loader";
// import { setForwardKinematicsForm } from "./input_parser";

const robotInput = configLoader();
const scene = setScene(robotInput.robotController.render);
set3DView(scene);
// setForwardKinematicsForm(robotInput.robotController);
