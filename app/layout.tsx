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
  metadataBase: new URL("https://personal-portfolio-21265.ke4773613.chatgpt.site"),
  title: "Smartrick — Technical Artist",
  description:
    "Smartrick is an emerging Technical Artist exploring Unity, shaders, C# tooling, AI-assisted workflows, and real-time rendering.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Smartrick — Technical Artist",
    description: "Art × Code × AI. A real-time graphics portfolio in progress.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1680,
        height: 945,
        alt: "Smartrick Technical Artist portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smartrick — Technical Artist",
    description: "Art × Code × AI. A real-time graphics portfolio in progress.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
