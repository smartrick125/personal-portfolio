import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://personal-portfolio-21265.ke4773613.chatgpt.site";

// Geist is self-hosted from `public/fonts` and declared in `globals.css`;
// see the note there for why `next/font/google` is not used.
const preloadedFonts = ["/fonts/geist-latin.woff2", "/fonts/geist-mono-latin.woff2"];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Smartrick — Technical Artist",
  description:
    "Smartrick is an emerging Technical Artist exploring Unity, shaders, C# tooling, AI-assisted workflows, and real-time rendering.",
  keywords: [
    "Technical Artist",
    "Unity",
    "Shader Graph",
    "HLSL",
    "URP",
    "Real-time rendering",
    "VFX",
    "C#",
    "Portfolio",
  ],
  authors: [{ name: "Smartrick", url: "https://github.com/smartrick125" }],
  creator: "Smartrick",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Smartrick — Technical Artist",
    description: "Art × Code × AI. A real-time graphics portfolio in progress.",
    type: "website",
    url: "/",
    siteName: "Smartrick — Technical Artist",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 676,
        alt: "Smartrick Technical Artist portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smartrick — Technical Artist",
    description: "Art × Code × AI. A real-time graphics portfolio in progress.",
    images: ["/og.jpg"],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Smartrick",
  url: siteUrl,
  image: `${siteUrl}/profile/smartrick-portrait.jpg`,
  jobTitle: "Technical Artist",
  email: "mailto:ke4773613@gmail.com",
  description:
    "Emerging Technical Artist working with Unity, Shader Graph, HLSL, C# tooling, and URP real-time rendering.",
  knowsAbout: [
    "Unity",
    "Shader Graph",
    "HLSL",
    "Universal Render Pipeline",
    "Real-time VFX",
    "C# tooling",
  ],
  sameAs: ["https://github.com/smartrick125"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {preloadedFonts.map((href) => (
          <link
            key={href}
            rel="preload"
            as="font"
            type="font/woff2"
            href={href}
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <a className="skip-link" href="#profile">
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
