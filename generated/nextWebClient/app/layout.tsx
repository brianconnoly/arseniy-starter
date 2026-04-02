import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Веб-приложение",
  description: "Next.js клиент (specs/workspace.c4 — webApp.nextWebClient)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
