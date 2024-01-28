import { RobotController, RobotPosition } from "./robot_controller";

type FormCallable = (formInput: number[]) => void;

class FormController {
  form: HTMLFormElement;
  formInput: HTMLInputElement[];
  formSubmit: FormCallable;
  currentValues: number[];

  constructor(
    formId: string,
    formElementIds: string[],
    defaultValues: number[]
  ) {
    // Get form element.
    const form = document.getElementById(formId) as HTMLFormElement;

    if (!form) {
      throw new Error(
        `Could not construct Form controller, form with ID ${formId} not found`
      );
    }
    this.form = form;

    // Get form indexes.
    this.formInput = [];

    formElementIds.forEach((elementId) => {
      const element = form.elements.namedItem(elementId) as HTMLInputElement;
      if (element == null) {
        throw new Error(`Could not find form element with ID ${elementId}`);
      }
      this.formInput.push(element);
    });

    this.currentValues = defaultValues;
    for (let index = 0; index < this.formInput.length; index++) {
      this.formInput[index].value = defaultValues[index].toString();
    }

    this.formSubmit = () => [];
  }

  updateCurrentValues() {
    const formValues: number[] = [];

    this.formInput.forEach((formElement) => {
      formValues.push(parseFloat(formElement.value));
    });
    this.currentValues = formValues;
  }

  onFormSubmit(formSubmit: FormCallable) {
    this.formSubmit = formSubmit;
  }

  setCurrentValues(values: number[]) {
    for (let index = 0; index < this.formInput.length; index++) {
      this.formInput[index].value = values[index].toString();
    }
  }

  listenUserInput(): void {
    this.form.addEventListener("submit", (event: Event) => {
      event.preventDefault();

      this.updateCurrentValues();
      this.formSubmit(this.currentValues);
    });
  }
}

export class RobotInputController {
  robotController: RobotController;
  forwardForm: FormController;
  reverseForm: FormController;

  constructor(robotController: RobotController) {
    this.robotController = robotController;

    this.forwardForm = new FormController(
      "forward-kin-form",
      ["swing", "elbow", "wrist"],
      [0, 0, 0]
    );
    this.reverseForm = new FormController(
      "reverse-kin-form",
      ["x", "y", "z"],
      [0, 0, 0]
    );

    this.forwardForm.onFormSubmit((formInput: number[]) => {
      const formInRadians = formInput.map(
        (valueInDegrees) => (valueInDegrees / 180) * Math.PI
      );
      // Move robot
      const newPosition = new RobotPosition(0, ...formInRadians);
      this.robotController.setPosition(newPosition);

      // Update mirror form
      this.reverseForm.setCurrentValues(
        this.robotController.geometryCalculator.getGripperCoordinates()
      );
    });
    this.forwardForm.listenUserInput();
  }
}

// function setForwardKinematicsForm(robotController: RobotController): void {
//   const form = document.getElementById("forward-kin-form") as HTMLFormElement;

//   if (form) {
//     const defaultSwingRotation = 0;
//     const defaultElbowRotation = 0;
//     const defaultWristRotation = 0;

//     // Get references to the input elements
//     const swingRotationInput = form.elements.namedItem(
//       "swing"
//     ) as HTMLInputElement;
//     const elbowRotationInput = form.elements.namedItem(
//       "elbow"
//     ) as HTMLInputElement;
//     const wristRotationInput = form.elements.namedItem(
//       "wrist"
//     ) as HTMLInputElement;

//     // Check if inputs are null
//     if (swingRotationInput && elbowRotationInput && wristRotationInput) {
//       // Set default values for the inputs
//       swingRotationInput.value = defaultSwingRotation.toString();
//       elbowRotationInput.value = defaultElbowRotation.toString();
//       wristRotationInput.value = defaultWristRotation.toString();
//     }

//     form.addEventListener("submit", function (event: Event) {
//       event.preventDefault(); // Prevent default form submission behavior

//       // Access form values
//       const swing: number =
//         (parseFloat(swingRotationInput.value) / 180) * Math.PI;
//       const elbow: number =
//         (parseFloat(elbowRotationInput.value) / 180) * Math.PI;
//       const wrist: number =
//         (parseFloat(wristRotationInput.value) / 180) * Math.PI;

//       // Use form values in JavaScript code
//       const desiredPosition = new RobotPosition(0, swing, elbow, wrist);
//       robotController.setPosition(desiredPosition);

//       // Add your further processing logic here
//     });
//   } else {
//     console.error("Form element with ID 'forward-kin-form' not found.");
//   }
// }

// function setReverseKinematicsForm(): void {
//   // robotController: RobotController
//   const form = document.getElementById("reverse-kin-form") as HTMLFormElement;

//   if (form) {
//     // Set default values for the inputs
//     const defaultX = 0; // Default value for number 1
//     const defaultY = 0; // Default value for number 2
//     const defaultZ = 0; // Default value for number 3

//     // Get references to the input elements
//     const gripperX = form.elements.namedItem("x") as HTMLInputElement;
//     const gripperY = form.elements.namedItem("y") as HTMLInputElement;
//     const gripperZ = form.elements.namedItem("x") as HTMLInputElement;

//     // Check if inputs are null
//     if (gripperX && gripperY && gripperZ) {
//       // Set default values for the inputs
//       gripperX.value = defaultX.toString();
//       gripperY.value = defaultY.toString();
//       gripperZ.value = defaultZ.toString();
//     }

//     form.addEventListener("submit", function (event: Event) {
//       event.preventDefault(); // Prevent default form submission behavior

//       // Access form values
//       const desiredX: number = parseFloat(gripperZ.value);
//       const desirezY: number = parseFloat(gripperZ.value);
//       const desiredZ: number = parseFloat(gripperZ.value);

//       // Use form values in JavaScript code
//       // Use reverse Kinematics to compute new position
//       const desiredPosition = new RobotPosition(0, swing, elbow, wrist);
//       robotController.setPosition(desiredPosition);

//       // Update the other form.

//       // Add your further processing logic here
//     });
//   } else {
//     console.error("Form element with ID 'forward-kin-form' not found.");
//   }
// }
