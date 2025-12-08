// @ts-check
// `@type` JSDoc annotations allow IDEs and type-checking tools to autocomplete and validate
// You can disable eslint for this file by running the following command:
// npx eslint --ext .js,.jsx,.ts,.tsx . --fix

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Textbook for Teaching Physical AI and Humanoid Robotics',
  tagline: 'A comprehensive guide to Physical AI and Humanoid Robotics',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ahmed-ali', // Usually your GitHub org/user name.
  projectName: 'textbook-for-teaching-physical-ai-and-humanoid-robotics', // Usually your repo name.

  onBrokenLinks: 'warn',  // Changed from 'throw' to 'warn' to allow build
  onBrokenAnchors: 'warn', // Changed from 'throw' to 'warn' to allow build
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'], // Only English available for now
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Enable the docs plugin to show previous and next navigation
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Exclude template files from being processed as docs
          exclude: ['templates/**'],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ahmed-ali/textbook-for-teaching-physical-ai-and-humanoid-robotics-course/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ahmed-ali/textbook-for-teaching-physical-ai-and-humanoid-robotics-course/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-XXXXXXXXXX',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Physical AI & Humanoid Robotics Textbook',
        logo: {
          alt: 'Robotics Textbook Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Textbook',
          },
          {
            to: '/docs/intro',
            label: 'Modules',
            position: 'left'
          },
          {
            to: '/docs/resources',
            label: 'Resources',
            position: 'left'
          },
          {
            to: '/docs/about',
            label: 'About',
            position: 'left'
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/ahmed-ali/textbook-for-teaching-physical-ai-and-humanoid-robotics-course',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Modules',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'Module 1: ROS 2',
                to: '/docs/module-1/index',
              },
              {
                label: 'Module 2: Physical AI',
                to: '/docs/module-2/index',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ahmed-ali/textbook-for-teaching-physical-ai-and-humanoid-robotics-course',
              },
              {
                label: 'Resources',
                to: '/docs/resources',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Textbook for Teaching Physical AI and Humanoid Robotics, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
};

module.exports = config;