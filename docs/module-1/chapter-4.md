---
sidebar_position: 6
title: 'Chapter 4 - ROS 2 in Simulation'
---

# Chapter 4 - ROS 2 in Simulation

## Overview

Simulation is a critical component of humanoid robotics development, allowing for safe, reproducible testing of complex behaviors before deployment to real hardware. Gazebo (now Ignition Gazebo) is the primary simulation environment used with ROS 2 for humanoid robotics. This chapter covers how to connect ROS 2 nodes with simulation environments, enabling the testing of humanoid robot behaviors in a virtual world.

Simulation-first development is essential for humanoid robotics where hardware damage can be costly and safety is paramount. The combination of ROS 2 and Gazebo provides a powerful platform for developing, testing, and validating humanoid robot algorithms before moving to real hardware.

## Learning Objectives

After completing this chapter, you will be able to:

- Set up a Gazebo simulation environment for humanoid robots
- Load URDF models into Gazebo using ROS 2
- Control simulated humanoid robots using ROS 2 nodes
- Interface with simulated sensors and actuators
- Implement simulation-to-reality transfer techniques

## Setting Up Gazebo with ROS 2

Gazebo provides a physics engine, rendering capabilities, and sensor simulation that work seamlessly with ROS 2. The `gazebo_ros2_control` package bridges the gap between Gazebo and ROS 2 control systems.

### Installing Gazebo

First, make sure you have Gazebo installed alongside ROS 2:

```bash
sudo apt install ros-humble-ignition-gazebo ros-humble-gazebo-ros-pkgs ros-humble-gazebo-ros2-control
```

### Basic Launch File

A basic launch file to start Gazebo with your humanoid robot:

```python
# launch/sim_robot.launch.py
import os
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node
from launch.actions import ExecuteProcess
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    # Get the package share directory
    pkg_name = 'your_robot_description'  # Replace with your package name
    share_dir = get_package_share_directory(pkg_name)
    
    # Define path to URDF file
    urdf_path = os.path.join(share_dir, 'urdf', 'robot.urdf')
    
    # Robot State Publisher node
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        name='robot_state_publisher',
        parameters=[{'robot_description': open(urdf_path).read()}]
    )
    
    # Spawn entity in Gazebo
    spawn_entity = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-topic', 'robot_description',
            '-entity', 'humanoid_robot'
        ],
        output='screen'
    )
    
    # Launch Gazebo
    gazebo = ExecuteProcess(
        cmd=['gz', 'sim', '-r', 'empty.sdf'],
        output='screen'
    )
    
    return LaunchDescription([
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='true',
            description='Use simulation clock if true'),
        gazebo,
        robot_state_publisher,
        spawn_entity
    ])
```

## Connecting URDF to Gazebo

To make your URDF work in simulation, you need to add Gazebo-specific tags. Here's an example adding to your URDF:

```xml
<!-- Add Gazebo-specific elements to your URDF -->
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

<!-- Gazebo-specific properties for this link -->
<gazebo reference="right_thigh">
  <material>Gazebo/Blue</material>
  <mu1>0.2</mu1>
  <mu2>0.2</mu2>
</gazebo>
```

## Controller Setup for Simulation

To control joints in simulation, you need to set up ros2_control:

```xml
<!-- Add ros2_control interface to your URDF -->
<ros2_control name="GazeboSystem" type="system">
  <hardware>
    <plugin>gazebo_ros2_control/GazeboSystem</plugin>
  </hardware>
  <joint name="right_hip_joint">
    <command_interface name="position">
      <param name="min">-1.57</param>
      <param name="max">1.57</param>
    </command_interface>
    <state_interface name="position"/>
    <state_interface name="velocity"/>
  </joint>
  <!-- Add other joints similarly -->
</ros2_control>
```

## Control Architecture

The control architecture typically includes:

1. **High-level controllers**: Trajectory planners, walking pattern generators
2. **Mid-level controllers**: Inverse kinematics, balance controllers
3. **Low-level controllers**: Joint position/velocity controllers

Here's an example of a simple trajectory follower:

