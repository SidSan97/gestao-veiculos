import type { Metadata } from "next";
import { SidebarLayout } from "./components/sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "fastbootstrap/dist/css/fastbootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Swal from 'sweetalert2'

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
      <body className="">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
