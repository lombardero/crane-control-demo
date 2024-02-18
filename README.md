# Robotic arm interface control

- [Robotic arm interface control](#robotic-arm-interface-control)
- [About](#about)
  - [Conventions](#conventions)
  - [Simplifications](#simplifications)
- [Interface](#interface)
  - [How to use it](#how-to-use-it)
- [Design philosophy](#design-philosophy)
- [Running](#running)
  - [Install](#install)
  - [Run the code](#run-the-code)
  - [Run the tests](#run-the-tests)

# About

This project creates a user interface enabling to control a robotic arm with 4 degrees of freedom:
1. A vertical column that can rotate on its vertical axis
2. A robotic arm attached to the vertical column that move up and down vertically
3. A second arm -we will call "forearm"- attached to "arm", which can rotate relative it
4. A third arm -we will call "hand"- attached to the "forearm", which can rotate as well, and has a gripper at its tip.

## Conventions

- Swing: the center axis, from which the first arm can turn and move vertically
- Elbow: the arm-forearm axis
- Wrist: the forearm-hand axis

## Simplifications

- **Geometry**. The shapes of the robot have been simplified to prisms.
- **Components**. The robot has been modeled as three equal components that can rotate on the joint with another side. The first component can also move vertically.
- **Point of reference**. The origin is fixed on the base of the swing. That way, adding ground movement of the robot is trivial: it just requires translation of the coordinates relative to the ground.

# Interface

The interface enables the user to define and visualise the positions of a robotic arm:
- **Forwards**. Given a robot position, show how it looks like and where does the gripper reach. This can be controlled via the `Forward kinematics control` form.
- **Backwards**. Given a desired destination of the gripper, instruct the robot to reach it. This can be controlled via the `Inverse kinematics control` form.

> :information_source: The inverse kinematics uses a [simple trigonometric function](/assets/inverse-kin-calc.jpg) to derive the position of the arm.

## How to use it

The user is expected to:
1. Define the desired robot geometry in the configuration file: `robot_geometry.json`
2. [Run the code](#run-the-code)
3. Visit `localhost:5173` and play with the forms


# Design philosophy
The main design choice has been **modularity**. The code is not designed as a standalone UI for a given application (such as controlling the crane on site, or defining the kinematics beforehand), but as a simple functionality that can be easily extended.

Possible extensions:
- **:construction_worker: On-site usage**. The project can easily be hooked to a telemetry API, which updates the actual position of the robot in real-time. The project also supports adding a second "virtual" render representing the outcome of a movement instruction, if needed.
- **:triangular_ruler: Kinematics definition**. Horizontal displacement can easily be added to the project by translating the Swing axis on the ground, and UX features such as "click-to-reach" can be added instead of the manual instertion of the (x, y, z) coordinates to speed the process.
- **:pencil2: Inverse kinematics**. Add smarter inverse kinematics algorithms instead of the default one.
- **:clock2: Add a time component**. This tool could be used together with a time-series database such as TimescaleDB to "scroll through time" while visualising the positions of the crane like a video recording.
- **:recycle: Reusing the code**. The Geometry classes -totally configurable- can be used to test possible new robot configurations, and for other geomtry-related projects.

# Running

## Install

Install dependencies:
```sh
$ npm install
```

## Run the code
Run the code:
```sh
$ npm run dev
```
- The project will be running in `localhost:5173`


## Run the tests

```sh
$ npm test
```