```python
# trajectory_follower.py
import rclpy
from rclpy.node import Node
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from builtin_interfaces.msg import Duration

class TrajectoryFollower(Node):

    def __init__(self):
        super().__init__('trajectory_follower')
        
        # Publisher for joint trajectory commands
        self.traj_pub = self.create_publisher(
            JointTrajectory, 
            '/joint_trajectory_controller/joint_trajectory', 
            10
        )
        
        # Timer to periodically send trajectory commands
        self.timer = self.create_timer(2.0, self.send_trajectory)
        
        # Joint names for the humanoid (adjust according to your robot)
        self.joint_names = [
            'left_hip_joint', 'left_knee_joint', 'left_ankle_joint',
            'right_hip_joint', 'right_knee_joint', 'right_ankle_joint',
            'left_shoulder_joint', 'left_elbow_joint',
            'right_shoulder_joint', 'right_elbow_joint'
        ]
        
        self.trajectory_step = 0

    def send_trajectory(self):
        # Create a trajectory message
        traj_msg = JointTrajectory()
        traj_msg.joint_names = self.joint_names
        
        # Create trajectory point
        point = JointTrajectoryPoint()
        
        # Alternate between two sets of positions
        if self.trajectory_step % 2 == 0:
            positions = [0.1, 0.0, -0.1] * 3 + [0.2, -0.1] * 2  # Standing position
        else:
            positions = [0.2, 0.1, -0.2] * 3 + [0.3, -0.2] * 2  # Different position
        
        point.positions = positions
        point.time_from_start = Duration(sec=1)  # 1 second to reach the position
        
        traj_msg.points = [point]
        self.traj_pub.publish(traj_msg)
        
        self.get_logger().info(f'Sent trajectory with positions: {positions}')
        self.trajectory_step += 1

def main(args=None):
    rclpy.init(args=args)
    trajectory_follower = TrajectoryFollower()
    
    try:
        rclpy.spin(trajectory_follower)
    except KeyboardInterrupt:
        pass
    
    trajectory_follower.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Sensor Integration

Simulated sensors are crucial for humanoid robot development. Here's how to add and use a camera sensor:

1. Add the sensor to your URDF:

```xml
<gazebo reference="head">
  <sensor name="camera" type="camera">
    <pose>0.1 0 0 0 0 0</pose>
    <camera>
      <horizontal_fov>1.089</horizontal_fov>
      <image>
        <width>640</width>
        <height>480</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.1</near>
        <far>100</far>
      </clip>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <frame_name>head_camera_optical_frame</frame_name>
      <min_depth>0.1</min_depth>
      <max_depth>100</max_depth>
    </plugin>
  </sensor>
</gazebo>
```

2. Process sensor data in ROS 2:

```python
# sensor_processor.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2

class SensorProcessor(Node):

    def __init__(self):
        super().__init__('sensor_processor')
        self.subscription = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10)
        self.subscription  # prevent unused variable warning
        
        self.cv_bridge = CvBridge()

    def image_callback(self, msg):
        # Convert ROS Image message to OpenCV image
        try:
            cv_image = self.cv_bridge.imgmsg_to_cv2(msg, "bgr8")
        except Exception as e:
            self.get_logger().error(f'Could not convert image: {e}')
            return

        # Process the image (example: detect edges)
        gray_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray_image, 50, 150)

        # Show the processed image
        cv2.imshow("Processed Image", edges)
        cv2.waitKey(1)

def main(args=None):
    rclpy.init(args=args)
    sensor_processor = SensorProcessor()
    
    try:
        rclpy.spin(sensor_processor)
    except KeyboardInterrupt:
        pass
    
    sensor_processor.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Simulation-to-Reality Transfer

The "Sim-to-Real" gap is a significant challenge in humanoid robotics. Techniques to reduce this gap include:

1. **Domain Randomization**: Adding randomization to simulation parameters
2. **System Identification**: Measuring actual robot parameters to match simulation
3. **Adaptive Control**: Controllers that adapt to differences between sim and real

## Best Practices for Simulation

1. **Model Validation**: Regularly compare simulation behavior with real robot behavior
2. **Physics Parameters**: Carefully tune friction, damping, and other physical parameters
3. **Sensor Noise**: Add realistic noise models to simulated sensors
4. **Realistic Environments**: Use complex environments to test robustness

## Testing Humanoid Behaviors

Simulation allows for extensive testing of humanoid behaviors:

- Walking patterns
- Balance control
- Object manipulation
- Human-robot interaction
- Failure recovery

## Summary

In this chapter, we've explored how to integrate ROS 2 with Gazebo simulation for humanoid robotics. You've learned to set up simulation environments, connect URDF models, implement control systems, and integrate sensor data. Simulation is an invaluable tool for humanoid robotics, allowing for safe and reproducible testing of complex behaviors.

In the next module, we'll explore advanced topics like perception systems and locomotion for humanoid robots.

## Exercises

1. Create a complete launch file that starts Gazebo with your humanoid model
2. Implement a simple walking pattern for your simulated humanoid robot
3. Add a force-torque sensor to a joint and process the data in ROS 2
4. Implement a simple balance controller that maintains the robot's upright position