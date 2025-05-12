import NextAuth from "next-auth"

// Função mock para simular uma requisição de autenticação
async function mockAuthRequest(credentials: Record<string, unknown>) {
  // ... sua lógica de autenticação
  const email = credentials.email as string | undefined;
  const password = credentials.password as string | undefined;

  if (email === "user@example.com" && password === "password") {
    return {
      id: "1",
      name: "Usuário Teste",
      email: "user@example.com",
      role: "user",
      accessToken:
        "...",
    };
  }

  return null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  // ... outras configurações
  trustHost: true, // Para confiar em qualquer host (não recomendado para produção)
  // Ou, para especificar hosts confiáveis:
  // trustHost: (host) => host === 'localhost:3000',
  // ou
  // trustHost: ['localhost:3000', 'meuapp.com'],
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
  if (token?.id && token?.name && token?.email && token?.role && token?.accessToken) {
    session.user.id = token.id;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.role = token.role;
    session.user.accessToken = token.accessToken;
  }

  return session;
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
