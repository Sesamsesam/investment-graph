import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investment Graph – Compound Growth Visualizer",
  description:
    "Interactive chart showing how 5,000 DKK/month grows over 20 years at 0%, 7%, 20%, 30%.",
  openGraph: {
    title: "Investment Graph – Compound Growth Visualizer",
    description:
      "Interactive chart showing how 5,000 DKK/month grows over 20 years at 0%, 7%, 20%, 30%.",
    url: "https://sesamsesam.github.io/investment-graph/",
    siteName: "Investment Graph",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Graph – Compound Growth Visualizer",
    description:
      "Interactive chart showing how 5,000 DKK/month grows over 20 years at 0%, 7%, 20%, 30%.",
  },
};

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
