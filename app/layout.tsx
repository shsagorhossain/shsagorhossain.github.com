import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sagor Hossain | Full Stack Developer",
  description:
    "Portfolio of Sagor Hossain, a full stack developer building modern, scalable web applications.",
  keywords: [
    "Sagor Hossain",
    "Full Stack Developer",
    "Python",
    "Django",
    "React",
    "Next.js",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
