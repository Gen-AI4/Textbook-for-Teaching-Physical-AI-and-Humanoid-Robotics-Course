---
sidebar_position: 16
title: 'Chapter 3 - Walking Pattern Generation'
---

# Chapter 3 - Walking Pattern Generation

## Overview

Walking pattern generation is a critical component of humanoid robotics that converts high-level locomotion goals into detailed joint trajectories. This chapter explores different approaches to creating stable, efficient, and natural walking patterns for humanoid robots.

## Learning Objectives

By the end of this chapter, you will be able to:
- Explain different approaches to walking pattern generation
- Implement basic walking pattern generators
- Analyze the stability and efficiency of walking patterns
- Design walking patterns for different terrains and speeds

## Walking Pattern Approaches

### Predefined Trajectory Methods

These methods use fixed templates that are time-scaled for different speeds:

1. **Motion Capture Data**: Recording human walking patterns
2. **Analytical Models**: Mathematical models of walking
3. **Optimization-based Generation**: Trajectories optimized for specific criteria

### Model-Based Approaches

Using physical models to generate walking patterns:

#### Linear Inverted Pendulum Model (LIPM)

The LIPM assumes the robot's center of mass maintains a constant height, simplifying the dynamics:

```python
# Example: LIPM-based walking pattern generation
import numpy as np

class LIPMWalkingGenerator:
    def __init__(self, z_height, gravity=9.81):
        self.z_height = z_height
        self.omega = np.sqrt(gravity / z_height)
        
    def generate_com_trajectory(self, start_pos, goal_pos, step_time):
        # Generate CoM trajectory using LIPM
        dt = 0.01  # time step
        t = np.arange(0, step_time, dt)
        
        # LIPM solution: CoM moves exponentially toward goal
        x0, y0 = start_pos
        xg, yg = goal_pos
        
        x_traj = xg + (x0 - xg) * np.exp(-self.omega * t)
        y_traj = yg + (y0 - yg) * np.exp(-self.omega * t)
        
        return x_traj, y_traj, np.full_like(t, self.z_height)
```

#### Cart-Table Model

An extension of LIPM that allows vertical CoM movement:

- More realistic than LIPM
- Still computationally efficient
- Better energy efficiency

### Online Pattern Generation

#### Preview Control

Uses future ZMP reference to compute stable CoM trajectories:

```python
# Example: Preview control for ZMP tracking
class PreviewController:
    def __init__(self, z_height, gravity=9.81, control_horizon=100):
        self.z_height = z_height
        self.omega = np.sqrt(gravity / z_height)
        self.horizon = control_horizon
        
        # Precompute Riccati solution for LQR
        self.K = self.compute_lqr_gain()
        self.P = self.compute_riccati_solution()
    
    def compute_com_reference(self, current_state, zmp_reference):
        # Use preview control to compute CoM trajectory
        # that will track the ZMP reference
        com_ref = self.lqr_feedback(current_state)
        for i in range(min(self.horizon, len(zmp_reference))):
            com_ref += self.preview_gain(i) * zmp_reference[i]
        return com_ref
```

## Footstep Planning

### Step Location Selection

Critical for stable walking:

1. **Capture Point Method**: Steps where robot can come to a stop
2. **Virtual Slope Walking**: Uses ankle torques to control step location
3. **Stability Margin**: Considerable margins for safety

### Foot Trajectory Generation

Creating smooth, collision-free foot movements:

1. **Cubic Splines**: Smooth interpolation between key poses
2. **Bezier Curves**: Control of velocity and acceleration at key points
3. **Polynomial Trajectories**: Fifth-order polynomials for smooth motion

