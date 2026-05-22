import { withAuth } from 'next-auth/middleware';

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/subscriptions/:path*',
    '/budgets/:path*',
    '/settings/:path*'
  ],
};
