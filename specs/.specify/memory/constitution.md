<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.1.0
Modified principles: Accuracy Through Primary Source Verification → Enhanced with 2023+ requirement; Clarity for Advanced Academic Audience → Updated grade level; Reproducibility → Expanded to include simulation-first approach; Added Inclusivity principle; Added Zero Plagiarism principle
Added sections: Inclusivity principle, Zero Plagiarism principle, Interactivity principle, Length & Depth requirements, Detailed Content Outline, Assessments & Exercises, Success Criteria, Workflow steps
Removed sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (to align with new principles)
- ✅ .specify/templates/spec-template.md (to align with new principles)
- ✅ .specify/templates/tasks-template.md (to align with new principles)
- ⚠️  .specify/templates/commands/*.md (may need review for consistency)
Follow-up TODOs: None
-->

# Textbook for Teaching Physical AI & Humanoid Robotics Course Constitution

## Core Principles

### Accuracy Through Primary Source Verification
All technical claims must be backed by primary sources (official ROS 2 docs, NVIDIA Isaac Sim docs, peer-reviewed papers where possible). Prefer official documentation and recent sources (2023+). Cite in APA style with inline links and a references section per chapter. All claims must be verified against peer-reviewed articles, established textbooks, and official documentation. Zero plagiarism tolerance before finalization.

### Clarity for Advanced Academic Audience
Target computer science undergraduates/graduates with AI background (Flesch-Kincaid grade 10-12). Use clear, concise language, avoid jargon without explanation. Writing clarity follows Flesch–Kincaid grade 10–12 standard. Mathematical concepts and technical explanations must be presented with sufficient detail for comprehension without oversimplification.

### Reproducibility (NON-NEGOTIABLE)
Every hands-on example must be testable in simulation (Isaac Sim, Gazebo). Provide complete setup instructions, code repos links, and YAML/config files. All code examples must be testable with setup instructions provided. Simulation setups must be documented with step-by-step procedures. Claims must be cited and traceable to original sources. All experiments and implementations must be reproducible in standard environments (ROS 2 and NVIDIA Isaac Sim).

### Practical Focus With Simulation-First Approach
Emphasis on simulation-first (cloud or local RTX workstation). Include optional "Real Hardware Extension" sections for Jetson/RealSense/Unitree robots. Focus on hands-on implementation using contemporary robotics tools and frameworks. Code examples must be runnable in ROS 2 and NVIDIA Isaac Sim with proper error-handling notes. Focus on practical applications that bridge theoretical concepts with real-world implementations.

### Interactivity Through Modern Web Technologies
Use MDX for embedded code blocks (with copy buttons), tabs for OS variations (Ubuntu/Windows notes), admonitions (note/tip/warning), and simple quizzes (multiple-choice with spoilers for answers). Interactive elements use MDX for code blocks, Mermaid diagrams, and embedded examples. Content must pass reproducibility review with code running in standard environments and simulations matching described behaviors.

### Inclusivity Across Budgets and Hardware Options
Discuss hardware options for different budgets (cloud vs. on-prem, proxy robots like Unitree Go2). Content must be accessible to institutions and individuals with varying resource availability. Include cloud-native options and budget-conscious alternatives to ensure broad accessibility.

### Length & Depth Requirements
Aim for 12-15 main chapters matching the course modules/weeks. Each chapter 5,000-10,000 words, with subsections, exercises, and further reading. Content depth must be equivalent to 200–400 printed pages with detailed explanations including mathematics, code, and laboratory exercises.

### Zero Plagiarism Commitment
All content original, synthesized from sources. Minimum 30 sources required, with 50% official documentation. All factual and technical claims must be traceable to sources with APA citation format. All content must pass plagiarism checks before finalization.

## Project Structure (Docusaurus)

The textbook must be built as a Docusaurus v2 site (using MDX for interactive content), versioned for future updates, with full-text search, dark mode, responsive design, and easy navigation. The site will be deployed to GitHub Pages via GitHub Actions. All content is in Markdown/MDX files under /docs, with a logical sidebar structure. Include code snippets (Python, ROS 2, C++ where appropriate), Mermaid diagrams for architectures/flowcharts, and placeholders for images/animations (describe them clearly for later addition).

### Homepage Requirements
Engaging intro with course overview, why Physical AI matters, learning outcomes.

### Sidebar Categories
- Introduction
- Module 1: The Robotic Nervous System (ROS 2)
- Module 2: The Digital Twin (Gazebo & Unity)
- Module 3: The AI-Robot Brain (NVIDIA Isaac™)
- Module 4: Vision-Language-Action (VLA)
- Capstone Project
- Hardware & Lab Setup
- Appendices (References, Glossary, Troubleshooting)

### Features
Blog (optional for updates), Versions (for future editions), DocSearch integration.

## Detailed Content Outline

1. Introduction to Physical AI
   - Foundations of embodied intelligence
   - From digital AI to physical laws
   - Humanoid robotics landscape (Unitree, Boston Dynamics, etc.)
   - Sensor systems (LiDAR, cameras, IMUs, force/torque)
   - Why Humanoids Matter section

2-4. ROS 2 Fundamentals (Weeks 3-5)
   - Architecture, nodes, topics, services, actions
   - Python/C++ with rclpy/rclcpp
   - Packages, launch files, parameters
   - URDF for humanoids
   - Hands-on: Build a simple ROS 2 package

5-6. Robot Simulation with Gazebo
   - Setup Gazebo Sim
   - URDF/SDF formats
   - Physics, sensors simulation
   - Intro to Unity visualization

7-9. NVIDIA Isaac Platform (Weeks 8-10)
   - Isaac Sim: Photorealistic sim, synthetic data
   - Isaac ROS: VSLAM, navigation
   - Nav2 for bipedal
   - Reinforcement learning, sim-to-real

10-11. Humanoid Robot Development (Weeks 11-12)
   - Kinematics/dynamics
   - Bipedal locomotion, balance
   - Manipulation/grasping
   - Natural HRI design

12. Conversational Robotics (Week 13)
   - Integrate LLMs (GPT, Whisper for voice-to-action)
   - Natural language to ROS actions
   - Multi-modal (speech, gesture, vision)

13. Capstone: Autonomous Humanoid
   - Full project guide: Voice command → planning → navigation → vision → manipulation

14. Hardware Requirements & Lab Setup
   - Digital Twin Workstation (RTX GPU specs)
   - Edge Kit (Jetson Orin, RealSense, etc.)
   - Robot Options (Unitree Go2/G1, proxies, budget alternatives)
   - Cloud-Native Options (AWS, latency issues)

## Key Standards and Constraints

All factual and technical claims must be traceable to sources with APA citation format. Minimum 30 sources required, with 50% being official documentation and peer-reviewed articles, including authoritative references like Springer Handbook of Robotics and Introduction to Humanoid Robotics by Kajita et al. Content depth must be equivalent to 200–400 printed pages with detailed explanations including mathematics, code, and laboratory exercises. Format follows Docusaurus-based static website with MDX pages for interactivity, deployed to GitHub Pages.

Code standards require compatibility with ROS 2 and NVIDIA Isaac Sim, including setup instructions and error-handling notes. Interactive elements use MDX for code blocks, Mermaid diagrams, and embedded examples. Content must pass reproducibility review with code running in standard environments and simulations matching described behaviors.

## Assessments & Exercises

Per chapter: ROS 2 projects, simulations, perception pipelines. End-of-module quizzes and challenges. Each chapter must include practical exercises that reinforce the theoretical concepts with hands-on implementation.

## Success Criteria

- Fully functional Docusaurus site with all chapters.
- GitHub repo ready for Pages deployment.
- All code examples runnable in Isaac Sim/Gazebo.
- Comprehensive references (min 30 sources, 50% official/docs).
- Interactive and engaging for self-study or classroom use.

## Development Workflow

All development follows the Spec-Kit Plus workflow with code generated and tested via Claude Code. Content creation adheres to the writing standards specified, with regular plagiarism checks. Code examples undergo testing in the target simulation environments (NVIDIA Isaac Sim primarily, with Gazebo where relevant). Quality gates include source verification, reproducibility validation, and peer review before finalization.

The workflow includes:
1. First, generate the full Docusaurus project scaffold (package.json, docusaurus.config.js with title, tagline, GitHub link, Algolia DocSearch if possible).
2. Then, chapter-by-chapter: Output the sidebar.json update + full MDX file for each chapter.
3. Include setup guide for running locally and deploying to GitHub Pages.
4. At end, generate a PDF export script (using @docusaurus/preset-classic pdf plugin or pandoc).

## Governance

This constitution supersedes all other practices and guidelines for the project. All contributions must verify compliance with the core principles outlined above. Amendments to this constitution require formal documentation, approval from project maintainers, and a migration plan for existing content. All pull requests and reviews must verify adherence to accuracy, reproducibility, and academic rigor standards. Use this constitution as the primary guidance document for all development decisions.

**Version**: 1.1.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17