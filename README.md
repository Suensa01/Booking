# suensa
### Restaurant Online Ordering & Order Management Application

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

##  Live Demo & Source Code
- **Repository URL:** Available on GitHub
- **Deployment Platform:** Vercel-ready (configured for zero-config deployment)
- **Local Dev Server:** `http://localhost:3000`

---

## 📋 Features Overview

### A. Restaurant Menu Page (`/` or `/#menu`)
- **Branding & Restaurant Info:** Name (*suensa*), operational hours, delivery time (25–35 mins), rating (4.9 ★ / 1,420+ reviews), physical address, and contact lines.
- **Category Tabs:** Wood-Fired Pizza, Smash Burgers, Bronze-Cut Pasta, Sides, Italian Desserts, Botanical Beverages.
- **Real-Time Live Search:** Debounced instant filter matching dish title and description.
- **Dietary Filter:** Instant toggle for **Veg Only** vs. Non-Veg dishes.
- **Dish Cards:** Compressed high-resolution food photography, chef badges, pricing, description, dietary tags, and interactive Add to Cart or `[- qty +]` quantity steppers.
- **API Integration:** Data dynamically fetched via Next.js Route Handlers (`/api/menu`, `/api/categories`, `/api/restaurant`).

### B. Shopping Cart & State Management
- **Interactive State:** Add, update quantity, remove, and clear cart items.
- **Calculations:** Subtotal, GST & Restaurant Tax (5%), and Grand Total formatted with currency.
- **Persistence:** Synchronized with `localStorage` (`savoria_cart_data_v1`) with hydration safety to eliminate SSR mismatch flashes.
- **Responsive Layout:** Slide-over drawer on desktop & tablet; floating sticky bottom cart bar on mobile screens.

### C. Validated Checkout Flow (`/checkout`)
- **Customer Form:** Full Name (min 2 chars), 10-digit Mobile Phone, Email Address (RFC format regex), and Delivery Address.
- **Form Validation:** Real-time client-side validation with actionable error messages under each field.
- **Order Submission:** Dispatches payload to `POST /api/orders` with loading spinner and disabled state.
- **Order Success Confirmation:** Generates unique order reference ID (`ORD-XXXX`), displays item breakdown, ETA, delivery details, and direct link to live tracking.

### D. Admin Order Management (`/admin`)
- **Admin Dashboard:** Order statistics (Gross Revenue, Pending, Cooking in Kitchen, Completed).
- **Status Pipeline:** Supports filtering by `All`, `Pending`, `Accepted`, `Preparing`, `Completed`, `Cancelled`.
- **Optimistic UI Updates:** Status update calls `PATCH /api/orders/[id]` with immediate UI feedback and automatic rollback on network failure.
- **Detailed Receipt Drawer:** Inspect customer name, address, notes, itemized breakdown, and print receipts.
- **PIN Gatekeeper (Bonus):** Quick passcode unlock (Default PIN: `1234`).

### E. Live Order Tracker (`/track-order`)
- Visual 4-stage pipeline stepper: **Order Placed** → **Confirmed** → **In the Kitchen** → **Ready / Delivered**.
- Customer contact and address review with direct click-to-call restaurant support.

---



## 📁 Architecture & Folder Structure

