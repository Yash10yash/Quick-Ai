import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan

export const auth = async (req, res, next)=>{
    try {
        // Check if Clerk secret key is configured
        if (!process.env.CLERK_SECRET_KEY) {
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error: CLERK_SECRET_KEY is not set' 
            });
        }

        // Get authentication info
        const authInfo = await req.auth();
        
        if (!authInfo || !authInfo.userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required. Please sign in to continue.' 
            });
        }

        const {userId, has} = authInfo;
        const hasPremiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        } else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next()
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        // Handle specific Clerk errors
        if (error.status === 401 || error.status === 403) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication failed. Please sign in again.' 
            });
        }
        
        // Generic error
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Authentication error occurred' 
        });
    }
}