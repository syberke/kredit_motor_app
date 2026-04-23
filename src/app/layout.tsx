import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Kredit Motor Online",
  description: "Ajukan kredit motor dengan mudah & cepat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}