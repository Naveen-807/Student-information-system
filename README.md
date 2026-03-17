# Student Information System (SIS)

A modern, full-stack Student Information System with role-based access control for Students, Teachers, and Admins.

## Features

### 🔐 Authentication
- Secure JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Password reset functionality
- Session management

### 👨‍🎓 Student Features
- Personalized dashboard with academic overview
- Course registration and management
- Attendance tracking
- Grade viewing and GPA calculation
- Assignment submission
- Fee payment tracking
- Timetable viewing

### 👩‍🏫 Teacher Features
- Class management dashboard
- Attendance recording
- Assignment creation and grading
- Study material uploads
- Student performance analytics
- Communication with students

### 🏛️ Admin Features
- Complete system management
- User management (Students, Teachers)
- Course and department management
- Enrollment management
- Fee structure configuration
- System analytics and reporting

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + ShadCN UI
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Storage**: AWS S3 compatible
- **Charts**: Recharts

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install-all
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Update database credentials and other settings

4. Set up the database:
```bash
cd backend
npm run migrate
npm run seed
```

5. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Demo Accounts

After seeding the database, you can login with these accounts:

**Admin Account:**
- Email: admin@university.edu
- Password: Admin@123

**Teacher Account:**
- Email: teacher@university.edu
- Password: Teacher@123

**Student Account:**
- Email: student@university.edu
- Password: Student@123

## Project Structure

```
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   └── migrations/      # Database migrations
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   └── services/    # API services
└── docs/               # Documentation

```

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Rate limiting
- SQL injection prevention
- XSS protection
- CORS configuration

## License

MIT
