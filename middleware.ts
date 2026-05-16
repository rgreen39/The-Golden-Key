import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  matcher: ['/checklist/:path*', '/weekly/:path*', '/shopping/:path*', '/dreams/:path*'],
}
