import { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function LauncherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Suspense>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto p-12 bg-background">
        {children}
      </main>
    </div>
  );
}
