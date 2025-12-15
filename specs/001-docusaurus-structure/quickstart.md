# Quickstart Guide: Docusaurus Textbook

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```
   This command starts a local development server and opens the textbook in your default browser. Most changes are reflected live without restarting the server.

## Project Structure

```
my-textbook/
├── docs/                 # Textbook content (Markdown files)
│   ├── intro.md
│   ├── module-1/
│   │   ├── index.md
│   │   ├── chapter-1.md
│   │   └── ...
│   └── ...
├── src/                  # Custom React components
│   ├── components/
│   ├── pages/
│   └── css/
├── static/               # Static assets (images, files)
├── i18n/                 # Translation files
├── docusaurus.config.js  # Main configuration file
├── sidebars.js           # Sidebar navigation configuration
├── package.json          # Package dependencies and scripts
└── yarn.lock             # Locked dependency versions
```

## Adding Content

1. **Create a new markdown file** in the `docs/` directory or within a module subdirectory:
   ```bash
   # Example: Adding a new chapter to Module 1
   # Create docs/module-1/new-chapter.md
   ```

2. **Add frontmatter** to your markdown file:
   ```markdown
   ---
   title: Chapter Title
   sidebar_position: 3
   description: Brief description of the chapter content
   ---
   
   # Chapter Title
   
   Your textbook content here using standard Markdown syntax.
   ```

3. **Update the sidebar** in `sidebars.js` to include your new content:
   ```javascript
   module.exports = {
     docs: [
       {
         type: 'category',
         label: 'Module 1',
         items: [
           'module-1/index',
           'module-1/chapter-1',
           'module-1/chapter-2',
           'module-1/new-chapter',  // Add your new chapter here
         ],
       },
     ],
   };
   ```

## Multi-language Support

1. **Create translation file structure** in `i18n/`:
   ```
   i18n/
   ├── en/
   │   └── docusaurus-plugin-content-docs/
   │       └── current/
   │           ├── module-1/
   │           │   ├── index.json
   │           │   └── chapter-1.json
   │           └── ...
   └── es/  // Spanish translation
       └── ...
   ```

2. **Extract messages for translation**:
   ```bash
   npm run write-translations -- --locale en
   # This generates JSON files in i18n/en for all translatable content
   ```

3. **Add translations** to the appropriate locale directories.

## Authentication Setup (OAuth)

1. **Configure OAuth in `docusaurus.config.js`**:
   ```javascript
   module.exports = {
     // ... other config
     plugins: [
       // ... other plugins
       [
         '@docusaurus/plugin-client-redirects',
         {
           // Configuration for authentication redirects
         },
       ],
     ],
   };
   ```

2. **Implement authentication components** in `src/components/` as needed for your institutional OAuth provider.

## Building for Production

1. **Build the static files**:
   ```bash
   npm run build
   # or
   yarn build
   ```
   
   This command generates static content in the `build/` directory, which can be served using any static hosting service.

2. **Preview the build locally**:
   ```bash
   npm run serve
   # or
   yarn serve
   ```

## Deployment

The textbook can be deployed to various platforms:

- **GitHub Pages**: Use the `deploy` script in `package.json` after configuring the appropriate settings in `docusaurus.config.js`
- **Netlify/Vercel**: Connect your GitHub repository to automatically deploy on changes
- **Any static hosting service**: Upload the contents of the `build/` directory

## Useful Commands

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm run serve` - Preview the production build locally
- `npm run swizzle` - Customize/override Docusaurus components
- `npm run clear` - Clear the local Docusaurus cache
- `npm run write-translations` - Extract translatable strings
- `npm run write-heading-ids` - Generate heading IDs for linking