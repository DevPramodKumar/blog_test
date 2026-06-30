import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Post from '../src/models/Post.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(__dirname, '../.env') });

const data = JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf-8'));
const force = process.argv.includes('--force');

function toObjectId(value) {
  return new mongoose.Types.ObjectId(value);
}

function prepareUsers(users) {
  return users.map((user) => ({
    ...user,
    _id: toObjectId(user._id),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  }));
}

function preparePosts(posts) {
  return posts.map((post) => ({
    ...post,
    _id: toObjectId(post._id),
    author: toObjectId(post.author),
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  }));
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const existingUsers = await db.collection('users').countDocuments();
  if (existingUsers > 0 && !force) {
    console.log('Seed skipped: database already has data. Use --force to replace.');
    await mongoose.disconnect();
    return;
  }

  if (force && existingUsers > 0) {
    await db.collection('posts').deleteMany({});
    await db.collection('users').deleteMany({});
    console.log('Cleared existing users and posts.');
  }

  const users = prepareUsers(data.users);
  const posts = preparePosts(data.posts);

  // Use native insert to keep hashed passwords and ObjectIds unchanged.
  await db.collection('users').insertMany(users);
  await db.collection('posts').insertMany(posts);

  await User.syncIndexes();
  await Post.syncIndexes();

  console.log(`Seeded ${users.length} users and ${posts.length} posts into "${db.databaseName}".`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  const uri = process.env.MONGODB_URI || '';
  const masked = uri.replace(/:([^:@/]+)@/, ':****@');

  console.error('Seed failed:', error.message);
  if (error.message.includes('Authentication failed')) {
    console.error('');
    console.error('MongoDB auth error. Check backend/.env MONGODB_URI');
    if (uri) console.error('Current URI:', masked);
    console.error('');
    console.error('Expected (match docker-compose password):');
    console.error('MONGODB_URI=mongodb://admin:admin123@127.0.0.1:27017/blog?authSource=admin');
    console.error('');
    console.error('Test on server:');
    console.error('npm run db:check');
    console.error('docker exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.adminCommand({ping:1})"');
  }
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
