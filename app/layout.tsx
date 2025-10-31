import type { Metadata } from "next";
import "./globals.css";
import { AccountProvider } from "@/contexts/AccountContext";

export const metadata: Metadata = {
  title: "Skillsoft Suite",
  description: "A suite of tools for text-to-speech and lexicon editing",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AccountProvider>
          {children}
        </AccountProvider>
      </body>
    </html>
  );
} 