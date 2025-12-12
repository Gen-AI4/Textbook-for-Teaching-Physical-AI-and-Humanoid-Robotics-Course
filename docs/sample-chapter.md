---
sidebar_position: 8
title: 'Sample Chapter: Introduction to PID Control'
description: 'A sample chapter demonstrating various Markdown elements in textbook context'
---

# Sample Chapter: Introduction to PID Control

## Overview

This sample chapter demonstrates the various Markdown elements that can be used when creating textbook content, specifically in the context of robotics control systems. We'll explore Proportional-Integral-Derivative (PID) control, a fundamental concept in robotics and automation.

PID control is one of the most common control algorithms used in robotics, particularly for motor control, trajectory following, and balance control in humanoid robots.

## Learning Objectives

After completing this chapter, you will be able to:

- Explain the principles of PID control
- Identify the components of a PID controller
- Understand how PID parameters affect system response
- Apply PID control to simple robotics examples

## What is PID Control?

Proportional-Integral-Derivative (PID) control is a feedback control mechanism that's widely used in industrial control systems and robotics. It continuously calculates an error value as the difference between a desired setpoint (SP) and a measured process variable (PV), then applies a correction based on proportional, integral, and derivative terms.

The PID controller algorithm involves three distinct parameters:

1. Proportional (P) - Reacts to the current error
2. Integral (I) - Reacts to the accumulation of past errors
3. Derivative (D) - Predicts future errors based on current rate of change

## PID Controller Equation

The mathematical representation of a PID controller combines three terms:

- Proportional term: K_p * e(t) - responds to current error
- Integral term: K_i * integral of e(t) from 0 to t - eliminates steady-state error
- Derivative term: K_d * de/dt - predicts future error based on rate of change

Where:
- u(t) is the controller output
- K_p, K_i, and K_d are the coefficients for the proportional, integral, and derivative terms
- e(t) is the error at time t

## Components of PID Control

### Proportional Term

The proportional term responds to the current error. The larger the error, the larger the control action. The proportional gain ($K_p$) determines how aggressively the controller responds to the error.

```python
# Proportional control implementation
def proportional_control(kp, error):
    """
    Calculate proportional control output
    """
    return kp * error
```

:::note
The proportional term alone will often result in steady-state error, as it requires some error to generate a corrective output.
:::

### Integral Term

The integral term accumulates past errors over time. This component addresses steady-state errors that the proportional term cannot eliminate.

```python
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.integral = 0.0
        self.previous_error = 0.0
    
    def calculate(self, error, dt):
        # Proportional term
        proportional = self.kp * error
        
        # Integral term
        self.integral += error * dt
        integral = self.ki * self.integral
        
        # Derivative term
        derivative = self.kd * (error - self.previous_error) / dt
        self.previous_error = error
        
        # Combine terms
        output = proportional + integral + derivative
        return output
```

### Derivative Term

The derivative term predicts future error based on its rate of change. This helps to dampen the system's response and reduce overshoot.

## Tuning PID Parameters

Tuning a PID controller involves adjusting $K_p$, $K_i$, and $K_d$ to achieve the desired system response. Common effects of parameter changes:

| Parameter | Rise Time | Overshoot | Settling Time | S.S. Error |
|-----------|-----------|-----------|---------------|------------|
| $K_p$     | Decrease  | Increase  | Small Change  | Decrease   |
| $K_i$     | Decrease  | Increase  | Increase      | Eliminate  |
| $K_d$     | Small Change | Decrease | Decrease      | No Effect  |

:::caution
Improperly tuned PID controllers can cause unstable behavior, including oscillations or divergence.
:::

## PID in Robotics Applications

PID controllers are widely used in robotics for:

1. **Motor control**: Controlling joint positions, velocities, or torques
2. **Trajectory following**: Following planned paths with precision
3. **Balance control**: Maintaining upright position in bipedal robots
4. **Force control**: Applying specific forces during interaction tasks

### Example: Joint Position Control

For a single robot joint, the PID controller receives the desired position and measures the actual position, computing the error and adjusting the motor command:

```cpp
// Pseudo-code for joint position control
void controlJoint(float desired_position, float actual_position) {
    float error = desired_position - actual_position;
    float command = pid_controller.calculate(error);
    motor.setTorque(command);
}
```

## Practical Example: Controlling a Robot Arm

Let's consider a simple example of controlling a single joint of a robot arm to reach a target angle:

1. The desired angle (setpoint) is 45°
2. The current angle (process variable) is 15°
3. The error is 30°
4. The PID controller computes a control signal based on this error

As the joint moves toward the target, the error decreases, and the control signal is adjusted accordingly.

## Summary

PID control is a fundamental technique in robotics that combines proportional, integral, and derivative terms to achieve precise control of systems. Proper tuning of the PID parameters is essential for achieving stable and responsive control.

For humanoid robots, PID controllers are often used in the low-level control loop to achieve precise joint control, which is essential for stable locomotion and manipulation tasks.

## Exercises

1. Simulate the PID controller implemented above with different parameter values and observe the response
2. Implement a PID controller for velocity control instead of position control
3. Research and explain how PID control can be extended to PIDA (Proportional-Integral-Derivative-Acceleration) control
4. Apply PID control to a simple simulation of a humanoid robot balancing on one foot

## Further Reading

- "Feedback Control of Dynamic Systems" by Franklin, Powell, and Emami-Naeini
- "Robotics: Control, Sensing, Vision, and Intelligence" by Fu, Gonzalez, and Lee
- [PID Controller on Wikipedia](https://en.wikipedia.org/wiki/PID_controller)