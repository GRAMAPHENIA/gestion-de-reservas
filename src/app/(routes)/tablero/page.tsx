import DashboardClient from "@/components/DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Si no hay sesión, redirigimos al inicio de sesión en el server
  if (!userId) {
    redirect("/inicio-de-sesion");
  }

  // Usuario autenticado: renderizamos el cliente interactivo
  return <DashboardClient />;
}
