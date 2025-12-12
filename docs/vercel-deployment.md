# Vercel Deployment Configuration

This document outlines the changes made to deploy the hybrid Docusaurus/Node.js application on Vercel.

## Files Modified/Added

### 1. `vercel.json` (Completely Rewritten)
- Changed from static build-only to a hybrid approach
- Uses both `@vercel/static-build` and `@vercel/node` builders
- First builds the Docusaurus site using `npm run build` 
- Then deploys the Node.js server that serves both static files and API routes
- Properly handles CORS headers for API routes

### 2. `vercel-server.ts` (New File)
- Dedicated server file for Vercel deployments
- Imports the application logic from `vercel-api.ts`
- Uses proper Hono framework to serve both static content and API routes
- Includes proper error handling for Vercel's serverless environment

### 3. `vercel-api.ts` (New File)
- Contains the main application logic with routes
- Includes all API routes (auth, documents, rag, chat)
- Serves static files from the Docusaurus build directory
- Implements auth middleware for protected routes

### 4. `package.json` (Updated)
- Added `vercel:build` script for deployment
- Updated the build process for Vercel compatibility

### 5. `docusaurus.config.js` (Updated)
- Updated production URL to Vercel deployment URL

## Architecture Overview

The application uses a hybrid approach:

1. **Build Phase**: Vercel runs `npm run build` to generate the Docusaurus static site
2. **Runtime Phase**: Node.js server handles both:
   - Static file serving (Docusaurus pages)
   - Dynamic API routes (Hono endpoints)

## API Routes

All API routes are prefixed with `/api/`:
- `/api/auth/*` - Authentication endpoints
- `/api/documents/*` - Document management endpoints
- `/api/rag/*` - RAG functionality endpoints
- `/api/chat/*` - Chat functionality endpoints

## Static Content

All other routes serve static Docusaurus content from the `build/` directory.

## CORS Configuration

CORS headers are configured to allow:
- Origin: *
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

## Deployment Process

1. Push changes to the repository
2. Vercel automatically detects the configuration
3. Runs the build command to generate Docusaurus site
4. Deploys the Node.js server with access to the build output
5. Routes requests appropriately based on URL patterns