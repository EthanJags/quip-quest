import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import SocketWrapper from "./socketWrapper";
import SkyBackground from "./components/SkyBackground";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sketchy Business",
  description: "Where bad art wins big.",
  openGraph: {
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased">
        <ClientProvider>
          <SkyBackground />
          <SocketWrapper>{children}</SocketWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
