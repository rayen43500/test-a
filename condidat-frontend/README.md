# Candidat Frontend - React Dashboard

A modern React application with role-based dashboards that consumes Django REST APIs for user management and authentication.

## Features

- **Role-Based Authentication**: Separate dashboards for Admin, Candidat, and Recruteur
- **JWT Token Management**: Automatic token refresh and secure authentication
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Protected Routes**: Role-based access control for different user types
- **Profile Management**: Complete user profile editing capabilities
- **Admin Panel**: User management interface for administrators
- **Modern UI**: Clean and intuitive interface with Heroicons

## Tech Stack

- **React 19.1.1** - Frontend framework
- **React Router 6.8.1** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.2** - HTTP client for API calls
- **React Hook Form 7.48.2** - Form handling and validation
- **Heroicons 2.0.18** - Beautiful SVG icons

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── dashboard/
│   │   ├── Dashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── CandidatDashboard.js
│   │   └── RecruteurDashboard.js
│   ├── layout/
│   │   └── Layout.js
│   ├── profile/
│   │   └── Profile.js
│   ├── admin/
│   │   └── UserManagement.js
│   ├── ProtectedRoute.js
│   └── Unauthorized.js
├── contexts/
│   └── AuthContext.js
├── services/
│   └── authService.js
├── App.js
└── index.js
```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API endpoint**
   The application is configured to connect to the Django backend at `http://127.0.0.1:8000/api`
   
   If your Django server runs on a different URL, update the `API_BASE_URL` in `src/services/authService.js`

3. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## User Roles & Features

### Admin Dashboard
- **User Management**: View, edit, and delete users
- **System Statistics**: Overview of user counts by role
- **Recent Activity**: Monitor new user registrations
- **Quick Actions**: Access to system settings and reports

### Candidat Dashboard
- **Profile Completion**: Track and improve profile completeness
- **Skills Management**: Add and update professional skills
- **Application Tracking**: View job applications (coming soon)
- **Profile Optimization**: Tips for better visibility

### Recruteur Dashboard
- **Job Management**: Create and manage job postings (coming soon)
- **Candidate Search**: Browse and filter candidates (coming soon)
- **Application Review**: Manage incoming applications (coming soon)
- **Company Profile**: Update recruiter information

## Authentication Flow

1. **Registration**: Users can register with role selection (Candidat/Recruteur)
2. **Login**: JWT-based authentication with automatic token refresh
3. **Role-Based Routing**: Users are redirected to appropriate dashboards
4. **Protected Routes**: Access control based on user roles
5. **Logout**: Secure token cleanup and redirection

## API Integration

The frontend integrates with the Django REST API:

- `POST /api/register/` - User registration
- `POST /api/login/` - User authentication
- `POST /api/token/refresh/` - Token refresh
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile
- `GET /api/users/` - List users (admin only)
- `GET /api/users/{id}/` - Get user details (admin only)
- `DELETE /api/users/{id}/` - Delete user (admin only)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Setup

Make sure your Django backend is running on `http://127.0.0.1:8000` before starting the React development server.

### Styling

The project uses Tailwind CSS with a custom color palette:
- Primary colors: Blue shades for main actions
- Secondary colors: Gray shades for backgrounds and text
- Custom font: Inter for better readability

## Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the build folder** to your hosting service

3. **Update API URLs** for production environment

## Future Enhancements

- Job posting and management system
- Advanced candidate search and filtering
- Real-time notifications
- File upload for CVs and profile photos
- Advanced analytics and reporting
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the User Management System and follows the same licensing terms.
