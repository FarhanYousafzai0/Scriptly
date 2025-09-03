import { RateLimiterMongo } from "rate-limiter-flexible";
import mongoose from "mongoose";

let limiter;

export function getLimiter() {
  if (limiter) return limiter;
  
  // Check if MongoDB connection is ready
  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB not connected, using memory-based rate limiting");
    // Fallback to memory-based rate limiting if MongoDB is not connected
    return {
      consume: async () => {
        // Simple memory-based rate limiting
        return Promise.resolve();
      }
    };
  }
  
  limiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: "rl",
    points: parseInt(process.env.RATE_LIMIT_POINTS) || 60,       // 60 requests
    duration: parseInt(process.env.RATE_LIMIT_DURATION) || 600,   // per 10 minutes
    blockDuration: 60, // Block for 1 minute if limit exceeded
  });
  
  return limiter;
}
