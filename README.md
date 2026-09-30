# suensa 🍕🍔
### Restaurant Online Ordering & Order Management Application
**Technical Assessment for Tenacious Techies Private Limited — Next.js Developer**

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Live Demo & Source Code
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

## 🛠️ Verification of the 20 Specific Checklist Items

| # | Requirement | Implementation Details |
|---|---|---|
| **1** | **Remove horizontal scrolling** | Added `overflow-x: hidden` to `html, body, main` in `globals.css` and `layout.tsx`; fluid containers using `w-full max-w-7xl mx-auto px-4`. |
| **2** | **Find broken links** | All navigation and footer links point to valid routes (`/`, `/#menu`, `/track-order`, `/admin`, `/checkout`, `/#about`). No broken `#` links. |
| **3** | **Add a mobile menu** | Responsive animated hamburger drawer with quick navigation, order tracking, admin portal, and direct telephone call trigger. |
| **4** | **Add a favicon** | Created custom high-resolution SVG favicon (`src/app/icon.svg` & `public/favicon.svg`) with an artisanal cloche icon. |
| **5** | **Fix page titles** | Dynamic descriptive titles using Next.js Metadata API: `Menu`, `Checkout`, `Admin Portal`, `Order Tracking`, and `404 Not Found`. |
| **6** | **Add meta descriptions** | SEO-compliant, descriptive meta tags across all routes with keywords and viewport parameters. |
| **7** | **Fix footer links** | Working category anchors, story link, order tracker, admin portal, clickable phone, clickable email, and opening hours. |
| **8** | **Add a custom 404 page** | Built `src/app/not-found.tsx` with appetizing culinary illustration, helpful message, "Return to Menu", and hotline contact. |
| **9** | **Fix the copyright year** | Uses dynamic `new Date().getFullYear()` in `Footer.tsx` so the copyright year is always current. |
| **10** | **Compress images** | High-performance WebP-optimized Unsplash CDN images (`auto=format&fit=crop&w=600&q=80`) with `next/image` lazy loading. |
| **11** | **Fix broken buttons** | Every button has an explicit click handler, loading spinner state, disabled states, and keyboard accessibility. |
| **12** | **Add success messages** | Toast notification system (`useToast()`) on adding items, quantity updates, order completion, and status changes. |
| **13** | **Add error messages** | Inline form validation errors under every checkout input, empty cart warnings, and API error toasts. |
| **14** | **Remove placeholder text** | Zero "Lorem ipsum" or dummy copy. Authentic culinary descriptions, real address, real hours, and chef stories. |
| **15** | **Remove unused navigation** | Streamlined header with four purposeful destinations: Menu, Track Order, Admin Portal, and Cart. |
| **16** | **Fix mobile overflow** | Responsive flex/grid layouts (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), mobile drawer containment, and scroll-safe admin tables. |
| **17** | **Make the logo clickable** | Header and footer brand logos wrap in `<Link href="/">` returning directly to the home storefront. |
| **18** | **Make the phone number clickable** | Formatted `<a href="tel:+15557286742">` on header, hero, footer, checkout, and admin order cards. |
| **19** | **Make the email clickable** | Formatted `<a href="mailto:mohit.work@gmail.com">` on hero, footer, and admin drawer. |
| **20** | **Make every page mobile optimized** | Tested across 320px, 375px, 768px, 1024px, and 1440px viewports with a sticky floating mobile cart checkout bar. |

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

## 🎙️ Technical Review Discussion (Section 7)

### Q1. Why did you choose this component and folder structure?
> **Answer:** We followed the modern **Next.js App Router** convention with a clear separation of concerns:
> - `src/app/`: File-system routing for pages (`/`, `/checkout`, `/admin`, `/track-order`, `not-found.tsx`) and Route Handlers (`/api/...`).
> - `src/components/`: Reusable, single-responsibility UI components (`MenuItemCard`, `Navbar`, `CartDrawer`, `Footer`).
> - `src/context/`: Client state management isolated in custom React Contexts (`CartContext`, `ToastContext`).
> - `src/data/`: Static seed configuration and restaurant metadata (`restaurantData.ts`).
> - `src/lib/`: Unified business logic, Prisma client, storage engine, authentication, and validation.
> - `src/types/`: Central TypeScript contracts ensuring end-to-end type safety between API handlers and UI components.

