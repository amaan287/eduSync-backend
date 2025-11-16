# EduSync Backend

Offline-first e-learning platform backend built with Bun, Hono, MongoDB, and Cloudinary.

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Database:** MongoDB (with Mongoose)
- **Media Storage:** Cloudinary
- **Authentication:** JWT

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Cloudinary, JWT)
│   ├── models/          # Mongoose models
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic layer
│   ├── controllers/     # HTTP request handlers
│   ├── routes/          # Route definitions
│   ├── middlewares/     # Custom middlewares
│   ├── utils/           # Helper functions and validators
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Application entry point
```

## Architecture

### Layer-Based Architecture (SOLID Principles)

1. **Repository Layer**: Pure database operations
   - BaseRepository with generic CRUD operations
   - Specific repositories extend BaseRepository
   - Single Responsibility: Only handle data access

2. **Service Layer**: Business logic
   - Services receive repositories via dependency injection
   - Handle complex business rules
   - Coordinate between multiple repositories

3. **Controller Layer**: HTTP handling
   - Thin controllers that delegate to services
   - Handle request/response mapping
   - Input validation

4. **Middleware Layer**: Cross-cutting concerns
   - Authentication, authorization
   - Error handling
   - Request validation

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/edusync
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Run development server:
```bash
bun run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Courses (Public)
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course details

### Courses (Instructor)
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/instructor/my-courses` - Get instructor's courses
- `PUT /api/courses/:id/publish` - Publish course
- `POST /api/courses/:id/sections` - Add section
- `POST /api/courses/:id/lessons` - Add lesson with video
- `POST /api/courses/:id/resources` - Add resource file

### Enrollment (Student)
- `POST /api/enrollments/:id/enroll` - Enroll in course
- `GET /api/enrollments/my-courses` - Get enrolled courses
- `DELETE /api/enrollments/:id/unenroll` - Unenroll from course

### Progress (Student)
- `POST /api/progress` - Update lesson progress
- `GET /api/progress/course/:courseId` - Get course progress
- `GET /api/progress/lesson/:lessonId` - Get lesson progress

### Student Features
- `GET /api/student/:id/download-manifest` - Get offline download manifest

## Models

- **User**: User accounts (student/instructor)
- **Course**: Course information
- **Section**: Course sections
- **Lesson**: Video lessons
- **Resource**: Downloadable resources
- **Enrollment**: User course enrollments
- **Progress**: Lesson progress tracking

## Features

- JWT authentication
- Role-based access control (student/instructor)
- Video upload and streaming with Cloudinary
- Multiple video quality levels
- Resource file uploads
- Course progress tracking
- Offline download manifest generation
- RESTful API design
- Error handling
- Request validation with Zod

