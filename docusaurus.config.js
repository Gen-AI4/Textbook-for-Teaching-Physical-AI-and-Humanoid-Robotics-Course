// @ts-check
// `@type` JSDoc annotations allow IDEs and type-checking tools to autocomplete and validate
// You can disable eslint for this file by running the following command:
// npx eslint --ext .js,.jsx,.ts,.tsx . --fix

/** @type {import('@docusaurus/types').Config} */
const isProd = process.env.NODE_ENV === 'production';
const config = {
  title: 'Textbook for Teaching Physical AI and Humanoid Robotics',
  tagline: 'A comprehensive guide to Physical AI and Humanoid Robotics',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://gen-ai4.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Gen-AI4', // Usually your GitHub org/user name.
  projectName: 'Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course', // Usually your repo name.

  onBrokenLinks: 'ignore',  // Changed from 'warn' to 'ignore' for deployment
  onBrokenAnchors: 'ignore', // Changed from 'warn' to 'ignore' for deployment
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'ignore',
    },
  },

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
            'https://github.com/Gen-AI4/Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Gen-AI4/Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: isProd
          ? {
              trackingID: 'G-XXXXXXXXXX',
              anonymizeIP: true,
            }
          : undefined,
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
            href: 'https://github.com/Gen-AI4/Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course',
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
                href: 'https://github.com/Gen-AI4/Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course',
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

  // Add plugins for OAuth integration
  plugins: [
    // Custom plugin to inject auth into the application
    async function authPlugin(context, options) {
      return {
        name: 'auth-plugin',
        // This plugin is prepared for OAuth integration but doesn't break the build
        // Actual integration would be implemented in a client-side component
        // Load client module that provides a safe noop for window.gtag during dev
        clientModules: [require.resolve('./src/client-modules/gtag-fallback.js')],
      };
    },
  ],
};

module.exports = config;