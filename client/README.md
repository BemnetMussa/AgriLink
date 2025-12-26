# AgriLink 🌱

A digital marketplace connecting **Ethiopian farmers**, **buyers**, and **administrators** to enable transparent agricultural trading, order management, and secure payments in a multilingual environment.

---

## 🚀 Overview

AgriLink is a full-stack platform designed to modernize agricultural commerce in Ethiopia by allowing farmers to list products directly, buyers to place orders, and admins to manage the ecosystem. The system emphasizes **scalability**, **security**, **offline capability**, and **multilingual support** (English, Amharic, Afaan Oromoo).

---

## 👥 User Roles

* **Farmer**: Create and manage product listings offline, view orders, communicate with buyers
* **Buyer**: Browse marketplace, place orders, negotiate prices, make payments, track deliveries
* **Admin**: Manage users, listings, transactions, and platform activity via web dashboard

---

## 🧩 Core Features

* Authentication & Authorization (OTP via mobile, role-based access)
* Multilingual User Registration & Onboarding (English, Amharic, Afaan Oromoo)
* Profile Management (farmers, buyers, admins)
* Product Listings & Marketplace (offline creation, geo-tagging, photos)
* Order Management & Negotiation
* Payment Integration (Chapa primary, escrow system)
* Logistics Coordination (encrypted chat, delivery tracking)
* Traceability & QR Code System
* Ratings & Reviews (mutual, verified farmer badges)
* Admin Dashboard (monitoring, reports, dispute resolution)
* Offline Capability (listing creation and viewing)

---

## 🏗️ System Architecture

**Actors → Frontend (PWA) → Backend API → Services → Database / External APIs**

### Frontend

* Registration & Login (OTP-based)
* Language Selection & Onboarding
* Marketplace Browsing & Search (multilingual)
* Product Listings (offline-capable)
* Orders & Payments
* Profile Management
* Admin Dashboard
* QR Traceability Viewer

### Backend

* API Gateway / Controllers
* Auth Service (OTP, JWT)
* User Service
* Listing Service
* Order Service
* Payment Service (Telebirr integration)
* Admin Service
* Middleware (Auth, Validation, Multilingual)

### External Services

* **MongoDB Atlas** – primary database
* **AWS S3 / Wasabi** – image and document storage
* **Telebirr / CBE Birr** – payment processing
* **Ethio-Telecom** – SMS/OTP gateway
* **OpenStreetMap** – location services

---

## 🔄 Example Request Flow (Order & Payment)

1. Farmer creates listing offline (syncs when online)
2. Buyer browses and places order via frontend
3. Backend validates request & saves order
4. Payment initialized with Telebirr (escrow)
5. Telebirr sends webhook confirmation
6. Backend updates order status & notifies parties
7. Delivery tracked via chat and status updates
8. Buyer rates transaction upon completion

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + Tailwind CSS (Progressive Web App)
* **Backend:** Node.js (NestJS or Express)
* **Database:** MongoDB Atlas
* **Auth:** OTP + JWT
* **Payments:** Telebirr API (primary), CBE Birr, HelloCash, Amole
* **Media:** AWS S3 or Wasabi
* **Location:** OpenStreetMap + optional Google Maps
* **Cloud:** AWS Mumbai region

---

## 📌 Project Goals

* Increase smallholder farmer income by at least 30% by 2030
* Provide transparent, traceable agricultural trading
* Ensure 99.5% uptime and offline functionality
* Support 100% multilingual UI from MVP launch
* Comply with Ethiopian financial and data protection regulations

---

## 📄 License

MIT License
