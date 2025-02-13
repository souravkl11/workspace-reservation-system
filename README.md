# Workspace Reservation System

A RESTful API service that manages workspace booking requests with a multi-level approval system. Built as part of the IEEE Kerala Section internship selection process.

## Project Overview

This system implements a workspace reservation workflow where:
- Employees can request workspace bookings
- Team Managers can approve/reject booking requests
- Administrators have final approval authority
- Authentication and role-based authorization are implemented
- All actions are tracked with timestamps

## Features

- **User Management**
  - User registration with role assignment (Employee, Team Manager, Admin)
  - Secure authentication using JWT
  - Role-based access control

- **Booking System**
  - Employees can submit booking requests
  - Two-level approval workflow (Manager → Admin)
  - Status tracking throughout the approval process
  - Timestamp logging for all actions

- **Security**
  - Password hashing using bcrypt
  - JWT-based authentication
  - Role-based authorization middleware
  - Input validation and error handling

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing

## Project Structure

```
workspace-reservation/
├── src/
│   ├── config/
│   │   ├── database.js    # Database configuration
│   │   └── constants.js   # Application constants
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   ├── models/
│   │   └── database.js    # Database initialization
│   ├── controllers/
│   │   ├── userController.js    # User management logic
│   │   └── bookingController.js # Booking management logic
│   ├── routes/
│   │   ├── userRoutes.js       # User-related routes
│   │   └── bookingRoutes.js    # Booking-related routes
│   └── app.js             # Application entry point
└── package.json
```

## API Endpoints

### User Management
```
POST /api/register         - Create new user
POST /api/login        - User login
```

### Booking Management
```
POST /api/booking-requests              - Create booking request (Employee)
GET  /api/booking-requests              - List all booking requests
PUT  /api/booking-requests/:id/manager-action  - Manager approval/rejection
PUT  /api/booking-requests/:id/admin-action    - Admin approval/rejection
```

## Setup Instructions

1. **Prerequisites**
   - Node.js (v14 or higher)
   - PostgreSQL (v12 or higher)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/souravkl11/workspace-reservation-system.git
   cd workspace-reservation

   # Install dependencies
   npm install
   ```

3. **Database Setup**
   - Create a PostgreSQL database named 'workspace_db'
   - Update database configuration in `src/config/database.js` if needed

4. **Environment Configuration**
   - Database configuration can be found in `src/config/database.js`
   - JWT secret can be modified in `src/config/constants.js`

5. **Running the Application**
   ```bash
   # Start the server
   node src/app.js
   ```
   The server will start on port 3000 by default.

## Testing the API

1. **Create a User**
   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"username":"kannan","password":"pass123","role":"employee"}'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"kannan","password":"pass123"}'
   ```

3. **Create Booking Request**
   ```bash
   curl -X POST http://localhost:3000/api/booking-requests \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"booking_date":"2025-03-01"}'
   ```

## Security Considerations

- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt
- Role-based access control prevents unauthorized actions
- Input validation is implemented for all endpoints
- Database credentials should be moved to environment variables in production

## Future Improvements

- Implement booking conflict detection
- Add support for recurring bookings
- Add unit tests and integration tests
- Implement rate limiting
- Add logging system

## Author

Sourav K

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IEEE Kerala Section for this opportunity
- The Node.js and PostgreSQL communities for their excellent documentation