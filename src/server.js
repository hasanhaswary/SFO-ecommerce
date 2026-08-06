import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5300;

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON and urlencoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from /public folder and /src/assets
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));
app.use('/src/assets', express.static(path.join(process.cwd(), 'src', 'assets')));
app.use('/assets', express.static(path.join(process.cwd(), 'src', 'assets')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Summit Forge Outdoor Engine',
    timestamp: new Date().toISOString()
  });
});

// SPA catch-all fallback handler for frontend routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Mount centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Summit Forge] Engine active on http://0.0.0.0:${PORT}`);
});

export default app;
