import { RateLimiterMongo } from "rate-limiter-flexible";
import mongoose from "mongoose";

let limiter;
export function getLimiter() {
  if (limiter) return limiter;
  limiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: "rl",
    points: 60,       // 60 requests
    duration: 600,    // per 10 minutes
  });
  return limiter;
}
