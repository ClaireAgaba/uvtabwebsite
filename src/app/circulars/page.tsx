"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, Search, Filter, Share2, Tag } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getCirculars, getMediaUrl, extractText } from "@/lib/strapi";

function descText(desc: any): string {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc))
    return desc.map((b: any) => b?.children?.map((c: any) => c.text).join("") || "").join(" ");
  return "";
}

export default function CircularsPage() {
  const [circulars, setCirculars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");

  useEffect(() => {
    getCirculars()
      .then(setCirculars)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    const s = new Set<string>();
    circulars.forEach((c) => {
      const match = (c.ExamSeries || "").match(/\d{4}/);
      if (match) s.add(match[0]);
    });
    return ["All", ...Array.from(s).sort().reverse()];
  }, [circulars]);

  const filtered = useMemo(() => {
    return circulars.filter((c) => {
      const text = `${c.ExamSeries} ${descText(c.Description)}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (yearFilter !== "All") {
        const match = (c.ExamSeries || "").match(/\d{4}/);
        if (!match || match[0] !== yearFilter) return false;
      }
      return true;
    });
  }, [circulars, search, yearFilter]);

  const handleShare = (circ: any) => {
    const docUrl = getMediaUrl(circ.Document);
    const text = `${circ.ExamSeries}\n${descText(circ.Description)}`;
    if (navigator.share) {
      navigator.share({ title: circ.ExamSeries, text, url: docUrl || window.location.href });
    } else if (docUrl) {
      navigator.clipboard.writeText(docUrl);
      alert("Download link copied to clipboard!");
    }
  };

  return (
    <>
      <PageHero
        title="Circulars"
        subtitle="Official circulars and communications from UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Assessment" }, { label: "Circulars" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-4">
              <Filter size={16} className="text-uvtab-blue" />
              Filter Circulars
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          {!loading && circulars.length > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              Showing {filtered.length} of {circulars.length} circular{circulars.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">{circulars.length === 0 ? "No circulars available at this time." : "No circulars match your search."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((circ, i) => {
                const docUrl = getMediaUrl(circ.Document);
                const desc = descText(circ.Description);

                return (
                  <motion.div
                    key={circ.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="border-l-4 border-l-uvtab-gold p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-uvtab-gold/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-uvtab-gold/20 transition-colors">
                          <FileText className="w-6 h-6 text-uvtab-gold" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-uvtab-blue transition-colors">
                            {circ.ExamSeries}
                          </h3>
                          {desc && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {circ.publishedAt && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Calendar size={12} />
                                {new Date(circ.publishedAt).toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" })}
                              </span>
                            )}
                            {circ.FileSize && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-uvtab-blue/5 text-uvtab-blue rounded-full font-medium">
                                <Tag size={11} />
                                {circ.FileSize}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {docUrl && (
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-uvtab-blue text-white rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-uvtab-blue-dark transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleShare(circ)}
                            className="p-2 text-gray-400 hover:text-uvtab-blue hover:bg-uvtab-blue/5 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
