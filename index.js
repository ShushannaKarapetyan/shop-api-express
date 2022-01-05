import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import cartRoutes from './routes/cart.js';
import stripeRoutes from './routes/stripe.js';
import cors from 'cors';

const app = express();
dotenv.config();

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running!')
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected successfully.'))
    .catch((error) => console.log(error));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/checkout', stripeRoutes);

