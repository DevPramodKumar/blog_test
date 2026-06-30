import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(__dirname, '../.env') });

function maskUri(uri) {
  return uri.replace(/:([^:@/]+)@/, ':****@');
}

async function checkConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is missing in backend/.env');
    process.exit(1);
  }

  console.log('Checking:', maskUri(uri));

  if (!uri.includes('authSource=')) {
    console.warn('Warning: add ?authSource=admin for Docker Mongo root user');
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const result = await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('MongoDB OK:', mongoose.connection.name, result);
    await mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB failed:', error.message);
    console.error('');
    console.error('Fix steps:');
    console.error('1. docker ps | grep mongodb');
    console.error('2. grep MONGODB_URI ~/app/backend/.env');
    console.error('3. Password must match docker-compose MONGO_INITDB_ROOT_PASSWORD');
    console.error('4. Use: mongodb://admin:admin123@127.0.0.1:27017/blog?authSource=admin');
    console.error('5. Test: docker exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.adminCommand({ping:1})"');
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

checkConnection();
