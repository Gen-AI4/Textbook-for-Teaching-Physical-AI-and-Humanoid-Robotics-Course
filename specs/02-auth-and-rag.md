# RAG Application Specification: Authentication & Document Processing

## Overview
This document specifies the implementation of the authentication and RAG (Retrieval Augmented Generation) system for the textbook application. The system uses BetterAuth for authentication, Drizzle ORM for database management, and LangChain for document processing and RAG functionality.

## Architecture

### 1. Authentication System
- **BetterAuth**: Used for authentication and user management
- **Custom Fields**: Extended user schema with onboarding fields (username, firstName, lastName, bio, profilePicture, onboarded)
- **Session Management**: Exposes session.user to Hono routes

### 2. Database Schema
- **Drizzle ORM**: Used with SQLite for database management
- **Extended User Schema**: Includes onboarding fields
- **Document Storage**: Track user-uploaded documents with metadata
- **Chunk Storage**: Store document chunks with embeddings for RAG
- **Chat Storage**: Store conversation history

### 3. API Routes
- **Hono Framework**: All API endpoints implemented with Hono
- **Authentication Middleware**: Applied to all protected routes
- **Document Management**: Upload, retrieve, and delete documents
- **RAG Processing**: Process documents into chunks with embeddings
- **Chat Interface**: Create conversations and interact with the AI

## Detailed Implementation

### 1. Database Schema (`src/lib/db/schema.ts`)
- `extendedUsers`: Extends BetterAuth users with onboarding fields
- `documents`: Stores metadata about uploaded documents
- `chunks`: Stores document chunks with embeddings
- `chats`: Stores chat conversations
- `messages`: Stores individual messages in chats

### 2. Authentication (`src/lib/auth.ts`)
- Uses BetterAuth with Drizzle adapter
- Extends user schema with custom fields
- Implements username and onboarding field plugins

### 3. API Routes
#### Authentication Routes (`src/routes/auth.ts`)
- `/api/auth`: BetterAuth API routes
- `/api/auth/profile`: Get and update user profile

#### Document Routes (`src/routes/documents.ts`)
- `/api/documents/upload`: Upload documents (PDF, DOC, DOCX, TXT)
- `/api/documents/`: List user's documents
- `/api/documents/:id`: Delete document

#### RAG Routes (`src/routes/rag.ts`)
- `/api/rag/process/:id`: Process document into chunks with embeddings
- `/api/rag/search`: Search for relevant chunks based on query

#### Chat Routes (`src/routes/chat.ts`)
- `/api/chat/`: Create new chats
- `/api/chat/`: List user's chats
- `/api/chat/:chatId/messages`: Get messages in a chat
- `/api/chat/:chatId/message`: Send message and get AI response

### 4. Main Application (`src/index.ts`)
- Hono application with logger middleware
- Authentication middleware applied to all routes
- All API routes mounted under appropriate paths

### 5. Server (`server.ts`)
- Runs the Hono application using @hono/node-server
- Configurable port via environment variable

## Security Considerations
- All non-auth routes are protected with authentication middleware
- File uploads are validated for allowed types (PDF, DOC, DOCX, TXT)
- Each user can only access their own documents and chats
- User onboarding fields are properly validated

## Technical Dependencies
- `better-auth`: Authentication system
- `drizzle-orm`: Database ORM with SQLite adapter
- `hono`: Web framework
- `@hono/zod-validator`: Request validation
- `langchain`: Document processing and RAG functionality
- `@langchain/openai`: OpenAI integration
- `openai`: OpenAI SDK

## Environment Variables
- `DATABASE_URL`: SQLite database path
- `AUTH_SECRET`: BetterAuth secret key
- `OPENAI_API_KEY`: OpenAI API key for embeddings and chat completions

## Implementation Notes
- In a production environment, actual file storage should be implemented (local disk or S3)
- For proper vector similarity search, a dedicated vector database (like Pinecone or Supabase) would be used instead of SQLite
- The RAG implementation includes context retrieval from documents when responding to user queries
- User onboarding flow is supported through the extended user schema