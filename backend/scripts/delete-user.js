import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/delete-user.js <email>');
  process.exit(1);
}

await mongoose.connect(env.mongoUri);
const result = await User.deleteOne({ email: email.toLowerCase() });

if (result.deletedCount === 0) {
  console.error(`Usuario nao encontrado: ${email}`);
  process.exit(1);
}

console.log(`OK: ${email} removido`);
await mongoose.disconnect();
