import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })

        if (!res.ok) return null

        const data = await res.json()

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          backendToken: data.token,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.backendToken = (user as unknown as { backendToken: string }).backendToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? ""
      }
      session.backendToken = token.backendToken ?? ""
      return session
    },
  },
})

declare module "next-auth" {
  interface Session {
    backendToken: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    backendToken: string
  }
}
