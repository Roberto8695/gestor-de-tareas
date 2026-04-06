import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestor de Tareas",
  description: "Una aplicación moderna para gestionar tus tareas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex justify-center min-h-screen antialiased bg-[#0B0F19] text-white m-0 font-sans">
        <div className="w-full max-w-[420px] bg-[#1C2333] min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
