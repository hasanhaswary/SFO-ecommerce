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

## 🔐 Demo Credentials (Test Accounts)

You can use the following pre-seeded test accounts to log in to the **Basecamp Command Center**:

| Role / Profile | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Lead Explorer (Specialist)** | `alex.honnold@summitforge.com` | `Password123!` | 8,450 Loyalty Pts • 1,248.5 Miles • 14 Summits |
| **Tactical Trekker (Standard)** | `explorer@summitforge.com` | `Password123!` | 3,200 Loyalty Pts • 450.0 Miles • 6 Summits |

---

## 🎯 Why I Built This Project

In a modern web development landscape dominated by complex frontend frameworks like React, Vue, and Next.js, it is easy to become reliant on heavy abstractions without fully understanding the underlying web standards.

I engineered **Summit Forge Outdoor (SFO)** to challenge myself and master the fundamentals of building a **scalable, full-stack, modular web application**.

### 💡 Core Engineering Goals:
1. **Framework-Free Modular Architecture**: Design a complete Single Page Application (SPA) using **Vanilla JS ES Modules** without heavy bundlers or UI frameworks. Understanding component breakdown, direct DOM manipulation, event delegation, and template rendering.
2. **Custom Reactive State Management**: Implement a predictable central state store ([`store.js`](file:///c:/Users/User/Documents/Local%20Projects/SFO-ecommerce/public/js/state/store.js)) managing dynamic cart state, user session state, toast notifications, and client-side storage (`localStorage`).
3. **Clean Client-Side Router**: Build a custom SPA view router ([`app.js`](file:///c:/Users/User/Documents/Local%20Projects/SFO-ecommerce/public/js/app.js)) that handles dynamic routing, view rendering, top back button controls, and seamless view transitions.
4. **Robust RESTful Backend Architecture**: Structure a production-ready Express 5 backend following a strict **Controller-Service-Route-Middleware** layer pattern for high maintainability and clear separation of concerns.
5. **Relational Data Modeling with Prisma & PostgreSQL**: Design a full e-commerce schema featuring Users, Products, Orders, Order Items, Reviews, and Wishlists with relational integrity and seed data.
6. **Containerization & Deployment Readiness**: Package the full-stack engine into Docker container configurations (`Dockerfile`, `docker-compose.yml`) for zero-downtime deployment across environments.

---

## ✨ Key Features

### 🛒 Frontend Features (Vanilla JS SPA)
- **⚡ Reactive Shopping Cart & Slide-out Drawer**: Real-time quantity updates, dynamic subtotal/tax/shipping calculations, persistent state in `localStorage`.
- **🔍 Advanced Catalog Filtering & Search**: Instant Client/API filtering by categories (*Footwear, Apparel, Equipment, Camping, Running*), keyword search, price sorting, and technical specs.
- **📖 Dynamic Product Detail Inspection**: High-resolution imagery, stock tracking, field notes, weatherproof ratings, weight specs, and customer reviews with top-bar navigation back controls.
- **🔐 Command Center & Personnel Dashboard**: Secure JWT-based registration & login flow, live profile stats (Loyalty Tiers, Total Summits, Miles Logged, Expedition Credits), active deployment cards, and order history tracking.
- **💳 High-Contrast Mission Checkout**: Streamlined checkout flow validating shipping addresses, card payment credentials, VAT calculations, and free shipping thresholds.
- **🎨 Glassmorphism & High-Altitude Aesthetic**: Tailored CSS design system featuring custom dark-mode color tokens, smooth animations, micro-interactions, and responsive typography.

### ⚙️ Backend Features (Node.js & Express 5)
- **🔑 Secure Authentication API**: Password hashing via `bcryptjs` and stateless JWT token authentication with auth middleware (`authMiddleware.js`).
- **📦 Product & Inventory Management API**: REST endpoints for fetching catalog items, filtering by category, search queries, and individual product details.
- **📋 Order Processing Pipeline**: Transactions for order placement, calculating subtotals, linking ordered items, and maintaining user order history.
- **👤 User Management API**: Endpoints for updating user profiles, 2FA security settings, shipping details, and live user metrics.
- **🛡️ Centralized Error Handling & Security Middleware**: Custom error response formatting, CORS policy configuration, and standard HTTP status code handling.

---

## 📸 Application Screenshots

Place your screenshot files in **`docs/images/`** matching the file names listed below to showcase your portfolio demo:

| View Name | File Path in Repository | Description |
| :--- | :--- | :--- |
| **Main Hero Page** | `docs/images/main_page.png` | Landing page featuring the high-altitude hero banner and featured equipment carousel. |
| **Product Catalog** | `docs/images/products_catalog.png` | Full product catalog grid with category pill filtering, search bar, and sorting. |
| **Product Details** | `docs/images/product_detail.png` | Technical product inspection page with weather ratings, specifications, and field reports. |
| **Cart Drawer** | `docs/images/cart_drawer.png` | Slide-out reactive shopping cart drawer with real-time subtotal and quantity controls. |
| **Secure Checkout** | `docs/images/checkout_dispatch.png` | High-contrast checkout dispatch form with destination validation and summary. |
| **Command Center** | `docs/images/command_center.png` | Member profile dashboard displaying total summits, miles logged, credits, and active deployments. |
| **Order History** | `docs/images/order_history.png` | Expedition mission order history with dispatch statuses, manifest items, and return claims. |

### 🖼️ Preview Showcase

| Main Hero Page | Product Catalog Grid |
| :---: | :---: |
| ![Main Page](docs/images/main_page.png) <br> *Landing hero banner with technical gear highlights* | ![Product Catalog](docs/images/products_catalog.png) <br> *Catalog grid with dynamic category filters* |

| Product Details Inspection | Slide-Out Cart Drawer |
| :---: | :---: |
| ![Product Detail](docs/images/product_detail.png) <br> *Technical specs, weatherproofing & field notes* | ![Cart Drawer](docs/images/cart_drawer.png) <br> *Slide-out cart drawer with real-time calculations* |

| Secure Checkout Dispatch | Command Center Dashboard |
| :---: | :---: |
| ![Secure Checkout](docs/images/checkout_dispatch.png) <br> *High-contrast checkout dispatch & destination validation* | ![Command Center](docs/images/command_center.png) <br> *Personnel stats, total summits, miles logged & active deployments* |

| Expedition Mission History |
| :---: |
| ![Order History](docs/images/order_history.png) <br> *Expedition history with status badges & return claims* |

---

## 📡 API Endpoints Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/auth/user` | Retrieve active user profile & live metrics | Private |
| `POST` | `/api/auth/forgot-password` | Request security password reset | Public |

### 🎒 Products (`/api/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get products (supports `category`, `search`, `sort`) | Public |
| `GET` | `/api/products/slug/:slug` | Get single product by slug | Public |
| `GET` | `/api/products/:id` | Get single product by ID | Public |
| `POST` | `/api/products/:id/reviews` | Submit product field review | Private |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Create new order (Checkout) | Private |
| `GET` | `/api/orders` | Get user order history | Private |
| `GET` | `/api/orders/:id` | Get order details by ID/Order # | Private |
| `POST` | `/api/orders/:id/reorder` | Quick reorder items | Private |
| `POST` | `/api/orders/:id/refund` | Submit refund/return request | Private |

### 👤 User Command Center (`/api/user`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Get user stats & profile manifest | Private |
| `PUT` | `/api/user/profile` | Update profile information | Private |
| `PUT` | `/api/user/security` | Update password & 2FA | Private |
| `DELETE` | `/api/user/retire` | Permanently delete account | Private |

---

## 🏗️ Architecture & Project Structure

```
SFO-ecommerce/
├── 📁 docs/                    # Documentation & Portfolio Assets
│   └── 📁 images/              # Application Screenshots
│       ├── main_page.png
│       ├── products_catalog.png
│       ├── product_detail.png
│       ├── cart_drawer.png
│       ├── checkout_dispatch.png
│       ├── command_center.png
│       └── order_history.png
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
│   │   ├── 📁 views/           # Modular SPA view renderers (home, detail, auth, checkout, dashboard, orders, settings, favorites)
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
Create a `.env` file in the root directory:
```env
PORT=5300
DATABASE_URL="postgresql://postgres:password123@localhost:5432/summit_forge_db?schema=public"
JWT_SECRET="hasan_summit_forge_jwt_super_secret_key_2026"
```

### 4. Database Setup & Seeding
Push the Prisma schema to your PostgreSQL database and seed initial product and user data:
```bash
# Push database schema
npm run db:push

# Seed database with initial products & demo users
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5300`**.

---

## 🐳 Docker Deployment (Recommended)

To run the entire platform (PostgreSQL Database + Node.js App) with Docker Compose:

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
For a detailed guide on creating release tags, managing branches, and pushing GitHub releases, refer to **[RELEASE_GUIDE.md](RELEASE_GUIDE.md)**.

---

## 👨‍💻 Author

**Hasan Haswary**  
- GitHub: [@hasanhaswary](https://github.com/hasanhaswary)  
- Project Repository: [SFO-ecommerce](https://github.com/hasanhaswary/SFO-ecommerce)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
