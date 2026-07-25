# ShopSphere — Full-Stack E-Commerce Platform

A production-style e-commerce web application built as a full-stack capstone project. Customers can browse, search, filter, and purchase products; admins can manage inventory and order fulfillment through a dedicated dashboard.

---

## 🛠️ Tech Stack

**Frontend**

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v6
- Axios
- lucide-react (icons)
- react-hot-toast (notifications)

**Backend**

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication with Role-Based Access Control (Customer / Admin)
- Multer (image uploads)
- bcryptjs (password hashing)

**Testing**

- Backend: Jest + Supertest + mongodb-memory-server
- Frontend: Jest + React Testing Library + MSW (Mock Service Worker)

**DevOps**

- Docker + docker-compose (optional — see [Docker section](#-optional-docker-setup))

---

## ✨ Features

- Product catalog with search, category filtering, price sorting, and pagination
- Shopping cart with persistent, per-user state
- JWT-based authentication with Customer / Admin roles
- Admin dashboard: full product CRUD with multi-image upload, order management with status updates
- Checkout flow with shipping details and order summary
- Responsive, modern UI with glassmorphism navbar, skeleton loaders, toast notifications, and empty states
- Automated backend test suite (unit + integration)
- Automated frontend test suite (component + integration, with mocked API layer)

---

## 📂 Project Structure

```
ecommerce-capstone/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── models/          # Mongoose schemas (User, Product, Cart, Order)
│   │   ├── controllers/     # Route handler logic
│   │   ├── middleware/      # Auth, upload, error handling
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # JWT token generation
│   │   ├── scripts/         # seed.ts, clearDB.ts
│   │   ├── tests/           # Jest unit + integration tests
│   │   ├── app.ts           # Express app configuration
│   │   └── server.ts        # Server entry point
│   ├── uploads/             # Uploaded product images (gitignored)
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, UI, and product components
│   │   ├── pages/           # Route-level pages (incl. pages/admin/)
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── services/        # API call wrappers (axios)
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── mocks/           # MSW handlers + mock data (testing)
│   │   ├── test-utils/      # renderWithProviders test helper
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── jest.config.cjs
│   ├── jest.polyfills.ts
│   ├── jest.setup.ts
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

- Node.js v18+ and npm
- MongoDB (local install, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster)
- Git

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/FahdHamza47/ecommerce-capstone.git
cd YOUR_REPO_NAME
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your own values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_long_random_string
NODE_ENV=development
```

Seed the database with a demo admin, a demo customer, and 8 sample products:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`. Confirm it's alive:

```bash
curl http://localhost:5000/api/health
```

### 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔑 Test Accounts

Created automatically by `npm run seed` in the backend:

| Role     | Email             | Password |
| -------- | ----------------- | -------- |
| Admin    | admin@example.com | admin123 |
| Customer | user@example.com  | user123  |

> ⚠️ These are intentionally simple demo credentials for local evaluation only. Never reuse this pattern in a real deployment — see [Security Notes](#-security-notes) below.

---

## 🧪 Running Tests

### Backend (Jest + Supertest)

```bash
cd backend
npm test              # run all tests once
npm run test:watch    # re-run on file changes
npm run test:coverage # generate a coverage report
```

Uses `mongodb-memory-server` to spin up a temporary, in-memory MongoDB instance — your real database is never touched during test runs.

### Frontend (Jest + React Testing Library + MSW)

```bash
cd frontend
npm test
```

API calls are intercepted by Mock Service Worker (MSW) with realistic fake responses, so component tests run without a live backend.

---

## 📡 API Overview

| Method | Endpoint                   | Access        | Description                                 |
| ------ | -------------------------- | ------------- | ------------------------------------------- |
| POST   | `/api/auth/register`       | Public        | Register a new customer account             |
| POST   | `/api/auth/login`          | Public        | Log in, receive a JWT                       |
| GET    | `/api/auth/profile`        | Authenticated | Get the logged-in user's profile            |
| GET    | `/api/products`            | Public        | List products (search/filter/sort/paginate) |
| GET    | `/api/products/categories` | Public        | List distinct product categories            |
| GET    | `/api/products/:id`        | Public        | Get a single product                        |
| POST   | `/api/products`            | Admin         | Create a product (with image upload)        |
| PUT    | `/api/products/:id`        | Admin         | Update a product                            |
| DELETE | `/api/products/:id`        | Admin         | Delete a product                            |
| GET    | `/api/cart`                | Authenticated | Get the current user's cart                 |
| POST   | `/api/cart`                | Authenticated | Add an item to the cart                     |
| PUT    | `/api/cart/:productId`     | Authenticated | Update an item's quantity                   |
| DELETE | `/api/cart/:productId`     | Authenticated | Remove an item from the cart                |
| DELETE | `/api/cart`                | Authenticated | Clear the entire cart                       |
| POST   | `/api/orders`              | Authenticated | Place an order                              |
| GET    | `/api/orders/myorders`     | Authenticated | Get the logged-in user's orders             |
| GET    | `/api/orders`              | Admin         | Get all orders in the store                 |
| PUT    | `/api/orders/:id/status`   | Admin         | Update an order's fulfillment status        |

---

## 🐳 Optional: Docker Setup

A full Docker setup (multi-stage builds for both frontend and backend, orchestrated with `docker-compose.yml`) is included for anyone who wants to run the entire stack — including MongoDB — with a single command, without installing Node or MongoDB locally.

```bash
# From the project root, with a root-level .env containing JWT_SECRET=...
docker compose up --build
```

Then visit `http://localhost:5173`. See `docker-compose.yml` and the Dockerfiles in `backend/` and `frontend/` for full configuration details.

> Note: this project was primarily developed and evaluated using the local Node.js setup described above; Docker support is provided as a bonus deployment path.

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt before storage — plain-text passwords are never saved or logged
- JWTs are signed with a secret from environment variables, never hardcoded
- Admin-only routes are protected server-side via middleware (`protect` + `admin`) — the frontend's route guards are a UX convenience only, not the actual security boundary
- Users cannot self-assign the `admin` role via the registration endpoint
- `.env` files are excluded from version control via `.gitignore`; see `.env.example` files for the required variable names

---

## 📌 Known Limitations / Future Improvements

- No payment gateway integration (checkout captures shipping details and creates an order record, but doesn't process real payment)
- No email notifications (order confirmation, password reset)
- No product review/rating submission UI (rating/numReviews fields exist on the model but aren't user-editable yet)
- Frontend test suite covers core infrastructure and one full component (`ProductCard`); expanding coverage to `Login`, `Home`, and `CartPage` integration flows is a natural next step
- No refresh-token rotation — JWTs are long-lived (30 days) with no revocation mechanism

---

## 👤 Author

Built by Fahd as a full-stack capstone project.
