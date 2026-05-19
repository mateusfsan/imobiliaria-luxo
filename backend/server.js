import express from 'express';
import cors from 'cors';
import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { authRoutes } from './src/routes/auth.js';
import { propertyRoutes } from './src/routes/properties.js';

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'imobiliaria-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Rota nao encontrada' } });
});

app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`[api] rodando em http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('[api] falha ao iniciar:', err.message);
    process.exit(1);
  }
}

start();
