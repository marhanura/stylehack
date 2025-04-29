import type { Metadata } from "next";
import { Rubik, Bodoni_Moda, Bodoni_Moda_SC } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

const bodoniModaSC = Bodoni_Moda_SC({
  variable: "--font-bodoni-moda-sc",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StyleHack",
  description: "Hack Your Style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} ${bodoniModa.variable} ${bodoniModaSC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
