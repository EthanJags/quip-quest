import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import SocketWrapper from "./socketWrapper";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "QuipQuest",
  description: "Where wit meets laughter!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class">
          <ClientProvider>
            <SocketWrapper>{children}</SocketWrapper>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
