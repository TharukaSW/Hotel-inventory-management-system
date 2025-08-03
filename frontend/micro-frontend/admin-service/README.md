# Admin Service - Hotel Inventory Management

This is the admin micro-frontend service for the Hotel Inventory Management System. It provides comprehensive administrative functionality for managing inventory, categories, suppliers, users, and generating reports.

## Features

### 🏠 Dashboard
- Real-time statistics and metrics
- Quick overview of inventory status
- Recent activity feed
- System status monitoring

### 📦 Inventory Management
- Complete CRUD operations for inventory items
- Search and filter functionality
- Stock level monitoring
- Category and supplier associations
- Bulk operations support

### 🏷️ Category Management
- Create, edit, and delete categories
- Category-based inventory organization
- Search and filter categories

### 👥 Supplier Management
- Manage supplier information
- Contact details and email management
- Supplier-item associations
- Search and filter suppliers

### 👤 User Management
- User role management (Admin, Front Desk, Stock Manager)
- User status monitoring
- Permission management
- Role-based access control

### 📊 Reports & Analytics
- Comprehensive reporting dashboard
- Inventory value calculations
- Stock level analytics
- Category and supplier distribution
- Export functionality

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
- **Shared Library** - Common components and utilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the shared library first:
```bash
cd ../shared-lib
npm install
npm run build
```

3. Start the development server:
```bash
npm run dev
```

The admin service will be available at `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## API Integration

The admin service integrates with the backend API through the shared library's `apiService`. All API calls are centralized and handle:

- Inventory items CRUD operations
- Category management
- Supplier management
- Stock transactions
- User authentication (mock implementation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── AdminLayout.tsx  # Main layout with navigation
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── InventoryManagement.tsx
│   ├── CategoryManagement.tsx
│   ├── SupplierManagement.tsx
│   ├── UserManagement.tsx
│   └── Reports.tsx
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Micro-Frontend Architecture

This service is part of a larger micro-frontend architecture:

- **Shell Application** - Main container (port 3000)
- **Admin Service** - This service (port 3001)
- **Front Desk Service** - Front desk operations (port 3002)
- **Auth Service** - Authentication (port 3003)
- **Shared Library** - Common components and utilities

## Development

### Adding New Features

1. Create new components in the `components/` directory
2. Add new pages in the `pages/` directory
3. Update the navigation in `AdminLayout.tsx`
4. Add routes in `App.tsx`

### Styling

The project uses Tailwind CSS for styling. Follow the existing patterns and use the shared design system.

### State Management

Currently using React's built-in state management. For complex state, consider using:
- React Context for global state
- React Query for server state
- Zustand for simple state management

## Deployment

The service can be deployed independently or as part of the larger micro-frontend system. Build artifacts are generated in the `dist/` directory.

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling
4. Include loading states
5. Test API integrations
6. Update documentation as needed

## License

This project is part of the Hotel Inventory Management System. 