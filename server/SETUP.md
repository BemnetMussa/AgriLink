# AgriLink Backend Setup Guide

## 🎯 Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other configurations
   ```

3. **Setup database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Create database and run migrations
   npm run prisma:migrate

   # (Optional) Seed with sample data
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📦 What's Included

### ✅ Complete Backend Infrastructure

- **TypeScript + Express**: Fully typed Node.js backend
- **PostgreSQL + Prisma**: Type-safe database access with migrations
- **Modular Architecture**: Clean separation of concerns

### ✅ Authentication & Authorization

- JWT-based authentication
- OTP (One-Time Password) support for phone verification
- Role-based access control (FARMER, BUYER, ADMIN)
- Password hashing with bcrypt
- Refresh token mechanism
- OAuth ready (Google OAuth configured)

### ✅ Core Business Logic

1. **User Management**
   - User registration and profiles
   - Farmer and buyer profiles
   - Farmer verification system (admin-managed)

2. **Product Management**
   - CRUD operations for products
   - Advanced search and filtering
   - Category and location filtering
   - Product ratings and reviews

3. **Order Management**
   - Multi-item order creation
   - Order status tracking
   - Price negotiation
   - Multi-vendor support

4. **Payment System with Escrow**
   - Payment initialization
   - Escrow holding mechanism
   - Automatic escrow release (14 days)
   - Manual escrow release
   - Refund capability
   - Payment gateway webhook handling (Chapa/Telebirr ready)

5. **Reviews & Ratings**
   - Order-based reviews
   - User and product ratings
   - Verified reviews
   - Rating aggregation

6. **Chat/Negotiation System**
   - Order-based messaging
   - Message types (text, image, file, price negotiation)
   - Unread message tracking
   - Conversation management

7. **Notifications**
   - In-app notifications
   - Multiple notification types
   - Unread count tracking
   - Mark as read functionality

### ✅ Security Features

- Input validation with Zod schemas
- Rate limiting (API and auth endpoints)
- CORS configuration
- Helmet security headers
- SQL injection protection (Prisma)
- XSS protection
- Error handling and logging

### ✅ Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for all list endpoints
- Efficient Prisma queries
- Connection pooling

### ✅ Developer Experience

- TypeScript for type safety
- Comprehensive error handling
- Structured logging with Winston
- Environment-based configuration
- ESLint configuration
- Prisma Studio for database management

## 📁 Project Structure

```
server/
├── src/
│   ├── config/              # Configuration
│   │   ├── database.ts      # Prisma client
│   │   └── env.ts           # Environment variables
│   ├── controllers/         # Request handlers (8 controllers)
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── review.controller.ts
│   │   ├── chat.controller.ts
│   │   └── notification.controller.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Centralized error handling
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   └── security.ts      # Security headers
│   ├── routes/              # API routes (8 route files)
│   │   └── index.ts         # Route aggregator
│   ├── services/           # Business logic (8 services)
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── review.service.ts
│   │   ├── chat.service.ts
│   │   └── notification.service.ts
│   ├── utils/               # Utilities
│   │   ├── errors.ts        # Custom error classes
│   │   ├── logger.ts        # Winston logger
│   │   ├── response.ts      # Response helpers
│   │   └── validation.ts    # Validation utilities
│   └── index.ts            # Server entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /otp/request` - Request OTP
- `POST /otp/verify` - Verify OTP and login
- `POST /register` - Register new user
- `POST /login` - Login with password
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout
- `POST /change-password` - Change password
- `POST /reset-password` - Reset password with OTP

### Users (`/api/v1/users`)
- `GET /me` - Get current user
- `GET /stats` - Get user statistics
- `PUT /profile` - Update profile
- `PUT /farmer/profile` - Update farmer profile
- `POST /farmer/verification` - Submit verification documents
- `PUT /buyer/profile` - Update buyer profile
- `GET /:id` - Get user by ID

### Products (`/api/v1/products`)
- `GET /` - List products (with filters)
- `GET /categories` - Get all categories
- `GET /locations` - Get all locations
- `GET /:id` - Get product details
- `POST /` - Create product (Farmer only)
- `PUT /:id` - Update product (Farmer only)
- `DELETE /:id` - Delete product (Farmer only)
- `GET /farmer/my-products` - Get farmer's products

### Orders (`/api/v1/orders`)
- `POST /` - Create order
- `GET /` - List orders
- `GET /:id` - Get order details
- `PATCH /:id/status` - Update order status
- `POST /:id/negotiate` - Negotiate price

### Payments (`/api/v1/payments`)
- `POST /:id/initialize` - Initialize payment
- `GET /:id` - Get payment details
- `POST /:id/release-escrow` - Release escrow
- `POST /webhook` - Payment webhook

### Reviews (`/api/v1/reviews`)
- `POST /order/:orderId` - Create review
- `GET /user/:userId` - Get user reviews
- `GET /product/:productId` - Get product reviews
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### Chat (`/api/v1/chat`)
- `POST /order/:orderId/messages` - Send message
- `GET /order/:orderId/messages` - Get messages
- `GET /conversations` - Get conversations
- `GET /unread-count` - Get unread count
- `POST /mark-read` - Mark messages as read

### Notifications (`/api/v1/notifications`)
- `GET /` - Get notifications
- `GET /unread-count` - Get unread count
- `PATCH /:id/read` - Mark as read
- `PATCH /read-all` - Mark all as read
- `DELETE /:id` - Delete notification

## 🔐 Default Test Users (from seed)

- **Admin**: Phone: `911111111`, Password: `admin123`
- **Farmer**: Phone: `922222222`, Password: `farmer123`
- **Buyer**: Phone: `933333333`, Password: `buyer123`

## 🚀 Next Steps

1. **Configure Payment Gateway**: Update Chapa/Telebirr credentials in `.env`
2. **Setup SMS Service**: Configure SMS API for OTP sending
3. **Configure File Storage**: Setup AWS S3 or Wasabi for image uploads
4. **Add Real-time**: Integrate Socket.io for real-time chat (already included)
5. **Deploy**: Deploy to your preferred hosting platform

## 📝 Notes

- All endpoints use JWT authentication (except public routes)
- Escrow is automatically released after 14 days
- Database indexes are optimized for common queries
- All inputs are validated using Zod schemas
- Error responses follow a consistent format
- Pagination is available on all list endpoints

## 🐛 Troubleshooting

- **Database connection issues**: Check `DATABASE_URL` in `.env`
- **JWT errors**: Verify `JWT_SECRET` is set
- **Prisma errors**: Run `npm run prisma:generate` after schema changes
- **Port already in use**: Change `PORT` in `.env`
