import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import Global Error Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Setup __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5300;

// Enable Cross-Origin Resource Sharing for API security
app.use(cors());

// Body Parsers for incoming JSON and urlencoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from /public folder
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// Mount Modular API Endpoint Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Summit Forge Outdoor Engine (Refactored)',
    timestamp: new Date().toISOString()
  });
});

// SPA Catch-All Route Handler
// Redirects all non-API web routes to index.html for Single Page App routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Attach Centralized Error Handling Middleware (must be mounted last)
app.use(errorHandler);

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Summit Forge] Engine active on http://0.0.0.0:${PORT}`);
});

export default app;
