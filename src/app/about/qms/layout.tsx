import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quality Management System | UVTAB",
  description:
    "Access UVTAB's Quality Management System documents including policies, procedures, manuals, and quality-related documentation.",
  openGraph: {
    title: "UVTAB Quality Management System",
    description:
      "Access UVTAB's QMS policies, procedures, and quality documentation. Download or preview documents directly.",
    type: "website",
    siteName: "Uganda Vocational and Technical Assessment Board",
    images: [
      {
        url: "/uvtablogo.png",
        width: 400,
        height: 400,
        alt: "UVTAB Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "UVTAB Quality Management System",
    description:
      "Access UVTAB's QMS policies, procedures, and quality documentation.",
    images: ["/uvtablogo.png"],
  },
};

export default function QMSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
