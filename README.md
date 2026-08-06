# 🏔️ Summit Forge Outdoor (SFO) Engine

> **A High-Performance, Framework-Free Modular E-Commerce Engine for Extreme Alpine & Ultralight Gear.**  
> Built from the ground up with **Pure Vanilla JavaScript (ES6+)**, **Node.js (Express 5)**, **Prisma ORM**, and **PostgreSQL**.

---

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

---

## 🎯 Why I Built This Project

In a modern web development landscape dominated by complex frontend frameworks like React, Vue, and Next.js, it is easy to become reliant on heavy abstractions without fully understanding the underlying web standards.

I engineered **Summit Forge Outdoor (SFO)** to challenge myself and learn the fundamentals of building a **scalable, full-stack, modular web application**.

### 💡 Core Engineering Goals:
1. **Framework-Free Modular Architecture**: Design a complete Single Page Application (SPA) using **Vanilla JS ES Modules** without bundlers (Webpack/Vite) or UI frameworks. Understanding component breakdown, direct DOM manipulation, event delegation, and template rendering.
2. **Custom Reactive State Management**: Implement a predictable central state store ([`store.js`](file:///c:/Users/User/Documents/Local%20Projects/SFO-ecommerce/public/js/state/store.js)) inspired by Redux/Pinia, managing dynamic cart state, user session state, toast notifications, and client-side storage (`localStorage`).
3. **Clean Client-Side Router**: Build a custom SPA view router ([`app.js`](file:///c:/Users/User/Documents/Local%20Projects/SFO-ecommerce/public/js/app.js)) that handles dynamic routing, view rendering, and URL-like state transitions seamlessly.
4. **Robust RESTful Backend Architecture**: Structure a production-ready Express 5 backend following a strict **Controller-Service-Route-Middleware** layer pattern for high maintainability and clear separation of concerns.
5. **Relational Data Modeling with Prisma & PostgreSQL**: Design a full e-commerce schema featuring Users, Products, Orders, Order Items, Reviews, and Wishlists with relational integrity and seed data.
6. **Containerization & Deployment Readiness**: Package the full-stack engine into Docker container configurations (`Dockerfile`, `docker-compose.yml`) for seamless deployment across environments.

---

## ✨ Key Features

### 🛒 Frontend Features (Vanilla JS SPA)
- **⚡ Reactive Shopping Cart & Slide-out Drawer**: Real-time quantity updates, dynamic subtotal/tax/shipping calculations, persistent state in `localStorage`.
- **🔍 Advanced Catalog Filtering & Search**: Instant Client/API filtering by categories (*Tents, Outerwear, Packs, Sleep Systems*), keyword search, price sorting, and technical specs.
- **📖 Dynamic Product Detail Modal / Page**: High-resolution imagery, stock tracking, field notes, weatherproof ratings, weight specs, and customer reviews.
- **🔐 User Authentication & Profile Dashboard**: Secure JWT-based registration & login flow, profile stats (Loyalty Tiers, Summit Logs, Miles Logged), and order history tracking.
- **💳 Streamlined Mission Checkout**: Integrated checkout flow validating shipping addresses, order items, and payment breakdown.
- **🎨 Glassmorphism & High-Altitude Aesthetic**: Tailored CSS design system featuring custom dark-mode color tokens, smooth animations, micro-interactions, and responsive typography.

### ⚙️ Backend Features (Node.js & Express 5)
- **🔑 Secure Authentication API**: Password hashing via `bcryptjs` and stateless JWT token authentication with auth middleware (`authMiddleware.js`).
- **📦 Product & Inventory Management API**: REST endpoints for fetching catalog items, filtering by category, search queries, and individual product details.
- **📋 Order Processing Pipeline**: Transactions for order placement, calculating subtotals, linking ordered items, and maintaining user order history.
- **👤 User Management API**: Endpoints for updating user profiles, shipping/billing details, and user-specific stats.
- **🛡️ Centralized Error Handling & Security Middleware**: Custom error response formatting, CORS policy configuration, and standard HTTP status code handling.

---

## 🏗️ Architecture & Project Structure

```
SFO-ecommerce/
├── 📁 prisma/                  # Database Schema & Seed Data
│   ├── schema.prisma           # Prisma PostgreSQL data models
│   └── seed.js                 # Database seeder script
├── 📁 public/                  # Frontend Static Assets & SPA Engine
│   ├── 📁 assets/              # Static images and icons
│   ├── 📁 js/                  # Modular Vanilla JS Engine
│   │   ├── 📁 api/             # API HTTP client modules (authApi, productApi, orderApi)
│   │   ├── 📁 components/      # UI components (navbar.js, cartDrawer.js, productCard.js)
│   │   ├── 📁 state/           # Centralized reactive AppState store (store.js)
│   │   ├── 📁 utils/           # Formatters, helpers, toast notifications
│   │   ├── 📁 views/           # Modular SPA view renderers (home, detail, auth, checkout, orders, settings)
│   │   └── app.js              # SPA Router & Global Application Entry
│   ├── index.html              # Single Page Entrypoint
│   └── style.css               # Production Design System & Styling
├── 📁 src/                     # Backend Server Engine (Express 5)
│   ├── 📁 config/              # Server configuration & Prisma client instance
│   ├── 📁 controllers/         # HTTP Request handlers (auth, product, order, user)
│   ├── 📁 middleware/          # Auth verification & centralized error handler
│   ├── 📁 routes/              # Express API Route definitions
│   ├── 📁 services/            # Business logic & database queries
│   └── server.js               # Express application initialization & middleware setup
├── 📁 tests/                   # Automated API & Unit Tests (Node.js native test runner)
├── .env                        # Environment variable configuration
├── docker-compose.yml          # PostgreSQL & App orchestration
├── Dockerfile                  # Application container definition
└── package.json                # Project dependencies & npm scripts
```

---

## 🛠️ Tech Stack & Tools

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, Custom CSS3 Design System (CSS Variables, Flexbox, Grid)
- **Backend**: Node.js (v20+), Express.js 5, JavaScript ES Modules (`"type": "module"`)
- **Database**: PostgreSQL (via Prisma ORM 5.22)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`)
- **DevOps & Tooling**: Docker, Docker Compose, `tsx` (TypeScript Execution Engine for Node dev), Node Native Test Runner

---

## 🚀 Quick Start & Local Setup

### Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18.x or v20.x+)
- [npm](https://www.npmjs.com/) (v9.x+)
- [PostgreSQL](https://www.postgresql.org/) (or [Docker Desktop](https://www.docker.com/products/docker-desktop/))

---

### 1. Clone the Repository
```bash
git clone https://github.com/hasanhaswary/SFO-ecommerce.git
cd SFO-ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or update existing `.env`):
```env
PORT=5300
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sfo_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 4. Database Setup & Seeding
Push the Prisma schema to your PostgreSQL database and seed initial product and user data:
```bash
# Push database schema
npm run db:push

# Seed database with initial products & demo user
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5300`**.

---

## 🐳 Docker Deployment (Alternative Setup)

To run the entire platform (PostgreSQL Database + Node.js App) with Docker:

```bash
# Build and start container services
docker-compose up --build -d

# Check running containers
docker-compose ps
```

The application will be accessible at **`http://localhost:5300`**.

---

## 🧪 Testing

Run the automated test suite powered by Node.js native test runner:

```bash
npm test
```

---

## 🔖 Release Management & Tagging

This project follows [Semantic Versioning (SemVer)](https://semver.org/) for version releases.  
For a detailed guide on creating release tags, managing branches, and pushing GitHub releases, refer to the **[RELEASE_GUIDE.md](RELEASE_GUIDE.md)**.

---

## 👨‍💻 Author

**Hasan Haswary**  
- GitHub: [@hasanhaswary](https://github.com/hasanhaswary)  
- Project Repository: [SFO-ecommerce](https://github.com/hasanhaswary/SFO-ecommerce)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
