// Test MongoDB Connection
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.DATABASE_URL;
  
  if (!uri) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
  }

  console.log('🔍 Testing MongoDB connection...');
  console.log('📍 Connection string:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  const client = new MongoClient(uri);

  try {
    console.log('⏳ Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📁 Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   Existing collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    console.log('\n✅ Connection test PASSED!');
    console.log('You can now run: npx prisma db push');
    
  } catch (error) {
    console.error('\n❌ Connection test FAILED!');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication') || error.message.includes('Authentication failed')) {
      console.error('\n💡 Issue: Authentication failed');
      console.error('   - Check your username and password in DATABASE_URL');
      console.error('   - Verify the database user exists in MongoDB Atlas');
    } else if (error.message.includes('network') || error.message.includes('DNS') || error.message.includes('unreachable')) {
      console.error('\n💡 Issue: Network connectivity problem');
      console.error('   Most likely cause: IP address not whitelisted in MongoDB Atlas');
      console.error('\n   Fix steps:');
      console.error('   1. Go to: https://cloud.mongodb.com/');
      console.error('   2. Click "Network Access" (left sidebar)');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Add Current IP Address" (or add 0.0.0.0/0 for testing)');
      console.error('   5. Wait 1-2 minutes, then try again');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Issue: Connection timeout');
      console.error('   - Check your internet connection');
      console.error('   - Verify firewall is not blocking MongoDB');
      console.error('   - Try again in a few moments');
    } else {
      console.error('\n💡 Check:');
      console.error('   - MongoDB Atlas cluster is running');
      console.error('   - Connection string is correct');
      console.error('   - Internet connection is active');
    }
    
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
