# Blog Platform

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, React Router, Axios, Vite |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcrypt |
| Ads | Google Publisher Tag (GPT) Test Ads |

## Project Structure

```
blog_test/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas (User, Post)
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Token blacklist utility
│   │   ├── validators/      # Input validation rules
│   │   └── server.js        # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── config/          # Ad slot configuration
│   │   ├── context/         # Auth context provider
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API client (Axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Architecture
              
```

## Prerequisites

- Node.js 18+
- MongoDB
- npm

## Quick Sart
```

### 1. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5001`.

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```


## Environment Variables

### Backend (`backend/.env`)

```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/blog?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5001/api
```

## Advertisement Placements

Configured in `frontend/src/config/ads.js`:

## Production Build

### Backend

```bash
cd backend
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

Set `VITE_API_URL` to your production API URL before building.

## Default Admin

The first registered user is automatically assigned the `admin` role. Register an acc




Default Admin Account (test)
Field	Value
Email
demo@gmail.com
Password
123456
Name
Admin User
