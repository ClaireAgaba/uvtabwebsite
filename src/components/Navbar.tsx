"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About UVTAB", href: "/about" },
      { label: "Board Members", href: "/about/board-members" },
      { label: "Top Management", href: "/about/top-management" },
      { label: "Board Functions", href: "/about/board-functions" },
      { label: "Legal Framework", href: "/about/legal-framework" },
      { label: "QMS", href: "/about/qms" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Document Verification", href: "/services/verification" },
      { label: "Equating", href: "/services/equating" },
      { label: "Centers", href: "/services/centers" },
    ],
  },
  {
    label: "Assessment",
    children: [
      { label: "Programs", href: "/assessment/programs" },
      { label: "Timetable", href: "/assessment/timetable" },
      { label: "Summary Sheets", href: "/assessment/summary-sheets" },
      { label: "Circulars", href: "/circulars" },
    ],
  },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Notice Board", href: "/notice-board" },
  {
    label: "Media Centre",
    children: [
      { label: "News & Stories", href: "/media/news" },
      { label: "Gallery", href: "/media/gallery" },
      { label: "Press Releases", href: "/media/press-releases" },
      { label: "Newsletter", href: "/media/newsletter" },
      { label: "Events", href: "/media/events" },
      { label: "Innovation Corner", href: "/media/innovation" },
    ],
  },
  {
    label: "Support & FAQs",
    children: [
      { label: "Contact Us", href: "/support/contact" },
      { label: "FAQs", href: "/support/faqs" },
    ],
  },
  { label: "Career", href: "/career" },
  { label: "Resources", href: "/reports-downloads" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-7 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
            : "bg-uvtab-blue/90 backdrop-blur-sm py-3"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/uvtablogo.png"
                alt="UVTAB Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-bold leading-tight transition-colors",
                    scrolled ? "text-uvtab-blue" : "text-white"
                  )}
                >
                  UGANDA VOCATIONAL AND TECHNICAL
                </p>
                <p
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    scrolled ? "text-uvtab-gold" : "text-uvtab-gold-light"
                  )}
                >
                  ASSESSMENT BOARD
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-3 py-2 text-[13px] font-medium rounded-lg transition-all hover:bg-white/10",
                        scrolled
                          ? "text-gray-700 hover:text-uvtab-blue hover:bg-uvtab-blue/5"
                          : "text-white/90 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "px-3 py-2 text-[13px] font-medium rounded-lg transition-all flex items-center gap-1 hover:bg-white/10",
                        scrolled
                          ? "text-gray-700 hover:text-uvtab-blue hover:bg-uvtab-blue/5"
                          : "text-white/90 hover:text-white"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform",
                          openDropdown === item.label && "rotate-180"
                        )}
                      />
                    </button>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[220px]"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-uvtab-blue/5 hover:text-uvtab-blue transition-colors border-b border-gray-50 last:border-0"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "xl:hidden p-2 rounded-lg transition-colors",
                scrolled
                  ? "text-uvtab-blue hover:bg-uvtab-blue/5"
                  : "text-white hover:bg-white/10"
              )}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white xl:hidden overflow-y-auto pt-24"
          >
            <div className="px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-uvtab-blue/5 hover:text-uvtab-blue transition"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.label ? null : item.label
                          )
                        }
                        className="w-full flex justify-between items-center px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-uvtab-blue/5 transition"
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform",
                            openDropdown === item.label && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.label && item.children && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-uvtab-blue transition"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
