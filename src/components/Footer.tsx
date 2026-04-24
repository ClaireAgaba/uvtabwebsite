import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "Circulars", href: "/circulars" },
  { label: "Summary Sheets", href: "/assessment/summary-sheets" },
  { label: "Timetables", href: "/assessment/timetable" },
  { label: "News & Stories", href: "/media/news" },
];

const importantLinks = [
  { label: "EIMS Portal", href: "https://eims.uvtab.go.ug", external: true },
  { label: "Tenders", href: "/tenders" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/support/contact" },
];

export default function Footer() {
  return (
    <footer className="relative">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%]">
        <svg viewBox="0 0 1440 80" className="w-full h-auto">
          <path
            fill="#1A237E"
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>

      <div className="bg-uvtab-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/uvtab-logo.png"
                  alt="UVTAB"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-bold text-sm">UVTAB</p>
                  <p className="text-xs text-white/70">Uganda Vocational and Technical Assessment Board</p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Assessment & Certification of competences obtained through
                Formal & Informal TVET and Development of Training Packages & 
                Curriculum
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-uvtab-gold-light mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-uvtab-gold/50 group-hover:bg-uvtab-gold transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h3 className="font-semibold text-uvtab-gold-light mb-4 text-sm uppercase tracking-wider">
                Important Links
              </h3>
              <ul className="space-y-2.5">
                {importantLinks.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-uvtab-gold/50 group-hover:bg-uvtab-gold transition-colors" />
                        {link.label}
                        <ExternalLink size={12} className="opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-uvtab-gold/50 group-hover:bg-uvtab-gold transition-colors" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-uvtab-gold-light mb-4 text-sm uppercase tracking-wider">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-uvtab-gold" />
                  <span>
                    Plot 891 Kigobe Road Kyambogo
                    <br />
                    P.O Box 1499, Kampala
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <Phone size={16} className="shrink-0 text-uvtab-gold" />
                  <span>0392002468</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <Mail size={16} className="shrink-0 text-uvtab-gold" />
                  <span>info@uvtab.go.ug</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider & Copyright */}
          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} UVTAB. All Rights Reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-white/50">
              <Image
                src="/uvtab-logo.png"
                alt=""
                width={16}
                height={16}
                className="rounded-full opacity-50"
              />
              Uganda Vocational and Technical Assessment Board
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
