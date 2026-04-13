import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      role="student"
      pageTitle="Student Portal"
      pageSubtitle="Access career opportunities and resources"
      userName="Student User"
    >
      {children}
    </DashboardLayout>
  );
}
