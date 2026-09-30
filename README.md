# suensa

> **A modern, full-stack restaurant ordering & table reservation platform with real-time order tracking, administrative management, and automated email confirmations.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square)](LICENSE)

---

## 📖 About the Project

**suensa** is an artisanal restaurant web application designed to deliver an intuitive, high-performance customer dining and online ordering experience. From browsing wood-fired pizzas and artisanal pasta to booking dining tables and tracking deliveries in real time, the platform combines modern design aesthetics with enterprise-grade full-stack architecture.

### Core Tech Stack

- **Frontend Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), and [Lucide React](https://lucide.dev/) icons
- **Typography:** [Outfit](https://fonts.google.com/specimen/Outfit) via `next/font/google`
- **Database & ORM:** [Supabase](https://supabase.com/) PostgreSQL managed directly through [Prisma ORM 7](https://www.prisma.io/) (`@prisma/adapter-pg`)
- **State Management:** React Context API (`CartContext`, `ToastContext`) with safe `localStorage` hydration
- **Authentication:** Custom cryptographic HMAC-SHA256 session token management stored in secure `HttpOnly` cookies
- **Email Service:** [Nodemailer](https://nodemailer.com/) with SMTP support (Gmail, Brevo, Resend) and a zero-crash simulated logger fallback

---

## ✨ Key Features

### 🍽️ Interactive Customer Storefront
- **Dynamic Menu Discovery:** Browse dishes across curated categories (Pizza, Pasta, Burgers, Sides, Desserts, Beverages) with high-definition imagery and dietary indicators (Veg / Non-Veg).
- **Instant Search & Dietary Filters:** Real-time debounced search by dish title and ingredients, alongside quick toggle filters for vegetarian preferences.
- **Persistent Cart Drawer:** Slide-over shopping cart with quantity steppers, subtotal calculations, 5% GST calculation, and delivery/pickup preferences.
- **Validated Checkout (`/checkout`):** Real-time inline field validation (RFC-compliant email, 10-digit mobile, delivery address), promo code discounts (`BITES10`), and tip additions.

### 🍷 Table Reservations & Dining Booking
- **Table Booking Modal (`/reserve`):** Select dining date, seating area (Indoor Dining, Outdoor Terrace, Chef's Counter), guest count, time slots, and special requests.
- **Instant Reference Generation:** Confirmed reservations generate a unique `#RES-XXX` reference code and notify the customer immediately.

### 📍 Live Order Tracking (`/track-order`)
- **Real-Time Order Progress:** 4-stage visual pipeline stepper (*Order Placed* → *Confirmed* → *In the Kitchen* → *Ready / Delivered*).
- **Direct Reference Lookup:** Search and view any active or past order by reference ID (`#ORD-XXXX`).

### 🔐 Secure Admin Management Portal (`/admin`)
- **Single Email & Password Authentication:** Protected by cryptographically signed HMAC-SHA256 `HttpOnly` session cookies.
  - **Default Email:** `mohit.work@gmail.com`
  - **Default Password:** `admin123`
- **Live Order Management:** Real-time order pipeline with status updates (*Pending*, *Accepted*, *Preparing*, *Completed*, *Cancelled*) and printable customer receipts.
- **Menu Catalog Control:** Add new culinary items, toggle live item availability, and delete dishes with instant website reflection.
- **Table Seating Control:** Manage dining reservations, assign seating states, and update table schedules.
- **Analytics & Export:** Key metrics overview (gross revenue, active orders, booked tables) and one-click order data export to CSV.

### 📧 Automated Email Notifications
- **Order Confirmations:** Itemized invoice, customer address, price summary, and direct "Track Your Order Live" button.
- **Reservation Confirmations:** Booking summary, reserved date/time, table zone, guest count, and dining arrival guidelines.
- **Zero-Crash Resilience:** Operates in safe simulation mode when SMTP credentials are not configured, printing receipts directly to server logs without failing transactions.

---

## 📁 Project Structure

```
suensa/
├── prisma/
│   ├── schema.prisma           # Direct Supabase PostgreSQL schema definition
│   └── seed.ts                 # Database seed script for initial dishes & reviews
├── public/
│   ├── favicon.svg             # Application vector logo
│   └── icon.svg                # Dynamic app icon
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard with secure authentication
│   │   ├── api/                # Next.js Server Route Handlers
│   │   │   ├── admin/          # Admin login, logout, and session endpoints
│   │   │   ├── categories/     # Category listing endpoint
│   │   │   ├── coupons/        # Promo code validation handler
│   │   │   ├── menu/           # Menu CRUD and filter handlers
│   │   │   ├── orders/         # Order creation, lookup, and status mutation
│   │   │   ├── reservations/   # Table booking and status handlers
│   │   │   ├── restaurant/     # Restaurant metadata endpoint
│   │   │   └── reviews/        # Customer testimonial endpoints
│   │   ├── checkout/           # Multi-step checkout and invoice page
│   │   ├── reserve/            # Dedicated table reservation page
│   │   ├── track-order/        # Visual order tracking pipeline
│   │   ├── globals.css         # Tailwind CSS v4 design tokens and utilities
│   │   ├── layout.tsx          # Root layout with font optimization & metadata
│   │   ├── not-found.tsx       # Custom 404 page
│   │   └── page.tsx            # Main customer storefront
│   ├── components/             # Modular and reusable React components
│   │   ├── CartDrawer.tsx      # Slide-over cart state interface
│   │   ├── MenuItemCard.tsx    # Dish presentation card with stepper controls
│   │   ├── MenuSection.tsx     # Menu tab navigation, search, and dish grid
│   │   ├── Navbar.tsx          # Sticky navigation with mobile drawer
│   │   ├── TableReservationModal.tsx # Table booking modal
│   │   └── ...                 # Additional layout & banner sections
│   ├── context/                # React Context state management
│   │   ├── CartContext.tsx     # Cart items, subtotal, and tax calculation
│   │   └── ToastContext.tsx    # Asynchronous toast notification alerts
│   ├── data/                   # Initial fallback data & restaurant profiles
│   ├── lib/                    # Core business logic and integrations
│   │   ├── auth.ts             # HMAC-SHA256 session token creation and verification
│   │   ├── db.ts               # Storage adapter (Prisma ORM with local JSON fallback)
│   │   ├── email.ts            # Nodemailer transport and responsive HTML templates
│   │   └── prisma.ts           # PrismaClient database singleton
│   └── types/                  # Shared TypeScript interfaces and data contracts
├── .env.example                # Safe environment variable template
├── .gitignore                  # Excluded files and private environment configurations
├── next.config.ts              # Next.js runtime & image optimization settings
├── package.json                # Project dependencies and operational scripts
├── postcss.config.mjs          # Tailwind CSS v4 PostCSS integration
├── prisma.config.ts            # Prisma 7 migration and seed configuration
└── tsconfig.json               # TypeScript compiler rules & path aliases (@/*)
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### 1. Prerequisites
- **Node.js:** v18.18.0 or later (tested on Node.js v20 and v24)
- **Package Manager:** `npm` (v9+) or `pnpm`
- **Git**

### 2. Installation
Clone the repository and install the project dependencies:

```bash
# Clone the repository
git clone https://github.com/Suensa01/Booking.git

# Navigate into the project directory
cd Booking

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file by copying the provided example template:

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and configure your credentials:

```env
# Application Details
NEXT_PUBLIC_APP_NAME="suensa"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_RESTAURANT_PHONE="+1 (555) 728-6742"
NEXT_PUBLIC_RESTAURANT_EMAIL="mohit.work@gmail.com"

# Admin Authentication
ADMIN_EMAIL="mohit.work@gmail.com"
ADMIN_PASSWORD="admin123"
ADMIN_SESSION_SECRET="your_custom_secret_key_here"

# Supabase PostgreSQL (Prisma ORM)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Automated Email Notifications (Nodemailer SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="mohit.work@gmail.com"
SMTP_PASS="your-16-digit-app-password"
SMTP_FROM='"suensa" <mohit.work@gmail.com>'
```

> **Note:** If `DATABASE_URL` is omitted, the application automatically runs in zero-config development mode using persistent local storage in `data/storage/*.json`.

### 4. Database Setup (Prisma & Supabase)
Push the Prisma schema to your Supabase PostgreSQL database and seed initial restaurant dishes, customer reviews, and sample bookings:

```bash
# Push schema to Supabase PostgreSQL:
npm run db:push

# Seed initial culinary dishes and reviews:
npm run db:seed
```

### 5. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Management Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🚢 Deployment

This application is built for seamless deployment on [Vercel](https://vercel.com/):

1. Push your latest code to your GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your `Booking` repository.
4. Under **Environment Variables**, add the keys defined in your `.env.local`:
   - `DATABASE_URL` (Supabase connection pooler URL)
   - `DIRECT_URL` (Supabase direct database URL)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_URL` (Your production Vercel URL, e.g. `https://suensa.vercel.app`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
5. Click **Deploy**. Vercel will automatically build the Next.js application and deploy it globally.

To build and test the production bundle locally:

```bash
npm run build
npm start
```

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for personal and commercial projects.
