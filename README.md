# Student Information System (SIS)

A modern, full-stack Student Information System with role-based access control for Students, Teachers, and Admins. Built with React, Node.js, Express, and PostgreSQL.

## ✨ Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Password encryption with bcrypt
- Session management
- Rate limiting and security headers

### 👨‍🎓 Student Portal
- **Personalized Dashboard** - Academic overview with key metrics
- **Course Management** - Browse, register, and drop courses
- **Attendance Tracking** - View attendance records and percentage
- **Grade Viewing** - Check grades and GPA
- **Assignment Submission** - Submit and track assignments
- **Fee Management** - View and track fee payments
- **Timetable** - Weekly class schedule

### 👩‍🏫 Teacher Portal
- **Teacher Dashboard** - Overview of courses and students
- **Course Management** - Manage assigned courses
- **Attendance System** - Mark and track student attendance
- **Assignment Management** - Create and grade assignments
- **Student Analytics** - View student performance metrics
- **Material Upload** - Share study materials with students

### 🏛️ Admin Portal
- **System Dashboard** - Complete system analytics
- **Student Management** - CRUD operations for students
- **Teacher Management** - CRUD operations for teachers
- **Course Management** - Create and manage courses
- **Department Management** - Organize departments
- **Enrollment Management** - Handle course enrollments
- **Analytics & Reports** - Visual charts and statistics

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Naveen-807/Student-information-system.git
cd Student-information-system
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**

Backend (.env):
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

Frontend (.env):
```bash
cd frontend
cp .env.example .env
# Edit .env with your API URL
```

4. **Set up the database**
```bash
# Create PostgreSQL database
createdb sis_db

# Run migrations
cd backend
npm run migrate

# Seed demo data
npm run seed
```

5. **Start the development servers**
```bash
# From root directory
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 🔑 Default Demo Accounts

After seeding the database, you can login with these accounts:

**Admin Account:**
- Email: `admin@university.edu`
- Password: `Admin@123`
- Access: Full system management

**Teacher Account:**
- Email: `teacher@university.edu`
- Password: `Teacher@123`
- Access: Course and student management

**Student Account:**
- Email: `student@university.edu`
- Password: `Student@123`
- Access: Student portal features

## 📁 Project Structure

```
student-information-system/
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/      # Database & configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth & validation
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── main.jsx     # Entry point
│   └── package.json
├── README.md
├── DEPLOYMENT.md        # Deployment guide
├── VERCEL_DEPLOYMENT.md # Vercel-specific guide
└── API_DOCUMENTATION.md # API reference

```

## 🌐 Deployment

### Deploy to Vercel

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Push code to GitHub
2. Import repository in Vercel
3. Set up cloud database (Neon, Supabase, Railway)
4. Configure environment variables
5. Deploy!

### Other Platforms

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides for:
- Traditional VPS/EC2
- Docker
- Heroku
- Railway

## 📚 Documentation

- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Vercel Deployment**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- SQL injection prevention
- XSS protection with Helmet.js
- CORS configuration
- Environment variable protection

## 🎨 UI/UX Features

- Modern, clean interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states and error handling
- Empty states with helpful messages
- Gradient backgrounds and cards
- Icon-based navigation
- Quick action buttons

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📊 Database Schema

The system uses PostgreSQL with the following main tables:
- `users` - Authentication and user roles
- `students` - Student profiles
- `teachers` - Teacher profiles
- `courses` - Course information
- `enrollments` - Student-course relationships
- `attendance` - Attendance records
- `assignments` - Assignment details
- `submissions` - Student submissions
- `grades` - Grade records
- `fees` - Fee management
- `notifications` - System notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Naveen**
- GitHub: [@Naveen-807](https://github.com/Naveen-807)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by university management systems
- Designed for educational purposes

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review the API documentation

---

Made with ❤️ for educational purposes
