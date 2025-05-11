import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  // Verificação adicional de segurança
  if (!session || !session.user) {
    redirect("/login")
  }

  const user = session.user

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </header>
      <main className="container flex-1 px-4 py-8">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>Informações do usuário logado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Nome:</div>
                <div className="col-span-2">{user.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{user.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Função:</div>
                <div className="col-span-2 capitalize">{user.role}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{user.id}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">Token JWT disponível na sessão</div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
