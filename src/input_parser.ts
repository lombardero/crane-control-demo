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

    // Pass action done by the form
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

    // Initialise forms
    this.forwardForm.listenUserInput();
  }
}
