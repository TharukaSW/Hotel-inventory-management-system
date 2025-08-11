# Hotel Inventory Management System - Micro Frontend Architecture

A comprehensive hotel inventory management system built with React and TypeScript using micro frontend architecture.

## 🏗️ Architecture Overview

The system is composed of 4 main services:

1. **Auth Service** (Port 3001) - Central authentication service
2. **Admin Service** (Port 3000) - Admin dashboard for inventory management
3. **Inspector Service** (Port 3002) - Stock inspection and management
4. **Front Desk Service** (Port 3003) - Hotel booking and guest management
5. **Shared Library** - Common components, types, and utilities

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies

First, install dependencies for the shared library:

```bash
cd shared-lib
npm install
npm run build
```

Then install dependencies for each service:

```bash
# Auth Service
cd ../auth-service
npm install

# Admin Service  
cd ../admin-service
npm install

# Inspector Service
cd ../inspector-service
npm install

# Front Desk Service
cd ../frontdesk-service
npm install
```

### 2. Start All Services

Open 4 terminal windows and start each service:

**Terminal 1 - Auth Service:**
```bash
cd auth-service
npm run dev
```
Access at: http://localhost:3001

**Terminal 2 - Admin Service:**
```bash
cd admin-service  
npm run dev
```
Access at: http://localhost:3000

**Terminal 3 - Inspector Service:**
```bash
cd inspector-service
npm run dev  
```
Access at: http://localhost:3002

**Terminal 4 - Front Desk Service:**
```bash
cd frontdesk-service
npm run dev
```
Access at: http://localhost:3003

## 🔐 Demo Credentials

The system comes with pre-configured demo users for testing:

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full system administration, inventory management, reports

### Inspector/Stock Manager  
- **Username:** `inspector`
- **Password:** `inspector123`  
- **Access:** Inventory inspections, stock management, item requests

### Front Desk User
- **Username:** `frontdesk`
- **Password:** `frontdesk123`
- **Access:** Hotel bookings, guest management, check-in/check-out

## 🔄 Authentication Flow

1. **Start at Auth Service:** http://localhost:3001
2. **Login** with any of the demo credentials
3. **Automatic Redirect** to the appropriate service based on user role:
   - Admin → Admin Service (Port 3000)
   - Inspector → Inspector Service (Port 3002)  
   - Front Desk → Front Desk Service (Port 3003)

## 🔧 Features by Service

### Auth Service (Port 3001)
- ✅ Centralized authentication
- ✅ Role-based routing
- ✅ Session management
- ✅ Secure logout
- ✅ Beautiful login UI with demo credentials

### Admin Service (Port 3000)  
- ✅ Dashboard with key metrics
- ✅ Inventory management with category-specific fields
- ✅ Category management
- ✅ Supplier management
- ✅ User management
- ✅ Reports and analytics
- ✅ Item request handling
- ✅ User info display and logout

### Inspector Service (Port 3002)
- ✅ Inspection dashboard
- ✅ New inspection creation
- ✅ Inventory viewing
- ✅ Item request management
- ✅ User info display and logout

### Front Desk Service (Port 3003)
- ✅ Booking management
- ✅ Guest management  
- ✅ Check-in/check-out processes
- ✅ Payment handling
- ✅ User info display and logout

## 🛠️ Development

### Adding New Features

1. **Shared Components:** Add to `shared-lib/src/components/`
2. **Shared Types:** Add to `shared-lib/src/types/`
3. **Service-Specific Features:** Add to respective service directories

### Building for Production

```bash
# Build shared library first
cd shared-lib
npm run build

# Build each service
cd ../auth-service && npm run build
cd ../admin-service && npm run build  
cd ../inspector-service && npm run build
cd ../frontdesk-service && npm run build
```

## 📁 Project Structure

```
micro-frontend/
├── shared-lib/              # Shared components and utilities
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── api/            # API service functions
│   └── package.json
├── auth-service/            # Authentication service
│   ├── src/
│   │   ├── context/        # Auth context and providers
│   │   ├── components/     # Login components
│   │   └── App.tsx
│   └── package.json
├── admin-service/           # Admin dashboard
│   ├── src/
│   │   ├── components/     # Admin-specific components
│   │   ├── pages/          # Admin pages
│   │   └── App.tsx
│   └── package.json
├── inspector-service/       # Inspector dashboard
│   ├── src/
│   │   ├── components/     # Inspector components
│   │   ├── pages/          # Inspector pages
│   │   └── App.tsx
│   └── package.json
└── frontdesk-service/       # Front desk dashboard
    ├── src/
    │   ├── components/     # Front desk components
    │   └── App.tsx
    └── package.json
```

## 🔒 Security Features

- ✅ Secure localStorage token management
- ✅ Automatic logout functionality
- ✅ Role-based access control
- ✅ Session persistence across browser refreshes
- ✅ Automatic redirection to login when unauthorized

## 🎨 UI/UX Features

- ✅ Responsive design for all screen sizes
- ✅ Consistent design system across services
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Confirmation modals for destructive actions
- ✅ Intuitive navigation with active states
- ✅ User profile display in top bar and sidebar

## 🚀 Getting Started (Step by Step)

1. **Clone and Setup:**
   ```bash
   # Navigate to the project directory
   cd "D:\office works\frontend\micro-frontend"
   
   # Install shared library
   cd shared-lib && npm install && npm run build
   
   # Install auth service
   cd ../auth-service && npm install
   ```

2. **Start Auth Service:**
   ```bash
   cd auth-service
   npm run dev
   ```
   
3. **Open Browser:**
   - Go to http://localhost:3001
   - Try logging in with `admin` / `admin123`
   
4. **Start Other Services** (in separate terminals):
   ```bash
   # Terminal 2
   cd admin-service && npm run dev
   
   # Terminal 3  
   cd inspector-service && npm run dev
   
   # Terminal 4
   cd frontdesk-service && npm run dev
   ```

5. **Test the Flow:**
   - Login with different credentials
   - See automatic redirection based on roles
   - Test logout functionality
   - Explore different dashboards

## 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Kill process on specific port (example for port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Type Errors:**
```bash
# Rebuild shared library
cd shared-lib
npm run build
```

## 📝 Notes

- The authentication is currently using mock data for demonstration
- All services communicate through localStorage for session management
- For production, replace mock authentication with real API calls
- Consider implementing proper JWT token management for production use
