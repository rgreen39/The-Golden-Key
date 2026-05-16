import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Golden Key",
  description: "אפליקציה לשיפור הרגלי תזונה ואכילה מודעת",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-heebo bg-cream text-dark-gray min-h-screen">
        <SessionProviderWrapper>
          <Navbar />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
