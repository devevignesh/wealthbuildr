import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import NavTabs from "@/components/nav-tabs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const GOOGLE_ANALYTICS_ID = process.env.GA4_ANALYTICS_ID;

const title = "Wealthbuildr | Your Journey to Financial Abundance";
const description =
  "Wealthbuildr is your personal guide through the four phases of wealth building - Accumulation, Growth, Independent, and Abundant.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@devevignesh",
    images: ["https://wealthbuildr.vercel.app/og.jpg"]
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: ["https://wealthbuildr.vercel.app/og.jpg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: "#09090b"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <main>
          <div className="min-h-screen w-full bg-gray-50">
            <div className="sticky left-0 right-0 top-0 z-20 border-b border-gray-200 bg-white">
              <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="block tracking-tight text-xl sm:text-2xl text-slate-900"
                    >
                      wealthbuildr
                    </Link>
                  </div>
                </div>
                <NavTabs />
              </div>
            </div>
            {children}
          </div>
        </main>
        <Toaster />
      </body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', '${GOOGLE_ANALYTICS_ID}');
					`}
      </Script>
    </html>
  );
}
