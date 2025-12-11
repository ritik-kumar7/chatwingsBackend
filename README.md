# ChatWings Backend

Backend server for ChatWings real-time chat application.

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- Socket.io (real-time messaging)
- JWT Authentication
- Cloudinary (image uploads)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
```

3. Start server:
```bash
npm start
```

## API Endpoints

### Auth
- POST `/api/auth/signup` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Messages
- GET `/api/messages/:userId` - Get messages with user
- POST `/api/messages/send/:userId` - Send message

## Features

- User authentication with JWT
- Real-time messaging with Socket.io
- Image upload support
- Secure password hashing