```python
# Example: Foot trajectory generation using 5th order polynomial
def foot_trajectory_5th_order(start_pos, target_pos, lift_height, total_time):
    """
    Generate smooth foot trajectory with lift and placement
    """
    dt = 0.01
    t = np.arange(0, total_time, dt)
    
    # Polynomial coefficients for smooth transition
    # Position: p(t) = a0 + a1*t + a2*t^2 + a3*t^3 + a4*t^4 + a5*t^5
    # Define boundary conditions and solve for coefficients
    
    # For X direction (forward movement)
    a0_x = start_pos[0]
    a1_x = 0  # start from rest
    a2_x = 0  # start with zero acceleration
    a5_x = (6 * (target_pos[0] - start_pos[0])) / (total_time**5)
    a4_x = (-15 * (target_pos[0] - start_pos[0])) / (total_time**4)
    a3_x = (10 * (target_pos[0] - start_pos[0])) / (total_time**3)
    
    x_traj = a0_x + a1_x*t + a2_x*t**2 + a3_x*t**3 + a4_x*t**4 + a5_x*t**5
    
    # For Y direction (lateral movement)
    # Similar polynomial computation
    
    # For Z direction (lifting)
    # Compute trajectory that lifts foot, then places it down
    
    return x_traj, y_traj, z_traj
```

## Walking Pattern Optimization

### Energy Efficiency

Minimizing energy consumption while maintaining stability:

1. **Efficient Gait Patterns**: Optimize for minimal actuator work
2. **Passive Dynamics Use**: Leverage robot's natural dynamics
3. **Optimal Speed Selection**: Choose walking speeds that minimize cost of transport

### Stability Optimization

Ensuring robust walking patterns:

1. **Large Stability Margins**: Keep ZMP far from support polygon edges
2. **Disturbance Rejection**: Design patterns resilient to pushes
3. **Robust Control Integration**: Combine with robust control methods

### Multi-Objective Optimization

Often requires balancing multiple goals:

```python
# Example: Multi-objective optimization for walking
def optimize_walking_pattern(velocity, terrain, energy_weight=0.5, stability_weight=0.5):
    """
    Optimize walking pattern considering multiple objectives
    """
    def objective_function(params):
        # Calculate energy cost
        energy_cost = compute_energy_cost(params)
        
        # Calculate stability margin
        stability_cost = compute_stability_cost(params)
        
        # Combined objective
        return energy_weight * energy_cost + stability_weight * stability_cost
    
    # Optimize using appropriate algorithm
    optimal_params = minimize(objective_function, initial_params)
    return optimal_params
```

## Terrain Adaptation

### Flat Ground Walking

Simplest case with consistent step timing and location:

- Consistent double-support phases
- Predictable ground contact forces
- Optimized for energy efficiency

### Uneven Terrain

Requires adaptation strategies:

1. **Step Height Adjustment**: Modify foot lifting for obstacles
2. **Step Location Planning**: Choose appropriate footholds
3. **Balance Recovery**: Adapt to unexpected surface changes

### Stairs and Steps

Specialized walking patterns for level changes:

1. **Step Climbing**: Lifting swing leg higher
2. **Step Descending**: Controlled lowering
3. **Transition Phases**: Safe transitions between levels

## Real-time Adaptation

### Feedback-Based Adaptation

Modifying walking patterns based on sensor feedback:

1. **Push Recovery**: Adjust timing and step location during disturbances
2. **Slip Detection**: Modify pattern when feet slip
3. **Terrain Sensing**: Adapt to changing ground conditions

### Predictive Adaptation

Using sensors to anticipate terrain changes:

1. **Vision-Based Planning**: Identify terrain features ahead
2. **Pre-impact Adjustment**: Modify pattern before ground contact
3. **Dynamic Replanning**: Update trajectories during walking

## Implementation Strategies

### Open-Loop vs. Closed-Loop

- **Open-loop**: Fixed patterns, no real-time adjustment
- **Closed-loop**: Continuous adjustment based on feedback

### Centralized vs. Distributed

- **Centralized**: One controller for entire gait
- **Distributed**: Separate controllers for different functions

### Computational Considerations

- Real-time constraints (typically 1-10ms computation time)
- Memory limitations on robot computers
- Trade-offs between model complexity and speed

## Summary

This chapter explored various techniques for generating walking patterns in humanoid robots. Successful walking depends on combining stable pattern generation with appropriate control and adaptation to environmental conditions. In the next chapter, we'll examine how walking patterns can be adapted to different terrains and operational conditions.

## Exercises

1. Implement a simple LIPM-based walking pattern generator
2. Design a foot trajectory generator for step climbing
3. Create a walking pattern optimizer that considers energy and stability

## Further Reading

- Advanced walking control methods (MPC, DCM-based control)
- Terrain adaptation strategies for humanoid robots
- Human-inspired walking patterns