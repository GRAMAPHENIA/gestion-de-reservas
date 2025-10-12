import { clerkMiddleware } from '@clerk/nextjs/server';

// Use clerkMiddleware so server-side auth() works in server components.
export default clerkMiddleware({
  // You can add configuration here if necessary
});

// Configure matcher: protect dashboard pages and dashboard API routes.
// Exclude Next internals and public assets.
export const config = {
  matcher: [
    '/tablero/:path*',
    '/api/dashboard/:path*',
  ],
};
