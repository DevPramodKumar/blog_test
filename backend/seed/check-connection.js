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

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const result = await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('MongoDB OK:', mongoose.connection.name, result);
    await mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

checkConnection();
