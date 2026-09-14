import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VACANZA | חופשות בהתאמה אישית",
    template: "%s | VACANZA",
  },

  description:
    "VACANZA מתכננת עבורכם חופשות בהתאמה אישית — טיסות, מלונות, רכב, משחקים, הופעות וכל הפרטים הקטנים שעושים את ההבדל.",

  applicationName: "VACANZA",

  keywords: [
    "VACANZA",
    "Vacanza Travel",
    "חופשות",
    "חופשות בהתאמה אישית",
    "תכנון חופשה",
    "טיסות",
    "מלונות",
    "חבילות נופש",
    "חופשות בחו״ל",
  ],

  authors: [{ name: "VACANZA" }],
  creator: "VACANZA",
  publisher: "VACANZA",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "VACANZA",
    title: "VACANZA | חופשות בהתאמה אישית",
    description:
      "החופשה שלכם, בדיוק כמו שאתם רוצים. טיסות, מלונות וכל הפרטים הקטנים — במקום אחד.",
  },

  twitter: {
    card: "summary_large_image",
    title: "VACANZA | חופשות בהתאמה אישית",
    description:
      "החופשה שלכם, בדיוק כמו שאתם רוצים. טיסות, מלונות וכל הפרטים הקטנים — במקום אחד.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}