import { auth } from "@/auth";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { redirect } from "next/navigation";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const user = {
    name: session.user.name || "Super Admin",
    email: session.user.email || "",
    role: (session.user as any).role || "SUPER_ADMIN",
  };

  return <DashboardShell user={user as any}>{children}</DashboardShell>;
}
