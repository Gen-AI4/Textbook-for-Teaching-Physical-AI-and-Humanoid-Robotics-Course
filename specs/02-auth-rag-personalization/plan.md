---

description: "Technical plan for Auth and RAG Implementation with BetterAuth, Hono, Drizzle ORM, and LangChain"
---

# Architecture Plan: Auth and RAG Implementation

**Feature**: 02-auth-rag-personalization  
**Created**: 2025-12-09  
**Status**: Implemented  
**Input**: specs/02-auth-and-rag.md and specs/02-auth-rag-personalization.md

## Tech Stack

### Runtime
- **Node.js**: v18+ (LTS) - Primary runtime environment
- **Hono**: v4+ - Web framework for building lightweight APIs
- **TypeScript**: v5+ - Typed JavaScript superset for better development experience

### Authentication & Authorization
- **BetterAuth**: v0.5+ - Authentication system with OAuth providers and session management
- **JWT**: For secure token-based authentication
- **Password Hashing**: Using BetterAuth's built-in security features

### Database & ORM
- **SQLite**: With better-sqlite3 driver - Local file-based database
- **Drizzle ORM**: v0.30+ - Type-safe SQL toolkit with TypeScript support
- **Database Migrations**: Using drizzle-kit for schema management

### Document Processing & RAG
- **LangChain**: v0.1+ - Framework for developing applications with LLMs
- **@langchain/openai**: OpenAI integration for embeddings and LLM calls
- **Document Loaders**: For various document formats (PDF, DOCX, TXT)
- **Text Splitters**: RecursiveCharacterTextSplitter for chunking documents
- **Vector Storage**: Currently simulated with SQLite (production would use dedicated vector DB)

### AI & LLMs
- **OpenAI API**: GPT models for generating responses
- **Embeddings**: OpenAI embeddings for document similarity and retrieval

### API & Validation
- **Zod**: v3+ - Schema validation for request/response data
- **@hono/zod-validator**: Integration between Hono and Zod
- **RESTful API Design**: Following standard HTTP conventions

### Server Deployment
- **@hono/node-server**: Production-ready Node.js server adapter
- **Environment Configuration**: Using environment variables for configuration

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Hono API       │────│  BetterAuth     │
│   (Client)      │    │   Server         │    │  Authentication │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   Drizzle ORM  │   │   LangChain     │   │  OpenAI API    │
│   (Database)   │   │   (RAG Engine)  │   │  (LLM & Embed.)│
└────────────────┘   └─────────────────┘   └────────────────┘
        │                       │
        └───────────────────────┘
                │
        ┌───────▼────────┐
        │   SQLite DB    │
        │ (User, Doc,    │
        │  Chat data)    │
        └────────────────┘
```

## File Structure

```
src/
├── index.ts                # Main Hono application with middleware
├── lib/
│   ├── auth.ts            # BetterAuth configuration
│   └── db/
│       ├── index.ts       # Database connection
│       └── schema.ts      # Drizzle schema definitions
├── routes/
│   ├── auth.ts            # Authentication endpoints
│   ├── documents.ts       # Document management endpoints
│   ├── rag.ts             # RAG processing endpoints
│   └── chat.ts            # Chat interface endpoints
└── middleware/
    └── auth-guard.ts      # Authentication middleware
