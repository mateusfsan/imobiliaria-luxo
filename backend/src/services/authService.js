import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from '../middlewares/errorHandler.js';

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpires }
  );
}

export async function register({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(409, 'EMAIL_IN_USE', 'E-mail já cadastrado');

  const user = await User.create({ name, email, password });
  const token = signToken(user);
  return { user: user.toPublic(), token };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Credenciais inválidas');

  const ok = await user.comparePassword(password);
  if (!ok) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Credenciais inválidas');

  const token = signToken(user);
  return { user: user.toPublic(), token };
}
