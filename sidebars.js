// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        'intro',
        {
          type: 'category',
          label: 'Module 1: The Robotic Nervous System (ROS 2)',
          items: [
            'module-1/index',
            'module-1/chapter-1',
            'module-1/chapter-2',
            'module-1/chapter-3',
            'module-1/chapter-4',
          ],
        },
        {
          type: 'category',
          label: 'Module 2: Physical AI Concepts',
          items: [
            'module-2/index',
            'module-2/chapter-1',
            'module-2/chapter-2',
            'module-2/chapter-3',
            'module-2/chapter-4',
          ],
        },
        {
          type: 'category',
          label: 'Module 3: Locomotion and Balance',
          items: [
            'module-3/index',
            'module-3/chapter-1',
            'module-3/chapter-2',
            'module-3/chapter-3',
            'module-3/chapter-4',
          ],
        },
        {
          type: 'category',
          label: 'Module 4: Human-Robot Interaction',
          items: [
            'module-4/index',
            'module-4/chapter-1',
            'module-4/chapter-2',
            'module-4/chapter-3',
            'module-4/chapter-4',
          ],
        },
        {
          type: 'category',
          label: 'Guides',
          items: [
            'guides/markdown-guide',
            'sample-chapter',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;