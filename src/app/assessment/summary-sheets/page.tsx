"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Table, Download, Search, Filter, Calendar, Tag, Share2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getSummarySheets, getMediaUrl } from "@/lib/strapi";

function descText(desc: any): string {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc))
    return desc.map((b: any) => b?.children?.map((c: any) => c.text).join("") || "").join(" ");
  return "";
}

export default function SummarySheetsPage() {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [seriesFilter, setSeriesFilter] = useState("All");

  useEffect(() => {
    getSummarySheets()
      .then(setSheets)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    sheets.forEach((sh) => s.add(sh.Category || "Uncategorized"));
    return ["All", ...Array.from(s).sort()];
  }, [sheets]);

  const seriesList = useMemo(() => {
    const s = new Set<string>();
    sheets.forEach((sh) => { if (sh.ExamSeries) s.add(sh.ExamSeries); });
    return ["All", ...Array.from(s).sort()];
  }, [sheets]);

  const filtered = useMemo(() => {
    return sheets.filter((sh) => {
      const text = `${sh.ExamSeries} ${descText(sh.Description)} ${sh.Category || ""}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (catFilter !== "All" && (sh.Category || "Uncategorized") !== catFilter) return false;
      if (seriesFilter !== "All" && sh.ExamSeries !== seriesFilter) return false;
      return true;
    });
  }, [sheets, search, catFilter, seriesFilter]);

  const handleShare = (sh: any) => {
    const docUrl = getMediaUrl(sh.Media);
    const text = `${sh.ExamSeries}${sh.Category ? ` - ${sh.Category}` : ""}\n${descText(sh.Description)}`;
    if (navigator.share) {
      navigator.share({ title: `${sh.ExamSeries} Summary Sheet`, text, url: docUrl || window.location.href });
    } else if (docUrl) {
      navigator.clipboard.writeText(docUrl);
      alert("Download link copied to clipboard!");
    }
  };

  return (
    <>
      <PageHero
        title="Summary Sheets"
        subtitle="Download assessment summary sheets"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Assessment" }, { label: "Summary Sheets" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-4">
              <Filter size={16} className="text-uvtab-blue" />
              Filter Summary Sheets
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Exam Series</label>
                <select
                  value={seriesFilter}
                  onChange={(e) => setSeriesFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors"
                >
                  {seriesList.map((s) => (
                    <option key={s} value={s}>{s === "All" ? "All Series" : s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          {!loading && sheets.length > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              Showing {filtered.length} of {sheets.length} summary sheet{sheets.length !== 1 ? "s" : ""}
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
              <p className="text-gray-500">{sheets.length === 0 ? "No summary sheets available." : "No summary sheets match your filter."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((sheet, i) => {
                const docUrl = getMediaUrl(sheet.Media);
                const desc = descText(sheet.Description);
                const cat = sheet.Category || "Uncategorized";
                const title = [sheet.ExamSeries, cat].filter(Boolean).join(" - ");

                return (
                  <motion.div
                    key={sheet.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="border-l-4 border-l-emerald-500 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Table className="w-6 h-6 text-emerald-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-uvtab-blue transition-colors">
                            {title}
                          </h3>
                          {desc && (
                            <p className="text-sm text-gray-600 mt-1">{desc}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {sheet.ExamSeries && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Calendar size={12} />
                                {sheet.ExamSeries}
                              </span>
                            )}
                            {cat && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-medium">
                                <Tag size={11} />
                                {cat}
                              </span>
                            )}
                            {sheet.FileSize && (
                              <span className="text-xs text-gray-400">Size: {sheet.FileSize}</span>
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
                            onClick={() => handleShare(sheet)}
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
