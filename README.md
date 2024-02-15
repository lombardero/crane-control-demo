# Robotic arm interface control

- [Robotic arm interface control](#robotic-arm-interface-control)
  - [Actions](#actions)
  - [Running](#running)
  - [Run the tests](#run-the-tests)


Demo user interface controlling a robotic arm of three degrees of liberty:
1. A robotic arm that can rotate on one of the extremes and change its elevation
2. A second arm -we will call "forearm"- attached to the first one, which can rotate relative to the first arm
3. A third arm -we will call "hand"- attached to the "forearm", which can rotate as well, and has a gripper at its tip.

Naming conventions:
- Swing: the center axis, from which the arm can turn
- Elbow: the arm-forearm axis
- Wrist: the forearm-hand axis

Simplifications:
- **Geometry**. The shapes of the robot have been simplified to prisms.
- **Ground movement**. The crane is considered fixed on the ground; the axis origin is placed on the bottom-center axis of the robot. The current code easily supports adding that feature through three-dimensional translations of the axis based on the ground movement and elevation.

## Actions

The user interface allows the user to control the robot in two manners:
1. "Forwards" kinematics. This means directly inputting the positions of its moving parts. The UI displays the position of the gripper relative to the swing
2. Reverse kinematics. Given a desired position, the UI computes the positions required and applies them

> :information_source: At this stage, only the forwards kinematics works.

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
