import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      role="admin"
      pageTitle="Admin Portal"
      pageSubtitle="Career Services Centre – Redeemer's University"
      userName="Administrator"
    >
      {children}
    </DashboardLayout>
  );
}
