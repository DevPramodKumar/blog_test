# Blog Platform

A full-stack blogging web application with user authentication, admin panel, and Google GPT test advertisement integration.

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
├── docker-compose.yml       # MongoDB container
└── README.md
```

## Architecture

```
┌─────────────┐     REST API      ┌─────────────┐     Mongoose     ┌──────────┐
│  React SPA  │ ◄──────────────► │  Express.js │ ◄──────────────► │ MongoDB  │
│  (Vite)     │     JWT Auth     │  REST API   │                  │          │
└─────────────┘                  └─────────────┘                  └──────────┘
       │
       ▼
 Google GPT Test Ads
```

## Prerequisites

- Node.js 18+
- Docker (for MongoDB) or a running MongoDB instance
- npm

## Quick Start

### 1. Start MongoDB

```bash
docker compose up -d
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (invalidate token) |
| GET | `/api/auth/me` | Get current user |

### Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (search, pagination) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (search, filter, pagination) |
| GET | `/api/posts/:id` | Get post by ID |
| GET | `/api/posts/:id/related` | Get related posts |
| POST | `/api/posts` | Create post (auth required) |
| PUT | `/api/posts/:id` | Update post (auth required) |
| DELETE | `/api/posts/:id` | Delete post (admin only) |
| GET | `/api/posts/dashboard/stats` | Dashboard stats (admin only) |

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/blog?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

## Advertisement Placements

Configured in `frontend/src/config/ads.js`:

| Position | Usage |
|----------|-------|
| `top-banner` | Home & post detail header |
| `bottom-banner` | Footer area |
| `sidebar` | Sidebar on home & post pages |
| `content-1` | In-content (first half) |
| `content-2` | In-content (second half) |
| `sticky-footer` | Fixed bottom banner |

```jsx
import Advertisement from './components/Advertisement';

<Advertisement position="top-banner" />
<Advertisement position="sidebar" />
<Advertisement position="content-1" />
```

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

The first registered user is automatically assigned the `admin` role. Register an account to get admin access.

## Security Features

- JWT-based authentication with token blacklisting on logout
- bcrypt password hashing (12 rounds)
- Role-based access control (user/admin)
- Input validation with express-validator
- CORS configuration
- Environment-based secrets
- Protected and optional auth middleware

## License

MIT



Default Admin Account (test)
Field	Value
Email
demo@gmai.com
Password
123456
Name
Admin User
