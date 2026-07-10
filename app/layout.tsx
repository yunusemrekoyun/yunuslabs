import type { Metadata } from "next";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import { ScrollMotion } from "../components/ScrollMotion";
import StructuredData from "../components/StructuredData";
import { getSiteUrl } from "../lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = getSiteUrl();
const title = "Yunus Emre Koyun — Full-Stack Developer";
const description =
  "Kullanıcı odaklı arayüzlerden backend mimarisine ve canlı ortam yönetimine kadar ürünün tamamını geliştiren full-stack developer.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Yunus Emre Koyun",
  },
  description,
  applicationName: "Yunus Emre Koyun — Portfolio",
  authors: [{ name: "Yunus Emre Koyun", url: siteUrl }],
  creator: "Yunus Emre Koyun",
  publisher: "Yunus Emre Koyun",
  keywords: [
    "Yunus Emre Koyun",
    "Full-Stack Developer",
    "Software Developer",
    "Next.js",
    "Node.js",
    ".NET",
    "Kütahya",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Yunus Emre Koyun — Portfolio",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${spaceGrotesk.variable} ${bodoniModa.variable}`}>
      <body>
        <StructuredData />
        <ScrollMotion />
        {children}
      </body>
    </html>
  );
}
