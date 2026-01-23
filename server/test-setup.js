// Simple test script to check if backend can start
// Run with: node test-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Backend Setup...\n');

// Check 1: Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check 2: .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('DATABASE_URL=')) {
    console.log('✅ DATABASE_URL found in .env');
  } else {
    console.log('⚠️  DATABASE_URL not found in .env');
  }
} else {
  console.log('❌ .env file not found');
}

// Check 3: node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules exists');
} else {
  console.log('❌ node_modules not found - run: npm install');
}

// Check 4: Prisma Client
const prismaPath = path.join(__dirname, 'node_modules', '.prisma');
if (fs.existsSync(prismaPath)) {
  console.log('✅ Prisma Client generated');
} else {
  console.log('⚠️  Prisma Client not generated - run: npm run prisma:generate');
}

// Check 5: TypeScript
try {
  require.resolve('typescript');
  console.log('✅ TypeScript installed');
} catch (e) {
  console.log('❌ TypeScript not found');
}

// Check 6: tsx
try {
  require.resolve('tsx');
  console.log('✅ tsx installed');
} catch (e) {
  console.log('❌ tsx not found - run: npm install');
}

// Check 7: Express
try {
  require.resolve('express');
  console.log('✅ Express installed');
} catch (e) {
  console.log('❌ Express not found');
}

// Check 8: Prisma
try {
  require.resolve('@prisma/client');
  console.log('✅ @prisma/client installed');
} catch (e) {
  console.log('❌ @prisma/client not found');
}

// Check 9: logs directory
const logsPath = path.join(__dirname, 'logs');
if (fs.existsSync(logsPath)) {
  console.log('✅ logs directory exists');
} else {
  console.log('⚠️  logs directory not found (will be created automatically)');
}

console.log('\n📋 Summary:');
console.log('If all checks pass, you can run: npm run dev');
console.log('If any checks fail, see README_START.md for setup instructions');
