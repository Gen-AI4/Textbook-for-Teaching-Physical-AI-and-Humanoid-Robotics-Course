---
sidebar_position: 3
title: 'Chapter 1 - ROS 2 Fundamentals'
---

# Chapter 1 - ROS 2 Fundamentals

## Overview

The Robot Operating System 2 (ROS 2) is not an operating system in the traditional sense but rather a flexible framework for writing robotic software. It provides a collection of tools, libraries, and conventions that aim to simplify the task of creating complex and robust robotic applications.

ROS 2 is the successor to ROS 1 and addresses many of the limitations of the original system, particularly in the areas of security, real-time performance, and cross-platform support. For humanoid robotics, where multiple systems need to work together seamlessly, ROS 2 provides the communication backbone that allows sensors, actuators, controllers, and planning algorithms to interact.

## Learning Objectives

After completing this chapter, you will be able to:

- Explain the basic architecture of ROS 2
- Describe the roles of nodes, topics, and services
- Identify the main differences between ROS 1 and ROS 2
- Set up a basic ROS 2 environment

## ROS 2 Architecture

At its core, ROS 2 is designed around a distributed system architecture. Multiple processes called **nodes** communicate with each other using a publish-subscribe model for asynchronous data exchange and a request-response model for synchronous communication.

### Nodes

A **node** is an executable that uses ROS 2 to communicate with other nodes. Nodes are the fundamental building blocks of a ROS 2 system. In a humanoid robot, you might have nodes for:

- Sensor processing (camera, lidar, IMU)
- Actuator control (joint controllers)
- Path planning
- Behavior management
- User interfaces

Each node runs independently and communicates with other nodes through topics and services.

### Topics and Messages

**Topics** are named buses over which nodes exchange messages. The communication is based on a publish-subscribe pattern where publishers send messages to a topic and subscribers receive messages from a topic. This allows for asynchronous communication between nodes.

**Messages** are the data packets that flow between nodes. They have a specific structure and data types defined in `.msg` files. Common message types in humanoid robotics include:

- `sensor_msgs/JointState` - for joint positions, velocities, and efforts
- `geometry_msgs/Twist` - for velocity commands
- `std_msgs/Float64` - for single numerical values

## Practical Example

Let's look at a simple example that demonstrates the concepts we've covered:

```python
# publisher_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

This example shows a simple publisher node that sends "Hello World" messages to a topic named "topic" every 0.5 seconds.

## Summary

In this chapter, we've introduced the fundamental concepts of ROS 2 architecture. You've learned about nodes as the basic building blocks of a ROS 2 system, and how they communicate through topics using the publish-subscribe pattern.

In the next chapter, we'll dive deeper into creating ROS 2 nodes using the Python client library (rclpy) and explore more complex message types and communication patterns.

## Exercises

1. Set up a ROS 2 environment on your system
2. Create a simple publisher node that publishes a counter value
3. Create a subscriber node that receives and displays the counter values
4. Run both nodes and verify that they can communicate