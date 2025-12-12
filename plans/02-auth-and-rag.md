# Implementation Plan: Authentication & RAG System

## Overview
This document outlines the implementation plan for adding authentication and Retrieval-Augmented Generation (RAG) capabilities to the textbook platform. The implementation will use BetterAuth for authentication, Qdrant for vector storage, and integrate with the existing Hono backend and Docusaurus frontend.

## Technical Context
- **Backend Framework**: Hono (TypeScript) with existing routes for auth, documents, rag, and chat
- **Authentication**: BetterAuth with custom user schema (username, firstName, lastName, bio, profilePicture, onboarded)
- **Database**: SQLite with Drizzle ORM and schema including users, documents, chunks, chats, and messages
- **Vector Store**: Qdrant for document embeddings
- **Frontend**: Docusaurus with existing navigation and documentation structure
- **Language Model**: OpenAI API via LangChain
- **Document Processing**: Support for PDF, DOCX, TXT formats

## Phase 1: BetterAuth Integration
### Objectives
- Complete the integration of BetterAuth with custom user fields
- Implement user onboarding flow
- Ensure all authentication flows work properly with existing Hono middleware

### Tasks
1. Verify current BetterAuth setup with custom user schema (extendedUsers with onboarded, username, firstName, lastName, bio, profilePicture)
2. Test signup/login/logout flows with extended user fields
3. Implement onboarding flow to collect additional user information after first login
4. Create API endpoints for user profile management (update, retrieve)
5. Verify session management and authorization middleware
6. Add auth guards to protect document and chat endpoints

### Acceptance Criteria
- Users can sign up with email/password and provide username, firstName, lastName, bio
- User profile includes all extended fields and can be updated after creation
- Onboarding flow is triggered for new users who haven't completed their profile
- Session management works correctly with Hono middleware
- Protected endpoints require valid authentication
- Profile pictures can be uploaded and stored appropriately

## Phase 2: Qdrant Vector Database Setup
### Objectives
- Set up Qdrant vector store for document embeddings
- Integrate with existing document storage system (documents and chunks tables)
- Implement document chunking and indexing pipeline

### Tasks
1. Install and configure Qdrant client library
2. Set up Qdrant collection for document embeddings with appropriate vector dimensions
3. Create document processing pipeline:
   - Extract text from documents (PDF, DOCX, TXT using existing format support)
   - Split documents into semantic chunks with overlap
   - Generate vector embeddings using OpenAI embedding API
   - Store embeddings in Qdrant with metadata linking to SQLite chunks
4. Create API endpoints for:
   - Document upload and processing (POST /api/documents/upload)
   - Document deletion (DELETE /api/documents/:id) with corresponding Qdrant cleanup
   - Document list retrieval (GET /api/documents)
5. Implement similarity search in Qdrant that returns relevant chunks
6. Add error handling and validation for document uploads
7. Create migration scripts if needed for schema changes

### Acceptance Criteria
- Documents can be uploaded in PDF, DOCX, and TXT formats
- Document chunks are stored in both SQLite (chunks table) and Qdrant
- Qdrant collection contains vector embeddings with proper metadata
- Similarity search returns relevant document chunks based on query
- Document deletion removes both SQLite records and Qdrant embeddings
- Error handling works for unsupported formats and processing failures
- Processing pipeline properly handles documents with various sizes and content types

## Phase 3: Frontend "Login" Button
### Objectives
- Add authentication UI to Docusaurus navbar
- Create signup/login modals
- Display user profile when authenticated
- Implement protected routes for document management and chat

### Tasks
1. Create custom Docusaurus Navbar Item component that dynamically shows "Login" or user profile
2. Implement authentication hooks/utilities to manage session state
3. Build signup modal form with validation for email, password, username, firstName, lastName
4. Create login modal form with email and password fields
5. Build user profile dropdown showing user info and navigation to profile settings
6. Implement logout functionality
7. Connect all components to BetterAuth API endpoints
8. Create protected routes/components for document management and chat interfaces
9. Add loading and error states to all auth components
10. Implement client-side redirects after login/signup to preserve user intent

### Acceptance Criteria
- Navbar shows "Login" button when user is unauthenticated
- Navbar shows user profile dropdown (with avatar/initials) when authenticated
- Clicking "Login" opens modal with options to login or signup
- Signup modal validates inputs and creates new accounts successfully
- Login modal authenticates users and updates UI appropriately
- User can navigate to profile settings from the profile dropdown
- User can log out from any page and UI updates correctly
- Protected areas (document management, chat) redirect unauthenticated users to login
- Authentication state persists across page navigations and browser refreshes
- Error messages are displayed appropriately for failed auth operations

## Phase 4: The RAG Agent
### Objectives
- Implement chat interface for querying documents
- Integrate Qdrant retrieval with OpenAI generation
- Store and retrieve chat history in database
- Ensure secure access to user-specific documents and conversations

### Tasks
1. Implement RAG logic in backend API:
   - Receive user query and auth context from frontend
   - Search Qdrant for relevant document chunks specific to the user's documents
   - Construct prompt context from retrieved chunks
   - Generate response using OpenAI API while preserving conversation history
   - Stream response back to frontend if possible
2. Create chat window component in frontend with:
   - Message display area showing conversation history
   - Input field for queries with support for Enter and Shift+Enter
   - Loading indicators during processing
   - Ability to start new chats and switch between existing chats
   - Clear error messaging
3. Connect chat interface to backend RAG API with proper authentication
4. Implement chat management:
   - Store new chats in database (chats and messages tables)
   - Retrieve and display existing chat history
   - Allow users to delete chats
5. Add document context to responses (citing source documents/chunks)
6. Implement proper error handling for API failures, rate limits, etc.
7. Add typing indicators and proper loading states

### Acceptance Criteria
- User can ask questions about their uploaded documents
- RAG system retrieves relevant information from user's documents and generates accurate responses
- Chat history is properly stored in the database and retrievable
- Users only see documents and chats that belong to them
- Response citations reference the source documents/chunks
- Frontend provides good UX with loading states and error handling
- New chats can be started and existing chats can be resumed
- API properly handles authentication and authorization
- System gracefully handles errors (API failures, document access issues, etc.)
- Conversations stream back to the user in a timely manner

## Dependencies
- BetterAuth v0.5.0
- Qdrant JS client
- OpenAI API access
- Existing Drizzle ORM schema
- Docusaurus configuration

## Risk Assessment
- **High**: Integration complexity between multiple systems (authentication, document processing, RAG)
- **Medium**: Vector storage scalability with increasing document count
- **Low**: Frontend component integration

## Timeline
- Phase 1: 2 days
- Phase 2: 3 days
- Phase 3: 2 days
- Phase 4: 3 days