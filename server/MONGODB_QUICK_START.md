# 🚀 MongoDB Quick Start

## ✅ Schema Converted to MongoDB!

I've successfully converted your Prisma schema from PostgreSQL to MongoDB. Here's what to do next:

## Step 1: Update .env with Your MongoDB Connection String

Edit the `.env` file and update the `DATABASE_URL`:

### For Local MongoDB:
```env
DATABASE_URL="mongodb://localhost:27017/agrilink"
```

### For MongoDB Atlas (Cloud):
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/agrilink?retryWrites=true&w=majority"
```

**Replace:**
- `username` - Your MongoDB username
- `password` - Your MongoDB password  
- `cluster.mongodb.net` - Your actual cluster URL
- `agrilink` - Your database name (or keep it as is)

### For MongoDB with Authentication:
```env
DATABASE_URL="mongodb://username:password@localhost:27017/agrilink?authSource=admin"
```

## Step 2: Push Schema to MongoDB

MongoDB doesn't use migrations. Instead, use `db push`:

```bash
npx prisma db push
```

This will:
- Create all collections in your MongoDB database
- Set up indexes
- Configure the schema

## Step 3: (Optional) Seed Database

```bash
npm run prisma:seed
```

This will create:
- Admin user (phone: `911111111`, password: `admin123`)
- Farmer user (phone: `922222222`, password: `farmer123`)
- Buyer user (phone: `933333333`, password: `buyer123`)
- Sample products

## Step 4: Start Server

```bash
npm run dev
```

The server should now connect to your MongoDB database! 🎉

## 📋 What Changed

1. ✅ Datasource changed from `postgresql` to `mongodb`
2. ✅ All IDs now use MongoDB ObjectId (`@default(auto()) @db.ObjectId`)
3. ✅ All foreign keys use `@db.ObjectId`
4. ✅ Prisma Client generated successfully
5. ✅ Removed duplicate indexes (MongoDB handles `@unique` automatically)

## 🔍 Verify Connection

After updating `.env`, test the connection:

```bash
npx prisma db push
```

If successful, you'll see:
```
✔ The database is now in sync with your Prisma schema.
```

## 🐛 Troubleshooting

### "Authentication failed"
- Check username/password in connection string
- For Atlas: Make sure IP is whitelisted
- Check connection string format

### "Cannot connect"
- Verify MongoDB is running (if local)
- Check host/port in connection string
- For Atlas: Verify cluster URL

### "Database not found"
- MongoDB creates databases automatically
- Just ensure connection string is correct

## 📝 Connection String Examples

**Local (no auth):**
```
mongodb://localhost:27017/agrilink
```

**Local (with auth):**
```
mongodb://admin:password123@localhost:27017/agrilink?authSource=admin
```

**MongoDB Atlas:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/agrilink?retryWrites=true&w=majority
```

**MongoDB Atlas (with options):**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/agrilink?retryWrites=true&w=majority&appName=AgriLink
```

## ✅ Next Steps

1. Update `.env` with your MongoDB connection string
2. Run: `npx prisma db push`
3. (Optional) Run: `npm run prisma:seed`
4. Run: `npm run dev`

Your backend will now use MongoDB! 🎊
