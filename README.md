# Social Media App

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (signup, login, logout)
- Create, delete, and interact with posts
- Like and comment on posts
- Follow/unfollow users
- Real-time notifications
- User profiles with customizable settings
- Image upload support
- Responsive design

## Tech Stack

- **Frontend:**
  - React.js
  - React Query
  - React Router
  - Tailwind CSS
  - DaisyUI

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Cloudinary (for image uploads)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
node server.js
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 