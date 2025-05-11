import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Verificar se o usuário está tentando acessar uma rota protegida
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard")

  // Verificar se o usuário está tentando acessar a página de login
  const isAuthRoute = nextUrl.pathname.startsWith("/login")

  // Se o usuário não estiver logado e estiver tentando acessar uma rota protegida
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Se o usuário estiver logado e estiver tentando acessar a página de login
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
