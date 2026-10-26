import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salão da Barbie",
  description: "Curso profissionalizante temático do universo Barbie.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
