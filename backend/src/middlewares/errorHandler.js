import { ZodError } from 'zod';
import multer from 'multer';

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos',
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof multer.MulterError) {
    const map = {
      LIMIT_FILE_SIZE: 'Arquivo excede 8MB',
      LIMIT_FILE_COUNT: 'Máximo de 20 imagens por upload',
      LIMIT_UNEXPECTED_FILE: 'Campo de arquivo inesperado',
    };
    return res.status(400).json({
      error: {
        code: err.code,
        message: map[err.code] || 'Falha no upload',
      },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: { code: 'INVALID_ID', message: 'ID inválido' },
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: { code: 'DUPLICATE', message: 'Recurso duplicado' },
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Erro interno do servidor',
    },
  });
}

export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
