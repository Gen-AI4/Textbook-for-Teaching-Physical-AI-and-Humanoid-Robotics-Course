---
sidebar_position: 4
title: 'Chapter 2 - Python Integration with ROS 2'
---

# Chapter 2 - Python Integration with ROS 2

## Overview

Python is one of the most popular languages in robotics, and ROS 2 provides excellent Python support through the `rclpy` client library. This chapter will guide you through creating ROS 2 nodes using Python, which is particularly useful for humanoid robotics applications where rapid prototyping and algorithm development are important.

Python's simplicity and extensive ecosystem make it ideal for robotics applications, from low-level sensor processing to high-level planning algorithms. In humanoid robotics, Python is often used for perception systems, planning algorithms, and human-robot interfaces.

## Learning Objectives

After completing this chapter, you will be able to:

- Set up a Python environment for ROS 2 development
- Create publisher and subscriber nodes using rclpy
- Implement service servers and clients in Python
- Use ROS 2 parameters in Python nodes
- Handle ROS 2 logging in Python applications

## Setting Up Python with ROS 2

Before writing ROS 2 nodes in Python, ensure you have ROS 2 properly installed and sourced in your environment:

```bash
source /opt/ros/humble/setup.bash  # or your specific ROS 2 distribution
```

ROS 2 nodes written in Python use the `rclpy` library, which is the Python client library for ROS 2. This library provides the same functionality as the C++ client library (`rclcpp`) but with Python syntax and idioms.

## Creating a Publisher Node in Python

Let's implement a publisher node that publishes joint positions for a humanoid robot:

