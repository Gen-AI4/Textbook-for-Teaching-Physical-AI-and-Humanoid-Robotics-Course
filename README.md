# Textbook for Teaching Physical AI and Humanoid Robotics

This project implements a comprehensive textbook and course materials for teaching Physical AI and Humanoid Robotics. It uses Docusaurus to create a modern, interactive documentation site with modules on ROS 2, Physical AI, and related topics.

## Features

- **Modular Content Structure**: Organized content by modules covering different aspects of Physical AI and Humanoid Robotics
- **Interactive Documentation**: Clean, accessible interface for learning complex robotics concepts
- **Resource Integration**: Links to external resources, papers, and tools for deeper learning
- **Responsive Design**: Works well on desktop and mobile devices

## Tech Stack

- **Framework**: [Docusaurus](https://docusaurus.io/) - Static site generator optimized for documentation
- **Deployment**: GitHub Pages - Free hosting for documentation sites
- **Version Control**: Git and GitHub - Collaborative development and version history

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the site in your browser.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the static site for production
- `npm run serve` - Serves the built site locally
- `npm run deploy` - Deploys to GitHub Pages (if configured)

## Project Structure

```
.
├── docs/                   # Documentation content
│   ├── intro.md           # Introduction to the textbook
│   ├── resources.md       # Additional resources
│   ├── about.md           # About the textbook
│   └── module-*           # Module-specific documentation
├── src/
│   ├── css/
│   │   └── custom.css     # Custom styles
│   └── pages/             # Additional static pages
├── static/                # Static assets like images, logos
├── docusaurus.config.js   # Site configuration
├── sidebars.js            # Sidebar navigation configuration
└── package.json           # Project dependencies and scripts
```

## Development

This project follows Docusaurus conventions for documentation sites. New pages can be created as MDX files in the `docs` directory, and navigation can be updated in `sidebars.js`.

## License

MIT

## Deployment Instructions

### Automated Deployment via GitHub Actions (Recommended)

The project is configured with a GitHub Actions workflow that will automatically deploy your site to GitHub Pages when you push to the main branch. The workflow is located at `.github/workflows/deploy.yml`.

### Manual Deployment

If you prefer to deploy manually, follow these steps:

1. Build your site:
```bash
npm run build
```

2. The static files will be generated in the `build/` directory. To deploy to GitHub Pages:
   - For user/organization sites: push the contents of `build/` to the `main` branch of your user/organization repository
   - For project sites: push the contents of `build/` to the `gh-pages` branch of your project repository

3. To deploy using the Docusaurus CLI:
```bash
GIT_USER=<Your GitHub username> npm run deploy
```

### Configuration Notes

The site is configured in `docusaurus.config.js` with the appropriate settings for GitHub Pages deployment:
- `baseUrl` is set to `/Textbook-for-Teaching-Physical-AI-and-Humanoid-Robotics-Course/`
- `url` is set to `https://gen-ai4.github.io`
- GitHub organization and project names are properly configured