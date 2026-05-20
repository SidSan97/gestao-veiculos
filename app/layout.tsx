import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarLayout } from "./components/sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
  title: "Gestão de Veículos",
  description: "Sistema de gestão de veículos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
    >
      <body className="min-vh-100">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
