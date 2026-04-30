import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "./globals.css";

const dotGothic16 = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot-gothic",
});

export const metadata: Metadata = {
  title: "Soccer Growth RPG",
  description: "現実のサッカー練習記録をRPG体験に変換する育成管理アプリ",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${dotGothic16.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-white font-dotGothic">
        {children}
      </body>
    </html>
  );
}
