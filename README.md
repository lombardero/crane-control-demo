# Robotic arm interface control

- [Robotic arm interface control](#robotic-arm-interface-control)
  - [Actions](#actions)
  - [Running](#running)
  - [Run the tests](#run-the-tests)


Demo user interface controlling a robotic arm with 4 degrees of freedom:
1. A vertical column that can rotate on its vertical axis
2. A robotic arm attached to the vertical column that move up and down vertically
3. A second arm -we will call "forearm"- attached to "arm", which can rotate relative it
4. A third arm -we will call "hand"- attached to the "forearm", which can rotate as well, and has a gripper at its tip.

Naming conventions:
- Swing: the center axis, from which the first arm can turn and move vertically
- Elbow: the arm-forearm axis
- Wrist: the forearm-hand axis

Simplifications:
- **Geometry**. The shapes of the robot have been simplified to prisms.
- **Components**. The robot has been modeled as three equal components that can rotate on the joint with another side. The first component can also move vertically.
- **Point of reference**. The origin is fixed on the base of the swing. That way, adding ground movement of the robot is trivial: it just requires translation of the coordinates relative to the ground.

## Actions

The user interface allows the user to control the robot in two manners:
1. "Forwards" kinematics. This means directly inputting the actual movements of the moving parts. This can be useful to display the robot in 3D after receving the telemetry data. The UI then displays the position of the gripper relative to the swing. That position is then editable via the inverse kinematics form.
2. Inverse kinematics. The user adds a desired position for thre gripper, and the UI computes the position required by the robotic arm and applies it.

> :information_source: Currently, the inverse kinematics uses a simple trigonometric function to derive the position of the arm.

## Running

Install dependencies:
```sh
$ npm install
```

Run the code:
```sh
$ npm run dev
```
- The project will be running in `localhost:5173`


## Run the tests

```sh
$ npm test
```
