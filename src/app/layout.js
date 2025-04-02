// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/Components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nextask",
  description: "Project management made easy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
