import { auth } from "@/auth";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const user = {
    name: session.user.name || "Admin",
    email: session.user.email || "",
    role: (session.user as any).role || "ADMIN",
  };

  return <DashboardShell user={user as any}>{children}</DashboardShell>;
}