```
d:\Booking_assignment
├── public/
│   └── favicon.svg             # Vector favicon asset
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx        # Admin order management dashboard
│   │   ├── api/
│   │   │   ├── categories/
│   │   │   │   └── route.ts    # GET /api/categories
│   │   │   ├── menu/
│   │   │   │   └── route.ts    # GET /api/menu (with search & category filter)
│   │   │   ├── orders/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts# GET & PATCH /api/orders/[id]
│   │   │   │   └── route.ts    # GET & POST /api/orders
│   │   │   └── restaurant/
│   │   │       └── route.ts    # GET /api/restaurant
│   │   ├── checkout/
│   │   │   └── page.tsx        # Validated checkout & order confirmation receipt
│   │   ├── track-order/
│   │   │   └── page.tsx        # Live order progress stepper
│   │   ├── globals.css         # Tailwind styles & overflow-x prevention
│   │   ├── icon.svg            # Next.js App Router dynamic favicon
│   │   ├── layout.tsx          # Root layout with metadata and providers
│   │   ├── not-found.tsx       # Custom culinary 404 page
│   │   └── page.tsx            # Main customer storefront
│   ├── components/
│   │   ├── AboutSection.tsx    # Brand story & culinary craftsmanship
│   │   ├── CartDrawer.tsx      # Slide-over cart with pricing calculations
│   │   ├── Footer.tsx          # Dynamic copyright, clickable contacts, links
│   │   ├── MenuItemCard.tsx    # Dish card with veg badge, price, and cart controls
│   │   ├── MenuSection.tsx     # Search, category pills, veg filter, menu grid
│   │   ├── MobileCartBar.tsx   # Sticky floating bottom cart bar on mobile
│   │   ├── Navbar.tsx          # Sticky navigation with mobile hamburger drawer
│   │   ├── Providers.tsx       # Combined Cart & Toast providers
│   │   └── RestaurantHero.tsx  # Hero section with metrics and direct contacts
│   ├── context/
│   │   ├── CartContext.tsx     # Shopping cart state with localStorage persistence
│   │   └── ToastContext.tsx    # Toast notification alerts system
│   ├── data/
│   │   └── restaurantData.ts   # Seed menu items, restaurant info & initial sample orders
│   ├── lib/
│   │   ├── auth.ts             # Admin authentication & session security
│   │   ├── db.ts               # Storage engine & database operations (Orders, Reservations, Menu)
│   │   ├── prisma.ts           # Prisma database client singleton
│   │   └── validators.ts       # Form validation schemas
│   └── types/
│       └── index.ts            # TypeScript interfaces (MenuItem, CartItem, Order, etc.)
├── .env.example                # Environment variables template
├── .env.local                  # Local development environment configuration
├── next.config.ts              # Next.js configuration (Unsplash remote patterns)
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup & Running Locally

### 1. Prerequisites
- **Node.js:** v18.18.0 or later (tested on Node v24)
- **npm:** v9.0.0 or later

### 2. Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd Booking_assignment

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Production Build
```bash
npm run build
npm start
```

---

## 🗄️ Database Setup: Direct Supabase Connection via Prisma ORM

This application connects **directly to Supabase PostgreSQL using Prisma ORM (v7)**. No separate client files or manual SQL schema installations are needed.

### 1. Get your Supabase Connection String
1. Log in to [Supabase](https://supabase.com) and create or open your project.
2. Go to **Project Settings** → **Database** → **Connection string**.
3. Copy the **URI** connection strings:
   - **Transaction / Session Pooler (port 6543):** Set this as `DATABASE_URL` in `.env.local`
   - **Direct Connection (port 5432):** Set this as `DIRECT_URL` in `.env.local`

### 2. Configure `.env.local`
```env
# .env.local
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Push Prisma Schema & Seed to Supabase
Map the Prisma schema directly to Supabase PostgreSQL tables and seed initial menu items, reviews, and reservations:

```bash
# Push Prisma schema directly to Supabase PostgreSQL:
npm run db:push

# Seed initial restaurant dishes, reviews, and sample bookings:
npm run db:seed
```

> **Zero-Config Local Development Fallback:**
> If `DATABASE_URL` is left empty, the application automatically runs in local development mode using persistent local JSON storage in `data/storage/*.json`. No database connection is required for basic local preview!

---

## 🔐 Admin Portal Authentication

The Admin Portal at [`/admin`](http://localhost:3000/admin) is secured with **standard Email & Password authentication**:
- **Default Email:** `mohit.work@gmail.com`
- **Default Password:** `admin123`
- **Configurable via:** `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`.
- **Session Management:** Cryptographically signed HMAC-SHA256 session token stored in an `HttpOnly` secure cookie (`savoria_admin_session`).
- **Protected Actions:** Modifying order statuses, updating table reservations, and adding/deleting menu items require an active administrator session.

---

## 📧 Automated Email Confirmations (Orders & Table Bookings)

Every time a customer places an order or reserves a table, a confirmation email is dispatched to their email address:

1. **Order Confirmation Email:**
   - Sent to: `order.email`
   - Content: Order reference ID (`#ORD-XXXX`), itemized dishes list, quantities, price breakdown (subtotal, tax, tip, discount), delivery address, and a live tracking button (`/track-order?orderId=...`).
2. **Table Reservation Confirmation Email:**
   - Sent to: `reservation.email`
   - Content: Booking reference (`#RES-XXX`), date, time slot, guest count, seating area, special requests, and restaurant arrival guidelines.

### SMTP Configuration in `.env.local`
To send real emails to your customers, configure standard SMTP (Gmail App Password, Resend, Brevo, Sendgrid, Mailtrap):
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM='"suensa" <mohit.work@gmail.com>'
```

> **Automatic Simulation Mode:**
> If SMTP credentials are not yet configured in `.env.local`, the email service automatically runs in safe simulation mode, outputting full details and simulated dispatch logs without failing order or booking creation.

---

© 2026 suensa.
