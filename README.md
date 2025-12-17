# RAG Application with BetterAuth, Hono, and Drizzle ORM

This project implements a RAG (Retrieval Augmented Generation) application with authentication and document processing capabilities. It uses BetterAuth for authentication, Hono for the web framework, Drizzle ORM for database management, and LangChain for RAG functionality.

## Features

- **Authentication System**: Using BetterAuth with extended user schema
- **Document Processing**: Upload and process PDF, DOCX, and TXT files
- **RAG Functionality**: Query documents with AI-powered responses
- **Chat Interface**: Interactive chat with document context
- **User Profiles**: Extended user profiles with onboarding fields

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Web framework
- **Authentication**: [BetterAuth](https://better-auth.com/) - Authentication library
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/) - Database management
- **AI/LLM**: [LangChain](https://js.langchain.com/) and [OpenAI](https://openai.com/) - For document processing and responses
- **Validation**: [Zod](https://zod.dev/) - Schema validation

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables by creating a `.env` file:
```env
DATABASE_URL=./sqlite.db
AUTH_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

3. Run database migrations:
```bash
npm run db:generate
npm run db:migrate
```

## Running the Application

To run in development mode:
```bash
npm run dev
```

To build and run in production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `GET|POST|PUT|DELETE /api/auth/*` - BetterAuth standard endpoints
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Document Management
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - List user's documents
- `DELETE /api/documents/:id` - Delete document

### RAG Processing
- `POST /api/rag/process/:id` - Process document into chunks with embeddings
- `POST /api/rag/search` - Search for relevant chunks based on query

### Chat Interface
- `POST /api/chat` - Create new chat
- `GET /api/chat` - List user's chats
- `GET /api/chat/:chatId/messages` - Get messages in a chat
- `POST /api/chat/:chatId/message` - Send message and get AI response

## Project Structure

```
src/
├── index.ts                # Main application
├── lib/
│   ├── auth.ts            # BetterAuth configuration
│   └── db/
│       ├── index.ts       # Database connection
│       └── schema.ts      # Database schema
├── routes/
│   ├── auth.ts            # Authentication routes
│   ├── documents.ts       # Document management routes
│   ├── rag.ts             # RAG processing routes
│   └── chat.ts            # Chat interface routes
└── middleware/
    └── auth-guard.ts      # Authentication middleware
```

## Database Schema

The application uses SQLite with the following tables:

- `users` - Extended user information with onboarding fields
- `documents` - Document metadata
- `chunks` - Processed document chunks with embeddings
- `chats` - Chat conversation metadata
- `messages` - Individual messages in chats

## Development

This project follows a modular architecture with clear separation of concerns:

- **Authentication**: Handle authentication with BetterAuth
- **Database**: Use Drizzle ORM for type-safe database operations
- **API**: Implement RESTful endpoints with Hono
- **RAG**: Process documents and generate AI responses with LangChain
- **Security**: Apply authentication and validation middleware

## Environment Variables

- `DATABASE_URL` - Path to SQLite database file
- `AUTH_SECRET` - Secret key for authentication
- `OPENAI_API_KEY` - API key for OpenAI services
- `PORT` - Server port (default: 3000)

## License

MIT

## Deploy on Vercel

The easiest way to deploy this application is to use the Vercel Platform from the creators of Next.js. Follow these steps:

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign up or sign in
3. Click "New Project" and import your repository
4. Configure your project with these settings:
   - Framework Preset: `Other` (since this is a Docusaurus/Hono hybrid)
   - Build Command: `npm run vercel:build`
   - Output Directory: `build`
   - Install Command: `npm install`

Your application will be deployed to a URL similar to `https://your-project-name.vercel.app`