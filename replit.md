# DevCommunity - Social Platform for Developers

## Overview

DevCommunity is a full-stack social platform designed for developers to share articles, engage with content, and build professional connections. The application features article publishing, user authentication, social interactions (likes, comments, follows), and content discovery through tags and search functionality. Built with a modern tech stack using React, Express, and PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React and TypeScript, implementing a component-based architecture with several key design patterns:

- **State Management**: Redux Toolkit for global state management with separate slices for authentication and articles
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod schema validation
- **Protected Routes**: Custom ProtectedRoute component for authentication-based access control

### Backend Architecture
The server follows a RESTful API design using Express.js with TypeScript:

- **Server Framework**: Express.js with middleware for JSON parsing, CORS, and request logging
- **Route Organization**: Centralized route registration system with dedicated route handlers
- **Error Handling**: Global error middleware for consistent error responses
- **Development Tools**: Vite integration for hot reloading and development optimization

### Data Storage Solutions
The application uses a PostgreSQL database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL with Neon serverless deployment
- **ORM**: Drizzle ORM for schema definition and query building
- **Schema Design**: Relational database with tables for users, articles, comments, likes, follows, and tags
- **Migration Management**: Drizzle Kit for database schema migrations
- **In-Memory Storage**: Fallback MemStorage class for development/testing scenarios

### Authentication and Authorization
Authentication is implemented using a session-based approach with password hashing:

- **Password Security**: Bcrypt for password hashing and verification
- **User Registration**: Email and username uniqueness validation
- **Login System**: Credential-based authentication with error handling
- **Client-Side Auth**: Redux state management for user sessions with localStorage persistence
- **Route Protection**: Frontend route guards to restrict access to authenticated users

### Component Architecture
The frontend follows a modular component structure:

- **Layout Components**: Reusable Layout and Navigation components
- **Feature Components**: ArticleCard, CreatePostModal for specific functionality
- **UI Components**: Comprehensive shadcn/ui component library
- **Page Components**: Route-specific components for Home, Dashboard, Profile, etc.
- **Utility Components**: ProtectedRoute for authentication logic

## External Dependencies

### Core Framework Dependencies
- **@vitejs/plugin-react**: React plugin for Vite development server
- **express**: Node.js web framework for REST API
- **wouter**: Lightweight routing library for React
- **@reduxjs/toolkit**: State management with Redux
- **@tanstack/react-query**: Server state management and caching

### Database and ORM
- **@neondatabase/serverless**: Neon PostgreSQL serverless client
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **drizzle-kit**: CLI tool for database migrations

### UI and Styling
- **@radix-ui/react-***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Icon library

### Authentication and Security
- **bcrypt**: Password hashing library
- **@types/bcrypt**: TypeScript definitions for bcrypt

### Form Handling and Validation
- **react-hook-form**: Forms with easy validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation

### Development Tools
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution engine for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tools

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **tailwind-merge**: Utility for merging Tailwind CSS classes
- **nanoid**: URL-safe unique string ID generator