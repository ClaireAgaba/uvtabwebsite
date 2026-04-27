import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TawkTo from "@/components/TawkTo";

export const metadata: Metadata = {
  title: {
    default: "UVTAB | Uganda Vocational and Technical Assessment Board",
    template: "%s | UVTAB",
  },
  description:
    "Regulating, coordinating and conducting credible, fair and valid assessments for vocational and technical education in Uganda.",
  keywords: [
    "UVTAB",
    "Uganda",
    "vocational",
    "technical",
    "assessment",
    "education",
    "TVET",
  ],
  icons: {
    icon: "/uvtablogo.png",
    apple: "/uvtablogo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    siteName: "UVTAB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <TawkTo />
      </body>
    </html>
  );
}
