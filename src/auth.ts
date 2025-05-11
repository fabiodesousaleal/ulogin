import NextAuth from "next-auth"

// Estendendo os tipos para incluir informações personalizadas
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      accessToken: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    role: string
    accessToken: string
  }
}

// Função mock para simular uma requisição de autenticação
async function mockAuthRequest(credentials: Record<string, string>) {
  // Simulando uma requisição para um servidor de autenticação
  // Em um cenário real, isso seria uma chamada API para seu backend

  // Verificação básica de credenciais
  if (credentials.email === "user@example.com" && credentials.password === "password") {
    return {
      id: "1",
      name: "Usuário Teste",
      email: "user@example.com",
      role: "user",
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlVzdcOhcmlvIFRlc3RlIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    }
  }

  return null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Callback para personalizar o JWT
    async jwt({ token, user }) {
      // Quando o usuário faz login, adiciona os dados ao token
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.accessToken = user.accessToken
      }

      return token
    },

    // Callback para personalizar a sessão
    async session({ session, token }) {
      // Adiciona os dados do token à sessão
      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      session.user.role = token.role
      session.user.accessToken = token.accessToken

      return session
    },
  },
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Chama a função mock para simular autenticação
        const user = await mockAuthRequest(credentials)

        if (!user) {
          return null
        }

        return user
      },
    },
  ],
})
