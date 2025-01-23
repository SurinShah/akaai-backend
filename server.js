import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import morgan from 'morgan';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// CORS Configuration
const allowedOrigins = ['https://akaai.vercel.app/']; // Replace with your frontend's deployed URL
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies or headers
}));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve Frontend Static Files in Production
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist'))); // Adjust if your build folder is different
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
}

// Root Endpoint
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

// Start Server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
