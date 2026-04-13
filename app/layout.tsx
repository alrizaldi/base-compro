import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { fetchAboutContent } from "@/app/about/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const about = await fetchAboutContent();

  const siteName = about?.logoText || "YourBrand";
  const defaultTitle = about?.heroTitle || "Premium Tech Essentials";
  const defaultDescription =
    about?.heroSubtitle ||
    "Curated collection of high-quality tech accessories designed to elevate your workspace and daily life.";

  const baseMetadata: Metadata = {
    title: {
      default: `${siteName} - ${defaultTitle}`,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
  };

  if (about?.logoUrl) {
    baseMetadata.icons = {
      icon: about.logoUrl,
      apple: about.logoUrl,
    };
  }

  return baseMetadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
