import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রতিদিনের বাজারদর এক নজরে",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#f0f5f0] text-[#202a22]">
        <Navbar />

        {children}

        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
