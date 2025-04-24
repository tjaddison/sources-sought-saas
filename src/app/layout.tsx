import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", 
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GovBiz Agent - The Secret Weapon for Federal Contractors",
  description: "AI-powered platform that helps federal contractors discover, compete for, and win more government contracts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
