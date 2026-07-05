import { auth } from "@/auth";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name || "Nasabah",
    email: session.user.email || "",
    role: (session.user as any).role || "USER",
  };

  return <DashboardShell user={user as any}>{children}</DashboardShell>;
}
