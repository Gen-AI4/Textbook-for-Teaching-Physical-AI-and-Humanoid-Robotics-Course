---
sidebar_position: 5
title: 'Chapter 3 - Robot Description with URDF'
---

# Chapter 3 - Robot Description with URDF

## Overview

The Unified Robot Description Format (URDF) is an XML-based format used to describe robot models in ROS. For humanoid robots, which have complex kinematic structures with many degrees of freedom, URDF is essential for defining the robot's physical properties, joint constraints, and visual appearance. This description is used by simulation environments like Gazebo and visualization tools like RViz to accurately represent the robot.

URDF enables the same robot description to be used across different systems - from simulation to control algorithms to visualization. For humanoid robots, this is particularly important as they often require precise modeling of their kinematic chains, collision properties, and visual appearance.

## Learning Objectives

After completing this chapter, you will be able to:

- Create a basic URDF model for a humanoid robot
- Define links and joints in URDF
- Set physical properties like mass, inertia, and visual/collision properties
- Use URDF macros and xacro for more complex models
- Validate URDF models and troubleshoot common issues

## URDF Basics

URDF (Unified Robot Description Format) is an XML format that describes robot models. A URDF model consists of:

- **Links**: Rigid bodies in the robot, like limbs, torso, or head
- **Joints**: Connections between links, defining degrees of freedom and constraints
- **Visual**: How the link looks in visualization (shape, color, mesh)
- **Collision**: How the link interacts with the environment in simulation
- **Inertial**: Physical properties like mass and moment of inertia

## Basic URDF Structure

Here's a simple URDF for a basic humanoid robot with a torso and two limbs:

```xml
<?xml version="1.0"?>
<robot name="simple_humanoid">
  <!-- Base torso link -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
      <material name="grey">
        <color rgba="0.5 0.5 0.5 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Right hip joint and leg -->
  <joint name="right_hip_joint" type="revolute">
    <parent link="torso"/>
    <child link="right_thigh"/>
    <origin xyz="-0.1 -0.1 -0.25" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="3.0"/>
  </joint>

  <link name="right_thigh">
    <visual>
      <geometry>
        <cylinder length="0.4" radius="0.05"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.4" radius="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <inertia ixx="0.05" ixy="0" ixz="0" iyy="0.05" iyz="0" izz="0.001"/>
    </inertial>
  </link>
</robot>
```

## Common Joint Types in Humanoid Robots

Humanoid robots require various joint types to achieve human-like movement:

- **Revolute**: Rotational joint with limited range (like an elbow)
- **Continuous**: Rotational joint without limits (like a continuous rotation servo)
- **Prismatic**: Linear sliding joint (less common in humanoid robots)
- **Fixed**: No movement (for attaching sensors or decorative elements)

For a humanoid robot, most joints are revolute to allow for precise control of limb positions.

## Using Xacro for Complex Models

For complex humanoid robots with many similar components, Xacro (XML Macros) helps reduce redundancy:

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="humanoid_with_xacro">
  
  <!-- Define a macro for a leg segment -->
  <xacro:macro name="leg_segment" params="name parent xyz">
    <joint name="${name}_joint" type="revolute">
      <parent link="${parent}"/>
      <child link="${name}_link"/>
      <origin xyz="${xyz}" rpy="0 0 0"/>
      <axis xyz="1 0 0"/>
      <limit lower="-1.57" upper="1.57" effort="100" velocity="3.0"/>
    </joint>

    <link name="${name}_link">
      <visual>
        <geometry>
          <cylinder length="0.4" radius="0.05"/>
        </geometry>
        <material name="blue">
          <color rgba="0 0 1 1"/>
        </material>
      </visual>
      <collision>
        <geometry>
          <cylinder length="0.4" radius="0.05"/>
        </geometry>
      </collision>
      <inertial>
        <mass value="2.0"/>
        <inertia ixx="0.05" ixy="0" ixz="0" iyy="0.05" iyz="0" izz="0.001"/>
      </inertial>
    </link>
  </xacro:macro>

  <!-- Use the macro to create both legs -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
      <material name="grey">
        <color rgba="0.5 0.5 0.5 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <xacro:leg_segment name="right_leg" parent="torso" xyz="-0.1 -0.1 -0.25"/>
  <xacro:leg_segment name="left_leg" parent="torso" xyz="-0.1 0.1 -0.25"/>

</robot>
```

## Advanced URDF Features for Humanoid Robots

### Transmission Elements
For actual robot control, you need to define how actuators connect to joints:

```xml
<transmission name="right_hip_transmission">
  <type>transmission_interface/SimpleTransmission</type>
  <joint name="right_hip_joint">
    <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
  </joint>
  <actuator name="right_hip_motor">
    <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
    <mechanicalReduction>1</mechanicalReduction>
  </actuator>
</transmission>
```

### Gazebo-Specific Elements
To make the robot work properly in simulation, add Gazebo-specific elements:

```xml
<gazebo reference="torso">
  <material>Gazebo/Grey</material>
  <mu1>0.2</mu1>
  <mu2>0.2</mu2>
</gazebo>
```

## Validating URDF Models

Before using a URDF in simulation or with real hardware, validate it:

```bash
# Use check_urdf to validate the syntax
check_urdf /path/to/your/robot.urdf

# Use xacro to preprocess xacro files
xacro input_file.xacro > output_file.urdf
```

## Integration with ROS 2

To use your URDF in ROS 2 applications:

1. Store the URDF file in your package's `urdf/` directory
2. Use a launch file to publish the robot description:
   ```xml
   <launch>
     <param name="robot_description" value="$(find-pkg-share your_robot_description)/urdf/robot.urdf"/>
     <node pkg="robot_state_publisher" exec="robot_state_publisher"/>
   </launch>
   ```

## Troubleshooting Common URDF Issues

- **Missing parent links**: Ensure all joints reference existing parent links
- **Inconsistent units**: Use meters for length, kilograms for mass
- **Invalid inertial properties**: Inertia matrix must be positive definite
- **Joint limits**: Make sure joint limits are physically achievable

## Summary

In this chapter, we've covered the fundamentals of URDF for humanoid robot descriptions. You've learned how to define links and joints, set physical properties, and use Xacro to create complex models efficiently. URDF is crucial for humanoid robotics as it allows the same model to be used across simulation, visualization, and control systems.

In the next chapter, we'll explore how to integrate ROS 2 with simulation environments like Gazebo, where our URDF models come to life.

## Exercises

1. Create a complete URDF model for a simple 6-DOF humanoid arm
2. Use Xacro to create a parameterized humanoid leg that can be reused
3. Add Gazebo-specific elements to your URDF for simulation
4. Create a ROS 2 launch file that loads and publishes your URDF