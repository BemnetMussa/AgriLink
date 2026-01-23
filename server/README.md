# AgriLink Backend API

A comprehensive Node.js + Express backend built with TypeScript for the AgriLink agricultural marketplace platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with OTP support, role-based access control
- **Product Management**: CRUD operations, search, filtering, categorization
- **Order Management**: Multi-vendor order processing with negotiation
- **Payment System**: Escrow-based payments with Chapa/Telebirr integration
- **Reviews & Ratings**: User and product rating system
- **Chat System**: Real-time messaging for order communication
- **Notifications**: In-app notification system
- **Farmer Verification**: Admin-managed verification system
- **Security**: Input validation, rate limiting, encryption, CORS
- **Database**: PostgreSQL with Prisma ORM

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. **Setup database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # (Optional) Seed database
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── security.ts
│   ├── routes/          # API routes
│   ├── services/       # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── review.service.ts
│   │   ├── chat.service.ts
│   │   └── notification.service.ts
│   ├── utils/           # Utility functions
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── validation.ts
│   └── index.ts         # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/otp/request` - Request OTP
- `POST /api/v1/auth/otp/verify` - Verify OTP
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/stats` - Get user statistics

### Products
- `GET /api/v1/products` - List products (with filters)
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (Farmer only)
- `PUT /api/v1/products/:id` - Update product (Farmer only)
- `DELETE /api/v1/products/:id` - Delete product (Farmer only)

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details
- `PATCH /api/v1/orders/:id/status` - Update order status
- `POST /api/v1/orders/:id/negotiate` - Negotiate price

### Payments
- `POST /api/v1/payments/:id/initialize` - Initialize payment
- `GET /api/v1/payments/:id` - Get payment details
- `POST /api/v1/payments/:id/release-escrow` - Release escrow
- `POST /api/v1/payments/webhook` - Payment webhook

### Reviews
- `POST /api/v1/reviews/order/:orderId` - Create review
- `GET /api/v1/reviews/user/:userId` - Get user reviews
- `GET /api/v1/reviews/product/:productId` - Get product reviews

### Chat
- `POST /api/v1/chat/order/:orderId/messages` - Send message
- `GET /api/v1/chat/order/:orderId/messages` - Get messages
- `GET /api/v1/chat/conversations` - Get conversations

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `GET /api/v1/notifications/unread-count` - Get unread count

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Zod schema validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Password Hashing**: bcrypt for password encryption
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 💾 Database

The project uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Users with roles (FARMER, BUYER, ADMIN)
- **Product**: Product listings
- **Order**: Orders with items
- **Payment**: Payments with escrow
- **Review**: Ratings and reviews
- **Message**: Chat messages
- **Notification**: User notifications

## 🧪 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run prisma:studio
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🔄 Escrow System

The payment system implements an escrow mechanism:
1. Payment is held in escrow when order is placed
2. Payment is released to farmer after delivery confirmation
3. Auto-release after 14 days if no dispute
4. Refund capability for cancelled orders

## 📊 Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for list endpoints
- Efficient Prisma queries with selective includes
- Connection pooling via Prisma

## 🐛 Error Handling

All errors are handled centrally with appropriate HTTP status codes:
- 400: Validation errors
- 401: Authentication errors
- 403: Authorization errors
- 404: Not found errors
- 409: Conflict errors
- 500: Server errors

## 📄 License

MIT License
