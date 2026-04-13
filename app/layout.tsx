import type { Metadata } from "next";
import { MockAuthProvider } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASEC Career Portal",
  description: "University, Nigeria Career Services Centre unified portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MockAuthProvider>{children}</MockAuthProvider>
      </body>
    </html>
  );
}
