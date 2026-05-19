import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/make-admin.js <email>');
  process.exit(1);
}

await mongoose.connect(env.mongoUri);
const result = await User.updateOne({ email: email.toLowerCase() }, { role: 'admin' });

if (result.matchedCount === 0) {
  console.error(`Usuario nao encontrado: ${email}`);
  process.exit(1);
}

console.log(`OK: ${email} agora e admin`);
await mongoose.disconnect();
