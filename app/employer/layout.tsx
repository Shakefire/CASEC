import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      role="employer"
      pageTitle="Employer Portal"
      pageSubtitle="Manage your opportunities and applications"
      userName="Employer"
    >
      {children}
    </DashboardLayout>
  );
}
