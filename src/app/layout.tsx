import type { Metadata } from "next";
import {
  Caveat,
  Permanent_Marker,
  Playfair_Display,
  Source_Sans_3,
} from "next/font/google";
import AppBackground from "@/components/AppBackground";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const markerFont = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-marker",
  weight: "400",
});

/** Book photo captions — flowing handwritten (Caveat) */
const handwritingFont = Caveat({
  subsets: ["latin"],
  variable: "--font-pencil",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Family Memories",
  description: "Our family photo albums",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${bodyFont.variable} ${markerFont.variable} ${handwritingFont.variable}`}
    >
      <body className="relative min-h-screen">
        <AppBackground />
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
