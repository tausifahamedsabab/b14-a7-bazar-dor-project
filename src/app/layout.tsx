import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Suspense } from "react";
import ToastProvider from "./components/ToastProvider";

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
      <body className="flex min-h-screen flex-col bg-[#f0f5f0] text-[#202a22]">
        <Navbar />

        <main className="flex w-full flex-1 flex-col">{children}</main>

        <Footer />

        <Suspense fallback={null}>
          <ToastProvider />
        </Suspense>
      </body>
    </html>
  );
}
