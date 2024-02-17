import { setScene, set3DView } from "./render/renderer";
import { loadConfig } from "./input/config_loader";

const inputController = loadConfig();
inputController.listenUserInput();
const scene = setScene(inputController.robotController.render);
set3DView(scene);
