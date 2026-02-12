import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

await connectCloudinary()

// CORS configuration to allow credentials and Authorization header
app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Check if CLERK_SECRET_KEY is set
if (!process.env.CLERK_SECRET_KEY) {
    console.warn('⚠️  WARNING: CLERK_SECRET_KEY is not set in environment variables');
    console.warn('   Authentication will not work properly. Please set CLERK_SECRET_KEY in your .env file');
}

app.use(clerkMiddleware())

app.get('/', (req, res)=>res.send('Server is Live!'))

// Health check endpoint that doesn't require auth
app.get('/health', async (req, res) => {
    try {
        const hasAuth = await req.auth();
        res.json({ 
            success: true, 
            authenticated: !!hasAuth,
            clerkConfigured: !!process.env.CLERK_SECRET_KEY
        });
    } catch (error) {
        res.json({ 
            success: true, 
            authenticated: false,
            clerkConfigured: !!process.env.CLERK_SECRET_KEY,
            error: error.message
        });
    }
});

// Routes are protected by their own auth middleware, so we don't need global requireAuth
// This prevents 403 errors with no body

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})