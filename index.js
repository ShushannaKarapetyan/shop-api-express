import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

const app = express();
dotenv.config();

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running!')
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected successfully.'))
    .catch((error) => console.log(error));

app.use(express.json())
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

