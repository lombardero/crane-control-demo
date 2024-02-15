import { RobotController, RobotPosition } from "./robot_controller";
import { Point } from "./geometry";

type FormCallable = (formInput: number[]) => void;

export class FormController {
  form: HTMLFormElement;
  errorDisplay: HTMLElement;
  formInput: HTMLInputElement[];
  formSubmit: FormCallable;
  currentValues: number[];

  constructor(
    formId: string,
    errorDisplayId: string,
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
    const errorDisplay = document.getElementById(
      errorDisplayId
    ) as HTMLFormElement;
    if (!errorDisplay) {
      throw new Error(
        `Could not construct Error display controller, element with ID ${formId} not found`
      );
    }
    this.errorDisplay = errorDisplay;
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

  displayErrorForm(message: string): void {
    this.errorDisplay.style.display = "block";
    this.errorDisplay.textContent = message;
  }

  hideErrorForm(): void {
    this.errorDisplay.style.display = "none";
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
      "forward-kin-error",
      ["swing", "elbow", "wrist"],
      [0, 0, 0]
    );
    this.reverseForm = new FormController(
      "reverse-kin-form",
      "reverse-kin-error",
      ["x", "y", "z"],
      [0, 0, 0]
    );

    // Pass action done by the form
    this.forwardForm.onFormSubmit((formInput: number[]) => {
      // Parse input
      const formInRadians = formInput.map(
        (valueInDegrees) => (valueInDegrees / 180) * Math.PI
      );
      const newPosition = new RobotPosition(0, ...formInRadians);
      // Move robot
      try {
        this.robotController.setPosition(newPosition);
        this.forwardForm.hideErrorForm();
      } catch (error: any) {
        console.error(
          "Could not perform action due to the following exception:",
          error.message
        );
        this.forwardForm.displayErrorForm(error.message);
      }

      // Update mirror form
      this.reverseForm.setCurrentValues(
        this.robotController.geometryCalculator.getGripperCoordinates()
      );
    });

    this.reverseForm.onFormSubmit((formInput: number[]) => {
      // Parse input
      const pointToReach = new Point(...formInput);
      // Move robot
      try {
        this.robotController.reach(pointToReach, 0);
        this.reverseForm.hideErrorForm();
      } catch (error: any) {
        console.error(
          "Could not perform action due to the following exception:",
          error.message
        );
        this.reverseForm.displayErrorForm(`Error: ${error.message}`);
      }

      // Update mirror form
      this.forwardForm.setCurrentValues([
        (this.robotController.currentPosition.swing * 180) / Math.PI,
        (this.robotController.currentPosition.elbow * 180) / Math.PI,
        (this.robotController.currentPosition.wrist * 180) / Math.PI,
      ]);
    });
  }

  listenUserInput() {
    this.forwardForm.listenUserInput();
    this.reverseForm.listenUserInput();
  }
}
