"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, Info, BookOpen, ClipboardCheck, GraduationCap, Shield, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getFaqs, extractText } from "@/lib/strapi";

const fallbackFaqs = [
  {
    category: "About UVTAB",
    icon: "info",
    items: [
      {
        q: "What is UVTAB?",
        a: "The Uganda Vocational and Technical Assessment Board (UVTAB) is a national corporate body established by the Technical and Vocational Education and Training (TVET) Act No. 3 of 2025. UVTAB is responsible for the assessment and certification of competencies obtained through formal and informal Technical and Vocational Education and Training. Established by the TVET Act No.3 of 2025, UVTAB was operationalised by the TVET Act (Commencement) Instrument 2025 No.25 on the 15th March 2025.",
      },
      {
        q: "Where do I find offices of UVTAB?",
        a: "We are located at Plot 891, Kigobe road in Nakawa Division of Kampala Capital City near National Council for Higher Education. You can use Google Maps to find our offices physically easily.",
      },
      {
        q: "Where can I find more information?",
        a: "You can visit our official website at uvtab.go.ug, follow us on our social media pages (X, Facebook, LinkedIn, YouTube), or contact us directly via email at info@uvtab.go.ug or phone at 0393-255-225 / 0393-193-194.",
      },
      {
        q: "What is the mandate of UVTAB?",
        a: "UVTAB is mandated to regulate, coordinate and conduct credible, fair and valid assessments for vocational and technical education in Uganda. This includes developing assessment standards, conducting examinations, and issuing certificates to successful candidates.",
      },
    ],
  },
  {
    category: "Assessment",
    icon: "clipboard",
    items: [
      {
        q: "When are UVTAB assessments conducted?",
        a: "UVTAB conducts assessments in two main series: May/June and November/December each year. Additional modular assessments may be scheduled throughout the year. Check the Timetable page for specific dates.",
      },
      {
        q: "How do I register for UVTAB assessments?",
        a: "Registration is done through accredited TVET institutions. Candidates should approach their respective institutions which will register them through the UVTAB EIMS (Education Information Management System) portal.",
      },
      {
        q: "How can I access my assessment results?",
        a: "Assessment results are released through the UVTAB website and can be accessed through your respective institution. Official results are communicated through press releases and the Notice Board on our website.",
      },
      {
        q: "What happens if I fail an assessment?",
        a: "Candidates who do not pass can re-sit the assessment in the next available assessment series. Contact your institution for guidance on re-registration and preparation.",
      },
    ],
  },
  {
    category: "Certification & Awards",
    icon: "graduation",
    items: [
      {
        q: "How do I get my certificate?",
        a: "Certificates are issued through your respective institution after successful completion of all required assessments. Institutions collect certificates on behalf of their candidates from UVTAB headquarters.",
      },
      {
        q: "Can I get a replacement certificate?",
        a: "Yes, replacement certificates can be issued upon application. You need to submit a sworn affidavit, police report, and application letter to UVTAB headquarters along with the prescribed fees.",
      },
      {
        q: "How long does it take to get certificates?",
        a: "Certificate processing typically takes 3-6 months after the release of results. The timeline may vary depending on the volume of candidates and verification processes.",
      },
    ],
  },
  {
    category: "Accreditation & Registration",
    icon: "shield",
    items: [
      {
        q: "How can my institution get accredited by UVTAB?",
        a: "Institutions seeking accreditation should submit an application to UVTAB with required documentation including proof of facilities, qualified instructors, and approved curricula. UVTAB conducts verification visits before granting accreditation.",
      },
      {
        q: "What are the requirements for centre registration?",
        a: "Assessment centres must meet specific infrastructure, staffing, and equipment requirements set by UVTAB. Visit the Services > Centers page or contact us for detailed requirements.",
      },
    ],
  },
  {
    category: "Contact & Support",
    icon: "phone",
    items: [
      {
        q: "How can I contact UVTAB?",
        a: "You can reach us via phone at 0393-255-225 or 0393-193-194, email at info@uvtab.go.ug, or visit our offices at Plot 891, Kigobe Road, Kyambogo, P.O Box 1499, Kampala.",
      },
      {
        q: "What are the working hours?",
        a: "UVTAB offices are open Monday to Friday from 8:00 AM to 5:00 PM. We are closed on weekends and public holidays.",
      },
      {
        q: "How do I submit a complaint or feedback?",
        a: "Complaints and feedback can be submitted via email at info@uvtab.go.ug, through our social media channels, or in person at our offices. We strive to respond to all inquiries within 48 hours.",
      },
    ],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  info: <Info size={20} className="text-uvtab-blue" />,
  clipboard: <ClipboardCheck size={20} className="text-uvtab-blue" />,
  graduation: <GraduationCap size={20} className="text-uvtab-blue" />,
  shield: <Shield size={20} className="text-uvtab-blue" />,
  phone: <Phone size={20} className="text-uvtab-blue" />,
  default: <BookOpen size={20} className="text-uvtab-blue" />,
};

export default function FAQsPage() {
  const [strapiFaqs, setStrapiFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getFaqs()
      .then(setStrapiFaqs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Merge Strapi FAQs into categories or use fallback
  const categories = useMemo(() => {
    if (strapiFaqs.length > 0) {
      // Group Strapi FAQs by Category field
      const map: Record<string, { q: string; a: string }[]> = {};
      strapiFaqs.forEach((f) => {
        const cat = f.Category || "General";
        const q = f.Question || f.Title || "";
        const a = typeof f.Answer === "string" ? f.Answer : extractText(f.Answer || f.Description || []);
        if (!map[cat]) map[cat] = [];
        map[cat].push({ q, a });
      });
      return Object.entries(map).map(([category, items]) => ({
        category,
        icon: "default",
        items,
      }));
    }
    return fallbackFaqs;
  }, [strapiFaqs]);

  const categoryNames = useMemo(() => ["All", ...categories.map((c) => c.category)], [categories]);

  const filtered = useMemo(() => {
    return categories
      .filter((c) => activeCategory === "All" || c.category === activeCategory)
      .map((c) => ({
        ...c,
        items: c.items.filter((item) => {
          if (!search) return true;
          const s = search.toLowerCase();
          return item.q.toLowerCase().includes(s) || item.a.toLowerCase().includes(s);
        }),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, activeCategory, search]);

  const totalCount = filtered.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about UVTAB services"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Support" }, { label: "FAQs" }]}
      />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-uvtab-blue text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-6">
            {totalCount} question{totalCount !== 1 ? "s" : ""} found
          </p>

          {/* FAQ Accordion */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <HelpCircle size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No matching questions found.</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((cat) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-uvtab-blue/5 rounded-lg flex items-center justify-center">
                      {iconMap[cat.icon] || iconMap.default}
                    </div>
                    <h3 className="font-bold text-gray-900">{cat.category}</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.items.length}</span>
                  </div>

                  {/* Questions */}
                  <div className="space-y-2">
                    {cat.items.map((item, i) => {
                      const key = `${cat.category}-${i}`;
                      const isOpen = openKey === key;
                      return (
                        <div
                          key={key}
                          className={`bg-white rounded-xl border overflow-hidden transition-colors ${isOpen ? "border-uvtab-blue/20 shadow-sm" : "border-gray-100"}`}
                        >
                          <button
                            onClick={() => setOpenKey(isOpen ? null : key)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 text-sm pr-4">{item.q}</span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180 text-uvtab-blue" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                                  {item.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-gradient-to-br from-uvtab-blue/5 to-uvtab-gold/5 rounded-2xl p-8">
            <HelpCircle size={32} className="text-uvtab-blue mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
            <p className="text-gray-500 text-sm mb-4">Our team is here to help you with any additional inquiries.</p>
            <a
              href="/support/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-uvtab-blue text-white rounded-xl font-semibold hover:bg-uvtab-blue-dark transition-colors"
            >
              <Phone size={16} />
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
