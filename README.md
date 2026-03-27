# Codeverge Talent Portal

A recruitment portal for Codeverge that handles student registration and manages the recruitment process.

## Project Structure

```
src/
├── frontend/          # React Vite frontend
│   ├── App.jsx       # Main registration page
│   ├── main.jsx      # Entry point
│   └── assets/       # Static assets
└── backend/          # Spring Boot backend
    ├── pom.xml       # Maven configuration
    └── src/main/java/com/codeverge/talentportal/
        ├── TalentPortalApplication.java
        ├── entity/Student.java
        ├── repository/StudentRepository.java
        ├── service/StudentService.java
        └── controller/StudentController.java
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Java 17
- Maven
- MySQL Database

### Database Setup
1. Create a MySQL database named `codeverge_db`
2. Create user `riso_user` with password `123456`
3. Grant privileges to the user on the database

```sql
CREATE DATABASE codeverge_db;
CREATE USER 'riso_user'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON codeverge_db.* TO 'riso_user'@'localhost';
FLUSH PRIVILEGES;
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on http://localhost:5173

### Backend Setup
```bash
# Navigate to backend directory
cd src/backend

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will run on http://localhost:8080

## Features

### Student Registration
- Complete registration form with validation
- Fields include: personal info, education, college, skills
- Real-time form validation
- Success/error feedback

### API Endpoints

#### Student Registration
- `POST /api/students/register` - Register a new student

#### Get Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `GET /api/students/email/{email}` - Get student by email

## Technology Stack

### Frontend
- React 18
- Vite
- React Bootstrap
- HTML5/CSS3

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL 8
- Maven

## Recruitment Process Flow

1. **Registration**: Students register via the portal
2. **Aptitude Test**: MCQ-based aptitude assessment
3. **Technical Test**: MCQ-based technical assessment  
4. **Coding Round**: Two programming questions
5. **Project Round**: Final evaluation phase

## Development Notes

- Frontend uses Vite proxy to connect to backend API
- CORS is configured for localhost development
- Database schema is auto-generated via JPA
- Form validation on both frontend and backend