### Q2. Which parts are Server Components and which are Client Components? Why?
> **Answer:**
> - **Server Components (`app/layout.tsx`, `app/page.tsx`, `not-found.tsx`):**
>   - Used for structural shells, static metadata injection (`title`, `description`, `viewport`), SEO optimization, and serving static content (`AboutSection`).
>   - **Benefit:** Zero JavaScript sent to the client for purely static layouts, improving First Contentful Paint (FCP) and SEO rankings.
> - **Client Components (`Navbar`, `MenuSection`, `CartDrawer`, `MenuItemCard`, `checkout/page.tsx`, `admin/page.tsx`):**
>   - Declared with `"use client"`.
>   - Required wherever browser APIs (`localStorage`), reactive hooks (`useState`, `useEffect`, `useContext`), event handlers (`onClick`, `onChange`), or animated modals/drawers are needed.
>   - **Benefit:** Hydrates only interactive islands, keeping the baseline bundle lightweight.

### Q3. How would you secure the APIs in a production application?
> **Answer:**
> 1. **Schema Validation:** Implement runtime payload validation using **Zod** for all POST/PATCH payloads (`/api/orders`, `/api/orders/[id]`).
> 2. **Rate Limiting:** Protect public endpoints from abuse with an in-memory or Redis-backed sliding-window rate limiter (e.g. `@upstash/ratelimit`).
> 3. **CORS & CSRF:** Restrict CORS headers to authorized client origins; enforce CSRF tokens or SameSite strict cookies for administrative actions.
> 4. **Authentication:** Secure administrative endpoints (`PATCH /api/orders/[id]`) using signed JWTs, NextAuth.js session tokens, or HTTP-only cookies verified in `middleware.ts`.

### Q4. How would you handle authentication and authorization for the admin area?
> **Answer:**
> 1. **Middleware Gatekeeper (`middleware.ts`):** Intercept all routes matching `/admin/:path*` and check for an encrypted HTTP-only session cookie.
> 2. **Authentication Provider:** Integrate **NextAuth.js (Auth.js)** or **Clerk** supporting OAuth (Google Workspace) or Email Magic Links.
> 3. **Role-Based Access Control (RBAC):** Attach role claims (`role: 'kitchen_staff' | 'admin' | 'manager'`) to the session token.
> 4. **Audit Logging:** Log all status change mutations with the admin's user ID and timestamp for accountability.

### Q5. How would you optimize the menu page if a restaurant had 1,000+ menu items?
> **Answer:**
> 1. **List Virtualization:** Render only the items currently visible in the viewport using `@tanstack/react-virtual`, reducing DOM nodes from 1,000+ to ~15.
> 2. **Server-Side Pagination & Cursor Streaming:** Fetch items in chunks (e.g., 24 per page) via `GET /api/menu?cursor=...&limit=24` using infinite scroll.
> 3. **Debounced Server Search & Indexing:** Move search execution to the database (e.g., PostgreSQL Full-Text Search or Meilisearch) debounced by 300ms.
> 4. **Edge Caching with On-Demand Revalidation:** Cache the menu response at the edge using Next.js `revalidateTag('menu')` and purge cache only when menu items change.
> 5. **Image Optimization:** Use responsive `sizes`, WebP/AVIF formats, and `loading="lazy"` via Next.js `<Image />`.

### Q6. How would you change the architecture if order updates needed to appear in real time?
> **Answer:**
> 1. **Server-Sent Events (SSE) or WebSockets:** Replace polling with a persistent bi-directional connection (e.g., Socket.io, Ably, or Pusher) between the kitchen screen and the customer tracking page.
> 2. **Database Pub/Sub:** Utilize PostgreSQL `LISTEN/NOTIFY` (or Supabase Realtime / Redis Pub/Sub) to broadcast status changes (`order_updated` event) to subscribed clients immediately.
> 3. **Audio Chimes:** Trigger browser Web Audio API sounds on incoming kitchen tickets to alert chefs without screen monitoring.

---

## 🏆 Bonus Features Implemented
- [x] **Admin Security Gate:** PIN/Passcode protection modal with default testing PIN `1234`.
- [x] **Optimistic UI Updates:** Instant status changes in admin table with automatic rollback on network failure.
- [x] **Printable Receipts:** Window print stylesheets for formatted order invoices.
- [x] **Toast Feedback System:** Lightweight notifications for cart operations and order updates.
- [x] **Live Order Tracker:** Visual step-by-step progress pipeline with search by reference code.
- [x] **Sticky Mobile Cart Bar:** Floating bottom checkout summary on mobile screens.

---
© 2026 suensa. Engineered for Tenacious Techies Private Limited Technical Assessment.
