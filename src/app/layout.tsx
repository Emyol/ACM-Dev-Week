import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Cha-Ching",
  description: "Your friendly, bouncy Filipino-first financial companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${instrumentSerif.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-ct-bg text-ct-ink">
        {children}
      </body>
    </html>
  );
}
