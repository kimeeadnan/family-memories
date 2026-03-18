import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen bg-sky-50 text-sky-900 antialiased">
        {children}
      </body>
    </html>
  );
}
