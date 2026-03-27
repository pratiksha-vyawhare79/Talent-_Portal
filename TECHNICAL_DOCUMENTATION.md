# Codeverge Talent Portal - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Routing System](#routing-system)
5. [Page Documentation](#page-documentation)
6. [Component Documentation](#component-documentation)
7. [UI / Design System](#ui--design-system)
8. [Animations](#animations)
9. [Assets and Image Handling](#assets-and-image-handling)
10. [State Management](#state-management)
11. [API Integration](#api-integration)
12. [Local Development Setup](#local-development-setup)
13. [Deployment](#deployment)
14. [Future Improvements](#future-improvements)

---

## Project Overview

### Purpose
Codeverge Talent Portal is a comprehensive recruitment platform designed to streamline the hiring process for Codeverge. The platform manages the complete recruitment pipeline from initial registration through multi-stage assessments.

### Problem Solved
- **Traditional Recruitment Challenges**: Manual screening, inconsistent evaluation, time-consuming processes
- **Remote Assessment**: Enables remote testing with proctoring capabilities
- **Standardized Evaluation**: Consistent assessment criteria across all candidates
- **Data Management**: Centralized candidate data and results tracking

### Main Goals
- Provide a seamless candidate experience from registration to final evaluation
- Implement multi-stage assessment process (Aptitude → Technical → Coding)
- Ensure assessment integrity through proctoring and time management
- Deliver comprehensive analytics and reporting for recruiters
- Maintain scalability and performance for high-volume recruitment

---

## Technology Stack

### Frontend Technologies
- **React 19.2.0**: Modern UI library with hooks and concurrent features
- **Vite 7.3.1**: Fast build tool and development server
- **React Bootstrap 2.10.10**: UI component library based on Bootstrap 5.3.8
- **React Router DOM 7.13.1**: Client-side routing and navigation
- **React Icons 5.5.0**: Icon library for UI elements
- **Lottie Web 5.13.0**: Animation library for interactive graphics
- **TensorFlow.js 4.22.0**: Machine learning for face detection (proctoring)
- **BlazeFace 0.1.0**: Face detection model for camera monitoring
- **Recharts 3.7.0**: Data visualization and charting library

### Backend Technologies
- **Spring Boot 3.2.0**: Java-based application framework
- **Spring Data JPA**: Database access layer with ORM
- **Spring Security**: Authentication and authorization
- **Spring Boot Mail**: Email service integration
- **MySQL 8.0.33**: Relational database for data persistence
- **JWT 0.11.5**: JSON Web Tokens for authentication
- **Maven**: Dependency management and build tool

### Development Tools
- **ESLint 9.39.1**: Code quality and linting
- **Node.js**: JavaScript runtime environment
- **Java 17**: Backend programming language
- **VS Code**: Primary development environment

---

## Project Architecture

### Directory Structure
```
c:\Workspace\Talent_Portal/
├── src/
│   ├── frontend/                 # React frontend application
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.jsx       # Navigation header component
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── Header.css       # Header styling
│   │   │   └── Footer.css       # Footer styling
│   │   ├── assets/              # Static assets (images, animations)
│   │   │   ├── Programming Computer2.json  # Lottie animation
│   │   │   ├── Goal.png         # Feature icons
│   │   │   ├── laptop.png       # Feature icons
│   │   │   ├── star.png         # Feature icons
│   │   │   └── codeverge.svg    # Company logo
│   │   ├── pages/               # Application pages
│   │   │   ├── Welcome.jsx      # Landing page
│   │   │   ├── Login.jsx        # Authentication page
│   │   │   ├── TestInstructions.jsx  # Test guidelines
│   │   │   ├── CompatibilityCheck.jsx  # System requirements
│   │   │   ├── AptitudeTest.jsx # Aptitude assessment
│   │   │   ├── TechnicalTest.jsx  # Technical assessment
│   │   │   ├── CodingRound.jsx  # Coding challenges
│   │   │   └── ResultPortal.jsx  # Results display
│   │   ├── utilities/           # Helper functions
│   │   │   └── proctoringSession.js  # Test monitoring
│   │   ├── main.jsx            # Application entry point
│   │   └── App.css             # Global styles
│   ├── backend/                 # Spring Boot backend
│   │   ├── src/main/java/com/codeverge/talentportal/
│   │   │   ├── TalentPortalApplication.java  # Main application class
│   │   │   ├── controller/     # REST API endpoints
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AptitudeQuestionController.java
│   │   │   │   ├── TechnicalQuestionController.java
│   │   │   │   ├── CodingQuestionController.java
│   │   │   │   └── StudentController.java
│   │   │   ├── service/        # Business logic layer
│   │   │   │   ├── OTPService.java
│   │   │   │   ├── EmailService.java
│   │   │   │   ├── AptitudeQuestionService.java
│   │   │   │   └── TechnicalQuestionService.java
│   │   │   ├── repository/     # Data access layer
│   │   │   │   ├── StudentRepository.java
│   │   │   │   ├── AptitudeQuestionRepository.java
│   │   │   │   └── TechnicalQuestionRepository.java
│   │   │   ├── entity/         # Database entities
│   │   │   │   ├── Student.java
│   │   │   │   ├── AptitudeQuestion.java
│   │   │   │   ├── TechnicalQuestion.java
│   │   │   │   └── CodingQuestion.java
│   │   │   ├── dto/           # Data transfer objects
│   │   │   ├── config/        # Configuration classes
│   │   │   └── util/          # Utility classes
│   │   ├── pom.xml            # Maven configuration
│   │   └── mvnw               # Maven wrapper scripts
│   └── admin/                 # Admin panel components
├── public/                     # Public assets
├── package.json               # Frontend dependencies
├── vite.config.js            # Vite configuration
└── README.md                  # Project documentation
```

### Application Flow
1. **Frontend**: React SPA handles user interface and client-side logic
2. **Backend**: Spring Boot REST API provides business logic and data persistence
3. **Database**: MySQL stores candidate data, questions, and results
4. **Communication**: HTTP/HTTPS with JWT authentication
5. **Proctoring**: TensorFlow.js for camera-based monitoring during tests

---

## Routing System

### Frontend Routing (React Router DOM)
The application uses React Router DOM for client-side routing with the following route structure:

```jsx
// main.jsx - Route Configuration
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/test-instructions" element={<TestInstructions />} />
    <Route path="/compatibility-check" element={<CompatibilityCheck />} />
    <Route path="/test" element={<AptitudeTest />} />
    <Route path="/result" element={<ResultPortal />} />
    <Route path="/technical-test-relaxation" element={<TechnicalTestRelaxation />} />
    <Route path="/technical-test" element={<TechnicalTest />} />
    <Route path="/technical-result" element={<TechnicalResult />} />
    <Route path="/coding-test-relaxation" element={<CodingTestRelaxation />} />
    <Route path="/coding-round" element={<CodingRound />} />
    <Route path="/coding-test" element={<CodingTest />} />
    <Route path="/all-tests-completed" element={<AllTestsCompleted />} />
    <Route path="/dashboard" element={<App />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/coding-questions" element={<AdminCodingQuestions />} />
  </Routes>
</BrowserRouter>
```

### Route Categories
- **Public Routes**: `/`, `/login` - Accessible without authentication
- **Test Flow Routes**: Sequential progression through assessment stages
- **Result Routes**: Display test results and analytics
- **Admin Routes**: Administrative functions and question management
- **Protected Routes**: Require authentication and proper session state

### Navigation Flow
1. **Welcome** → **Login** → **Test Instructions** → **Compatibility Check**
2. **Compatibility Check** → **Aptitude Test** → **Result** → **Technical Test**
3. **Technical Test** → **Technical Result** → **Coding Round** → **All Tests Completed**

---

## Page Documentation

### Welcome Page (`/`)
**Purpose**: Landing page introducing the platform and recruitment process
**Components Used**: 
- Header, Footer (custom components)
- Lottie animation for visual appeal
- Bootstrap Cards for feature display
**Content Structure**:
- Hero section with animated computer graphic
- Feature showcase (Aptitude Testing, Technical Evaluation, Coding Challenges)
- Statistics section with animated counters
- Process flow visualization
- Call-to-action buttons for getting started

### Login Page (`/login`)
**Purpose**: User authentication with OTP-based verification
**Components Used**:
- Form controls for email input
- OTP verification interface
- Alert components for feedback
**Content Structure**:
- Email input form
- OTP verification form
- Success/failure states with appropriate messaging
- Navigation back to welcome page

### Test Instructions Page (`/test-instructions`)
**Purpose**: Display comprehensive test guidelines and requirements
**Components Used**:
- Card component for content container
- Modal for test start confirmation
- Custom logo integration
**Content Structure**:
- Company logo at top
- Test title and welcome message
- Detailed instructions section
- Test sections breakdown (Numerical, Verbal, Logical)
- Rules and guidelines
- Start test confirmation modal

### Compatibility Check Page (`/compatibility-check`)
**Purpose**: Verify system requirements for test-taking
**Components Used**:
- Video preview component
- Status indicators for system checks
- Action buttons for navigation
**Content Structure**:
- Company logo inside navy blue card
- System requirements description
- Camera and microphone status checks
- Compatibility test execution
- Navigation to actual test

### Aptitude Test Page (`/test`)
**Purpose**: Conduct aptitude assessment with proctoring
**Components Used**:
- Custom header with question counter and timer
- Question display with multiple choice options
- Camera preview for proctoring
- Progress indicators
**Content Structure**:
- Header with logo, question info, timer, and user email
- Question display area with options
- Navigation controls (previous/next)
- Section progress indicator
- Camera monitoring overlay

### Technical Test Page (`/technical-test`)
**Purpose**: Conduct technical knowledge assessment
**Components Used**:
- Similar structure to Aptitude Test
- Technical question display
- Timer and progress tracking
**Content Structure**:
- Header with test information
- Technical questions with MCQ format
- Time management system
- Progress tracking

### Coding Round Page (`/coding-round`)
**Purpose**: Programming challenge assessment
**Components Used**:
- Code editor interface
- Question display panel
- Test case visualization
**Content Structure**:
- Coding problem description
- Interactive code editor
- Test cases and expected outputs
- Submission and evaluation

### Result Portal Page (`/result`)
**Purpose**: Display test results and performance analytics
**Components Used**:
- Result cards with scores
- Progress charts (Recharts)
- Performance indicators
**Content Structure**:
- Overall score display
- Section-wise performance
- Time analysis
- Recommendations for next steps

---

## Component Documentation

### Header Component
**Purpose**: Navigation header with company branding
**Props**: None (static component)
**Behavior**: Displays company logo and navigation links
**Used In**: Welcome page, Dashboard
**Styling**: Custom CSS with responsive design

### Footer Component
**Purpose**: Page footer with contact information and links
**Props**: None (static component)
**Behavior**: Displays company info, contact details, and social links
**Used In**: Welcome page, Dashboard
**Features**: Google Maps integration for office location

### CameraCornerPreview Component
**Purpose**: Proctoring camera display during tests
**Props**: 
- `stream`: MediaStream object for camera feed
**Behavior**: Displays live camera feed in corner of screen
**Used In**: AptitudeTest, TechnicalTest, CodingTest
**Security**: Monitors user during test execution

### ResultCard Component
**Purpose**: Display individual test results
**Props**:
- `title`: Test section name
- `score`: Achieved score
- `total`: Maximum possible score
- `status`: Pass/Fail indicator
**Behavior**: Visual representation of test performance
**Used In**: ResultPortal, TechnicalResult

---

## UI / Design System

### CSS Architecture
- **Modular CSS**: Component-specific stylesheets
- **Bootstrap Integration**: Custom Bootstrap variables and overrides
- **Responsive Design**: Mobile-first approach with breakpoints
- **CSS Variables**: Consistent color palette and spacing

### Color Palette
```css
/* Primary Colors */
--primary-orange: #F4780A;    /* Brand accent color */
--primary-navy: #091e3e;      /* Main dark theme */
--secondary-navy: #1e3a5f;    /* Lighter navy variant */

/* Neutral Colors */
--white: #ffffff;
--black: #000000;
--gray-light: #f8fafc;
--gray-medium: #64748b;

/* Status Colors */
--success-green: #10b981;
--danger-red: #dc3545;
--warning-yellow: #f59e0b;
```

### Typography
- **Font Family**: System fonts (Bootstrap defaults)
- **Font Sizes**: Responsive scaling with rem units
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: 1.5 for body text, tighter for headings

### Spacing System
- **Base Unit**: 0.25rem (4px)
- **Scale**: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem
- **Component Padding**: Consistent use of Bootstrap spacing classes
- **Margins**: Logical spacing between sections

### Responsive Design
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 992px
  - Desktop: > 992px
- **Grid System**: Bootstrap 12-column grid
- **Components**: Adaptive layouts for different screen sizes

---

## Animations

### Lottie Animations
- **Programming Computer**: Welcome page hero animation
- **Library**: `lottie-web` for JSON-based animations
- **Implementation**: React refs for DOM targeting
- **Performance**: Optimized with cleanup on unmount

### CSS Animations
- **Hover Effects**: Button transformations, card elevations
- **Loading States**: Spinner animations for async operations
- **Transitions**: Smooth state changes with cubic-bezier timing
- **Keyframes**: Custom animations for process cards and statistics

### Animation Examples
```css
/* Process Card Animations */
.process-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.process-card:hover {
  transform: translateY(-8px) rotateX(5deg) scale(1.02);
}

/* Icon Floating Animation */
@keyframes iconFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
```

---

## Assets and Image Handling

### Static Assets Organization
```
src/frontend/assets/
├── Programming Computer2.json  # Lottie animation data
├── Goal.png                    # Feature icon
├── laptop.png                  # Feature icon
├── star.png                    # Feature icon
└── codeverge.svg               # Company logo
```

### Image Optimization
- **Formats**: SVG for logos, PNG for icons
- **Sizes**: Optimized for web (appropriate dimensions)
- **Loading**: Lazy loading for performance
- **Fallbacks**: Alt text for accessibility

### Asset Usage
- **Logo**: SVG format for scalability
- **Icons**: PNG with consistent sizing (120x80px)
- **Animations**: JSON format for Lottie integration
- **Imports**: ES6 module imports for components

---

## State Management

### Local State Management
- **React Hooks**: useState, useEffect, useRef for component state
- **Session Storage**: Test session data and proctoring information
- **Local Storage**: User authentication data and preferences

### Global State Patterns
- **Context API**: Used sparingly for shared state
- **Prop Drilling**: Minimal, focused on component boundaries
- **Custom Hooks**: Reusable state logic (proctoringSession.js)

### State Examples
```javascript
// Test State Management
const [questions, setQuestions] = useState([])
const [activeSection, setActiveSection] = useState(0)
const [answers, setAnswers] = useState({})
const [isSubmitted, setIsSubmitted] = useState(false)

// Proctoring State
const [cameraReady, setCameraReady] = useState(false)
const [micReady, setMicReady] = useState(false)
```

---

## API Integration

### Backend API Endpoints

#### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to user email
- `POST /api/auth/verify-otp` - Verify OTP and authenticate

#### Question Management
- `GET /api/aptitude-questions` - Fetch aptitude test questions
- `GET /api/technical-questions` - Fetch technical test questions
- `GET /api/coding-questions` - Fetch coding challenge questions

#### Result Management
- `POST /api/candidate-results/save` - Save test results
- `GET /api/results/{email}` - Fetch candidate results
- `POST /api/send-result-email` - Email results to candidate

#### Student Management
- `POST /api/students/register` - Register new student
- `GET /api/students/{email}` - Get student by email

### API Integration Pattern
```javascript
// Example API Call
const fetchQuestions = async () => {
  try {
    setLoading(true)
    const response = await fetch('/api/aptitude-questions')
    const data = await response.json()
    setQuestions(data.questions || [])
  } catch (error) {
    setError('Failed to load questions')
  } finally {
    setLoading(false)
  }
}
```

### Error Handling
- **Try-Catch Blocks**: Comprehensive error catching
- **User Feedback**: Error messages via Alert components
- **Retry Logic**: User can retry failed operations
- **Logging**: Console logging for debugging

---

## Local Development Setup

### Prerequisites
- **Node.js**: Version 18 or higher
- **Java**: Version 17
- **Maven**: Latest stable version
- **MySQL**: Version 8.0 or higher
- **Git**: For version control

### Database Setup
```sql
-- Create Database
CREATE DATABASE codeverge_db;

-- Create User
CREATE USER 'riso_user'@'localhost' IDENTIFIED BY '123456';

-- Grant Privileges
GRANT ALL PRIVILEGES ON codeverge_db.* TO 'riso_user'@'localhost';
FLUSH PRIVILEGES;
```

### Frontend Setup
```bash
# Navigate to project root
cd c:\Workspace\Talent_Portal

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on: http://localhost:5173
```

### Backend Setup
```bash
# Navigate to backend directory
cd src\backend

# Run Spring Boot application
.\mvnw.cmd spring-boot:run

# Backend runs on: http://localhost:8080
```

### Development Workflow
1. **Start Backend**: Run Spring Boot application first
2. **Start Frontend**: Run Vite development server
3. **Database**: Ensure MySQL is running with proper schema
4. **Proxy Configuration**: Vite proxy handles API calls to backend

---

## Deployment

### Production Build
```bash
# Frontend Build
npm run build

# Backend Build
cd src\backend
mvn clean package
```

### Environment Configuration
- **Frontend**: Environment variables for API endpoints
- **Backend**: application.properties for database and server config
- **Database**: Production MySQL instance
- **Security**: HTTPS configuration and CORS setup

### Deployment Options
- **Frontend**: Static hosting (Vercel, Netlify, AWS S3)
- **Backend**: Cloud hosting (AWS EC2, Heroku, DigitalOcean)
- **Database**: Managed MySQL service (AWS RDS, PlanetScale)
- **Email**: SMTP service integration (SendGrid, AWS SES)

---

## Future Improvements

### Technical Enhancements
1. **Performance Optimization**
   - Implement code splitting for better loading times
   - Add service worker for offline functionality
   - Optimize database queries with indexing

2. **Security Enhancements**
   - Implement rate limiting for API endpoints
   - Add CSRF protection for forms
   - Enhance proctoring with AI-based behavior analysis

3. **User Experience**
   - Add progress indicators for long-running operations
   - Implement dark mode theme
   - Add accessibility improvements (ARIA labels, keyboard navigation)

4. **Feature Additions**
   - Real-time collaboration for admin panel
   - Advanced analytics dashboard
   - Mobile app development (React Native)
   - Integration with ATS (Applicant Tracking System)

5. **Scalability**
   - Implement microservices architecture
   - Add Redis caching for session management
   - Database sharding for high-volume recruitment
   - CDN integration for asset delivery

### Code Quality
- **Testing**: Add unit and integration tests
- **Documentation**: API documentation with Swagger/OpenAPI
- **Code Standards**: ESLint and Prettier configuration
- **CI/CD**: Automated testing and deployment pipelines

---

## Conclusion

The Codeverge Talent Portal represents a comprehensive recruitment solution built with modern web technologies. The architecture supports scalability, maintainability, and security while providing an excellent user experience for both candidates and recruiters.

The modular design allows for easy extension and modification, while the robust backend ensures reliable data management and processing. The proctoring system adds integrity to the assessment process, making it suitable for remote hiring scenarios.

This documentation serves as a comprehensive guide for developers working on the project, providing insights into the architecture, implementation details, and future enhancement opportunities.
