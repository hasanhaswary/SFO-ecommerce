import express from'express';
import 'dotenv/config';
import usersRouter from './models/routes/users.js';
import productsRouter from './models/routes/products.js';
import ordersRouter from './models/routes/orders.js';
import orderItemsRouter from './models/routes/order-items.js';

const app = express();
app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/order-items', orderItemsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server runnning on port ${PORT}'));