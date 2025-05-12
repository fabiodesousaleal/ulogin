import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    role: string;
    accessToken: string;
  }

  interface Session extends DefaultSession {
    user?: { // Tornando a propriedade 'user' opcional
      id?: string; // Tornando 'id' opcional
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Tornando 'role' opcional
      accessToken?: string; // Tornando 'accessToken' opcional
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}