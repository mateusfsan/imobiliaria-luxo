import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from './errorHandler.js';

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new HttpError(401, 'NO_TOKEN', 'Token não fornecido');

    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new HttpError(401, 'INVALID_TOKEN', 'Token inválido ou expirado'));
    }
    next(err);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new HttpError(403, 'FORBIDDEN', 'Acesso restrito a administradores'));
  }
  next();
}
