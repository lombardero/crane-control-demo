import { setScene, set3DView } from "./renderer";
import { loadConfig } from "./config_loader";
// import { setForwardKinematicsForm } from "./input_parser";

const inputController = loadConfig();
inputController.listenUserInput();
const scene = setScene(inputController.robotController.render);
set3DView(scene);
// setForwardKinematicsForm(robotInput.robotController);
