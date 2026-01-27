# MongoDB Setup Guide

## ✅ Your Database is MongoDB

I've converted the Prisma schema to work with MongoDB. Here's what changed:

1. **Changed datasource** from `postgresql` to `mongodb`
2. **Updated all ID fields** to use MongoDB ObjectId (`@default(auto()) @db.ObjectId`)
3. **Updated all foreign key fields** to use `@db.ObjectId`
4. **Updated .env** with MongoDB connection string format

## 🚀 Quick Setup Steps

### Step 1: Update .env with Your MongoDB Connection String

Edit `.env` file and set your MongoDB connection string:

**For Local MongoDB:**
```env
DATABASE_URL="mongodb://localhost:27017/agrilink"
```

**For MongoDB Atlas (Cloud):**
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/agrilink?retryWrites=true&w=majority"
```



Replace:
- `username` - Your MongoDB username
- `password` - Your MongoDB password
- `cluster.mongodb.net` - Your cluster URL
- `agrilink` - Database name (or use your existing database name)

**For MongoDB with Authentication:**
```env
DATABASE_URL="mongodb://username:password@localhost:27017/agrilink?authSource=admin"
```

### Step 2: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 3: Push Schema to Database (MongoDB doesn't use migrations)
```bash
npx prisma db push
```

This will create the collections in your MongoDB database.

### Step 4: (Optional) Seed Database
```bash
npm run prisma:seed
```

### Step 5: Start Server
```bash
npm run dev
```

## 📝 Important Notes for MongoDB

1. **No Migrations**: MongoDB doesn't use migrations like PostgreSQL. Use `prisma db push` instead of `prisma migrate`.

2. **ObjectId**: All IDs are now MongoDB ObjectIds instead of UUIDs.

3. **Relations**: Prisma handles MongoDB relations using references (similar to foreign keys but stored as ObjectId strings).

4. **Collections**: Collections will be created automatically when you run `prisma db push`.

## 🔧 Update package.json Scripts

I should update the scripts to use `db push` instead of `migrate` for MongoDB. Let me do that:

```json
"prisma:push": "prisma db push",
"prisma:migrate": "prisma db push"  // For MongoDB, use push instead
```

## ✅ Testing Connection

After updating DATABASE_URL, test the connection:

```bash
npm run prisma:generate
npx prisma db push
```

If successful, you'll see:
```
✔ Generated Prisma Client
✔ The database is now in sync with your Prisma schema.
```

Then start the server:
```bash
npm run dev
```

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Check your MongoDB username and password
- For Atlas, make sure your IP is whitelisted
- Check the connection string format

### Error: "Cannot connect to MongoDB"
- Make sure MongoDB is running (if local)
- Check the host and port in connection string
- For Atlas, verify the cluster URL

### Error: "Database not found"
- MongoDB will create the database automatically
- Just make sure the connection string is correct

## 📋 Your MongoDB Connection String Format

**Local MongoDB (no auth):**
```
mongodb://localhost:27017/agrilink
```

**Local MongoDB (with auth):**
```
mongodb://username:password@localhost:27017/agrilink?authSource=admin
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/agrilink?retryWrites=true&w=majority
```

Replace the values with your actual MongoDB credentials!
