import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Yeh line globals.css ko link karegi

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wordify - Instant Viral Captions",
  description: "Generate creative social media captions in seconds with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-[#1A202C]`}>
        {children}
      </body>
    </html>
  );
}