```python
# joint_publisher.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
from std_msgs.msg import Header
import math
import random

class JointStatePublisher(Node):

    def __init__(self):
        super().__init__('joint_state_publisher')
        
        # Create publisher for joint states
        self.publisher_ = self.create_publisher(JointState, 'joint_states', 10)
        
        # Timer to publish messages at regular intervals
        timer_period = 0.1  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        
        # Initialize joint names for a simple humanoid model
        self.joint_names = [
            'left_hip_joint', 'left_knee_joint', 'left_ankle_joint',
            'right_hip_joint', 'right_knee_joint', 'right_ankle_joint',
            'left_shoulder_joint', 'left_elbow_joint',
            'right_shoulder_joint', 'right_elbow_joint'
        ]
        
        self.i = 0

    def timer_callback(self):
        msg = JointState()
        msg.header = Header()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.name = self.joint_names
        msg.position = []
        
        # Generate some sample joint positions (in radians)
        for name in self.joint_names:
            # Create oscillating motion for demonstration
            position = math.sin(self.i * 0.05) * 0.5
            # Add some variation based on joint type
            if 'hip' in name:
                position *= 0.7
            elif 'elbow' in name:
                position *= 0.3
            msg.position.append(position)
        
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing joint states: {self.i}')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    joint_state_publisher = JointStatePublisher()
    
    try:
        rclpy.spin(joint_state_publisher)
    except KeyboardInterrupt:
        pass
    
    joint_state_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Creating a Subscriber Node in Python

Now let's create a subscriber node that receives and processes the joint states:

```python
# joint_subscriber.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class JointStateSubscriber(Node):

    def __init__(self):
        super().__init__('joint_state_subscriber')
        self.subscription = self.create_subscription(
            JointState,
            'joint_states',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        # Process the joint state message
        self.get_logger().info(f'Received joint states for {len(msg.name)} joints')
        
        # Example: Calculate a simple metric (mean absolute position)
        if msg.position:
            mean_abs_position = sum(abs(pos) for pos in msg.position) / len(msg.position)
            self.get_logger().info(f'Mean absolute joint position: {mean_abs_position:.3f}')

def main(args=None):
    rclpy.init(args=args)
    joint_state_subscriber = JointStateSubscriber()
    
    try:
        rclpy.spin(joint_state_subscriber)
    except KeyboardInterrupt:
        pass
    
    joint_state_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Implementing Services in Python

Services provide synchronous request-response communication, which is useful for humanoid robotics applications where you need to request specific actions or information:

```python
# motor_service.py - Service server example
import rclpy
from rclpy.node import Node
from example_interfaces.srv import SetBool  # Generic service for enabling/disabling

class MotorService(Node):

    def __init__(self):
        super().__init__('motor_service')
        self.srv = self.create_service(
            SetBool, 
            'enable_motors', 
            self.enable_motors_callback
        )
        self.motors_enabled = False

    def enable_motors_callback(self, request, response):
        self.motors_enabled = request.data
        response.success = True
        
        if self.motors_enabled:
            response.message = 'Motors enabled successfully'
            self.get_logger().info('Motors enabled')
        else:
            response.message = 'Motors disabled successfully'
            self.get_logger().info('Motors disabled')
            
        return response

def main(args=None):
    rclpy.init(args=args)
    motor_service = MotorService()
    
    try:
        rclpy.spin(motor_service)
    except KeyboardInterrupt:
        pass
    
    motor_service.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Parameters in Python Nodes

ROS 2 allows you to configure nodes using parameters, which is essential for humanoid robots that need different configurations for different tasks:

```python
# parameterized_controller.py
import rclpy
from rclpy.node import Node
from rcl_interfaces.msg import ParameterType

class ParameterizedController(Node):

    def __init__(self):
        super().__init__('parameterized_controller')
        
        # Declare parameters with default values
        self.declare_parameter('control_frequency', 100)  # Hz
        self.declare_parameter('kp', 10.0)  # Proportional gain
        self.declare_parameter('max_velocity', 1.0)  # rad/s
        self.declare_parameter('robot_name', 'my_humanoid_robot')
        
        # Get parameter values
        self.frequency = self.get_parameter('control_frequency').value
        self.kp = self.get_parameter('kp').value
        self.max_velocity = self.get_parameter('max_velocity').value
        self.robot_name = self.get_parameter('robot_name').value
        
        self.get_logger().info(
            f'Controller initialized for {self.robot_name} with frequency {self.frequency}Hz, '
            f'kp={self.kp}, max_velocity={self.max_velocity}'
        )

def main(args=None):
    rclpy.init(args=args)
    controller = ParameterizedController()
    
    # This would typically run a control loop
    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        pass
    
    controller.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Running Python Nodes

To run these Python nodes:

1. Make sure your Python files are executable:
   ```bash
   chmod +x joint_publisher.py joint_subscriber.py
   ```

2. Source your ROS 2 environment:
   ```bash
   source /opt/ros/humble/setup.bash
   ```

3. Run the nodes:
   ```bash
   python3 joint_publisher.py
   python3 joint_subscriber.py
   ```

## Best Practices for Python in ROS 2

1. **Error Handling**: Always include proper error handling, especially for hardware interfaces:
   ```python
   try:
       # hardware interface code
   except Exception as e:
       self.get_logger().error(f'Hardware error: {e}')
   ```

2. **Resource Management**: Properly clean up resources in the node's destructor.

3. **Threading**: Be careful with threading since Python's GIL can affect performance in compute-intensive applications.

4. **Performance**: For performance-critical applications in humanoid robots, consider using C++ or profiling Python code to identify bottlenecks.

## Summary

In this chapter, we've explored how to use Python with ROS 2 for humanoid robotics applications. You've learned to create publisher and subscriber nodes, implement services, and handle parameters. Python's simplicity makes it ideal for rapid prototyping and higher-level robot behaviors.

In the next chapter, we'll look at describing robot models using URDF (Unified Robot Description Format), which is essential for humanoid robotics simulation and control.

## Exercises

1. Create a Python node that publishes a Twist message for base movement commands
2. Implement a service client that calls the motor enable service
3. Create a parameterized node for controlling a humanoid robot's walking gait
4. Implement a Python action server for complex humanoid robot behaviors