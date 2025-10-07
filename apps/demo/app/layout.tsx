import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jiggle Demo",
  description: "Just smash that! don't ask!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
