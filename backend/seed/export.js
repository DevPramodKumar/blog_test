import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(__dirname, '../.env') });

async function exportData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  const posts = await db.collection('posts').find({}).toArray();

  const outputPath = join(__dirname, 'data.json');
  writeFileSync(outputPath, `${JSON.stringify({ users, posts }, null, 2)}\n`);

  console.log(`Exported ${users.length} users and ${posts.length} posts to ${outputPath}`);
  await mongoose.disconnect();
}

exportData().catch(async (error) => {
  console.error('Export failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
