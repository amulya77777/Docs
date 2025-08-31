// import { clerkMiddleware } from '@clerk/nextjs/server';
// // Allow the Liveblocks auth endpoint to be accessed without Clerk middleware redirects.
// // The route itself performs authorization and returns proper JSON 401s.
// export default clerkMiddleware({
//   publicRoutes: ['/api/liveblocks-auth'],
// });
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };
// middleware.ts — Clerk v5
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes (no auth). Keep your Liveblocks auth public; it returns JSON itself.
const isPublicRoute = createRouteMatcher([
  '/api/liveblocks-auth',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/', // optional
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // NOTE: protect() is on `auth`, not on the result of `await auth()`
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals & static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
