# Network Devices Manager

A modern web application for managing network devices, built with React, TypeScript, and Vite. This frontend application provides an intuitive interface for visualizing, configuring, and managing network infrastructure.

## 📚 Preview

You can check the project here: [https://p-michalski.github.io/network-docs/](https://p-michalski.github.io/network-docs/)
**Note**
- Project requires properly set-up backend API and database. You can read on how to do that in a backend repository (you will find the link further below).

## 🚀 Features

- **Device Management**: Add, edit, and configure network devices with detailed specifications
- **Network Visualization**: Interactive network map showing device connections and topology
- **Connection Management**: Create and manage connections between devices (Ethernet, WiFi)
- **Real-time Updates**: Live synchronization of network state changes
- **Type Safety**: Full TypeScript support for enhanced development experience

## 🛠️ Technologies Used

### Core Technologies
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Static typing for enhanced code quality and developer experience
- **Vite** - Fast build tool and development server

### State Management & Data Flow
- **Redux Toolkit** - Modern Redux for predictable state management
- **Redux Saga** - Side effect management for async operations
- **React Hook Form** - Performant form handling with validation
- **Zod** - Schema validation and type inference

### UI & Styling
- **Styled Components** - CSS-in-JS styling solution
- **React Icons** - Comprehensive icon library
- **React Flow Renderer** - Interactive node-based diagrams for network visualization

### Routing & Navigation
- **React Router DOM** - Client-side routing and navigation

### HTTP & API
- **Axios** - Promise-based HTTP client for API communication

### Development Tools
- **ESLint** - Code linting and style enforcement
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite React Plugin** - React support for Vite

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Backend API server** (running on localhost)
- **Database** (configured and accessible by the backend)

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/P-Michalski/network-docs.git
cd frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

# Development Configuration
Make sure, your vite.config.ts looks something like this:
```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/network-docs/',
  
  server: {
    middlewareMode: false,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Backend & Database Setup

**Important**: This frontend application requires a running backend API and database to function properly.

### Backend Requirements
- **API Server**: Must be running on `localhost` (default port: 3000)
- **Database**: MySQL
- **CORS**: Backend must be configured to allow requests from the frontend origin

### Backend Repository
The backend code and setup instructions are available in a separate repository:
[https://github.com/P-Michalski/network-docs-api](https://github.com/P-Michalski/network-docs-api)

### Database Setup
1. Follow the backend repository instructions to set up the database
2. Run database migrations to create the required tables


## 🏗️ Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be available in the `dist` directory.

## 🧪 Linting

```bash
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
src/
├── api/                    # API client and service functions
├── hooks/                  # Custom React hooks
├── Models/                 # TypeScript classes and interfaces
├── Update/                 # Redux slices and sagas
├── Views/                  # React components and pages
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   └── NavigationBar/     # Navigation components
└── styles/                # Global styles
```

## 🐛 Troubleshooting

### Common Issues

**Application shows "Network Error" or API-related errors:**
- Ensure the backend API server is running on the correct port
- Check that CORS is properly configured on the backend
- Verify the API base URL in your environment configuration

**Database connection issues:**
- Ensure the database server is running
- Check database connection settings in the backend configuration
- Verify that required database tables exist (run migrations)

**Build or development server issues:**
- Clear node_modules and reinstall dependencies: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version compatibility