```

### Key Files & Responsibilities

1. **src/index.ts** - Main application entry point, mounts all routes, applies middleware
2. **src/lib/auth.ts** - BetterAuth configuration with custom user schema
3. **src/lib/db/schema.ts** - Drizzle schema definitions for users, documents, chunks, chats, messages
4. **src/lib/db/index.ts** - Database connection and initialization
5. **src/routes/auth.ts** - Authentication and profile management endpoints
6. **src/routes/documents.ts** - Document upload, retrieve, delete endpoints
7. **src/routes/rag.ts** - Document processing, chunking, embedding, search endpoints
8. **src/routes/chat.ts** - Chat creation, message exchange with RAG context
9. **server.ts** - Production server configuration using @hono/node-server

## API Endpoints

### Authentication Routes (`/api/auth`)
- `GET|POST|PUT|DELETE /api/auth/*` - BetterAuth standard endpoints
- `GET /api/auth/profile` - Get user profile with extended fields
- `PUT /api/auth/profile` - Update user profile with onboarding fields

### Document Routes (`/api/documents`)
- `POST /api/documents/upload` - Upload documents (PDF, DOC, DOCX, TXT)
- `GET /api/documents` - List user's documents
- `DELETE /api/documents/:id` - Delete document

### RAG Routes (`/api/rag`)
- `POST /api/rag/process/:id` - Process document into chunks with embeddings
- `POST /api/rag/search` - Search for relevant chunks based on query

### Chat Routes (`/api/chat`)
- `POST /api/chat` - Create new chat
- `GET /api/chat` - List user's chats
- `GET /api/chat/:chatId/messages` - Get messages in a chat
- `POST /api/chat/:chatId/message` - Send message and get AI response

## Security Architecture

### Authentication
- **Session-based**: Using BetterAuth's secure session management
- **CSRF Protection**: Built into BetterAuth
- **Password Security**: Automatic hashing, configurable complexity
- **Email Verification**: Configurable (disabled for MVP)

### Authorization
- **Per-Route**: Auth guard middleware protecting all sensitive endpoints
- **Resource Ownership**: Users can only access their own documents/chats
- **Input Validation**: Zod schema validation for all request data

### Data Security
- **File Validation**: Strict MIME type checking for uploads
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM
- **Environment Security**: Sensitive data via environment variables

## Data Model

### Users (Extended)
- Standard BetterAuth user fields
- `onboarded`: boolean - Whether user has completed onboarding
- `username`: string (unique) - User's chosen username
- `firstName`, `lastName`: string - User's name
- `bio`: string - User's bio
- `profilePicture`: blob - Profile picture file

### Documents
- `id`: UUID - Primary key
- `userId`: string - Foreign key to user
- `name`: string - Original filename
- `type`: string - File extension
- `storageType`: string - "local", "s3", etc.
- `localPath`: string - Local file path
- `s3Key`: string - S3 object key
- `metadata`: JSON - Additional document metadata

### Chunks
- `id`: UUID - Primary key
- `documentId`: string - Foreign key to document
- `userId`: string - Foreign key to user
- `content`: string - Text content of the chunk
- `chunkIndex`: number - Order of chunk in document
- `embedding`: blob - Vector embedding of the content
- `metadata`: JSON - Additional chunk metadata

### Chats
- `id`: UUID - Primary key
- `userId`: string - Foreign key to user
- `title`: string - Chat title

### Messages
- `id`: UUID - Primary key
- `chatId`: string - Foreign key to chat
- `userId`: string - Foreign key to user
- `role`: string - "user" or "assistant"
- `content`: string - Message content

## Deployment Architecture

### Local Development
- SQLite file database
- Direct file storage on local filesystem
- Environment variables for API keys

### Production Considerations
- **Database**: Consider upgrading to PostgreSQL for production
- **File Storage**: Implement S3 or similar for document storage
- **Vector Database**: Replace SQLite with dedicated vector database (Pinecone, Supabase, etc.)
- **CDN**: For static assets and file delivery
- **Rate Limiting**: API rate limiting at application or infrastructure level

## Performance Considerations

### Database
- **Indexes**: Proper indexes on foreign keys and frequently queried fields
- **Query Optimization**: Efficient queries using Drizzle ORM
- **Connection Pooling**: SQLite's inherent single-file efficiency

### Document Processing
- **Chunking Strategy**: RecursiveCharacterTextSplitter with overlap
- **Embedding Caching**: Cache embeddings to avoid repeated API calls
- **Batch Processing**: Process multiple chunks efficiently

### API
- **Response Caching**: Cache frequently accessed data where appropriate
- **Request Validation**: Early validation to fail fast
- **Error Handling**: Consistent error responses

## Error Handling Strategy

- **HTTP Status Codes**: Standard HTTP status codes (200, 400, 401, 404, 500, etc.)
- **Error Responses**: Consistent JSON error response format
- **Logging**: Appropriate logging of errors for debugging
- **Graceful Degradation**: System continues to function if external APIs are unavailable

## Environment Variables

- `DATABASE_URL` - SQLite file path or database connection string
- `AUTH_SECRET` - BetterAuth secret key for JWT signing
- `OPENAI_API_KEY` - API key for OpenAI services
- `PORT` - Server port (defaults to 3000)
- `HOST` - Server host (defaults to 0.0.0.0)

## Testing Strategy

### Unit Tests
- Individual function and utility tests
- Database query tests
- Document processing pipeline tests

### Integration Tests
- API endpoint integration tests
- Authentication flow tests
- End-to-end RAG functionality tests

### Performance Tests
- Load testing for concurrent users
- Document processing time measurements
- API response time benchmarks

## Scalability Considerations

- **Horizontal Scaling**: Stateless API servers
- **Database Scaling**: Connection pooling, read replicas
- **File Storage Scaling**: Cloud-based storage solutions
- **Vector Search Scaling**: Dedicated vector database solutions

## Monitoring & Observability

### Logging
- Structured logging with request/response information
- Error logging with stack traces
- Performance logging for slow operations

### Metrics
- API response times
- Error rates
- Active user sessions
- Document processing times

## Risk Assessment

### High Risk
- **External API Dependencies**: OpenAI API availability and cost
- **Security**: User data privacy and authentication security
- **Performance**: Document processing can be time-intensive

### Medium Risk
- **Data Storage**: Managing large volumes of documents and embeddings
- **Scalability**: SQLite limitations at high scale

### Mitigation Strategies
- **API Reliability**: Implement proper retry logic and fallbacks
- **Security**: Regular security audits and dependency updates
- **Performance**: Asynchronous processing for document uploads
- **Database**: Plan for migration to more scalable database as needed