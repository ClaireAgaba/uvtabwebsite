"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Share2, Filter, Calendar, Tag, FileText } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getTimetables, getMediaUrl, extractText } from "@/lib/strapi";

function descText(desc: any): string {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc))
    return desc.map((b: any) => b?.children?.map((c: any) => c.text).join("") || "").join(" ");
  return "";
}

export default function TimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("All");
  const [seriesFilter, setSeriesFilter] = useState("All");

  useEffect(() => {
    getTimetables()
      .then(setTimetables)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const levels = useMemo(() => {
    const s = new Set<string>();
    timetables.forEach((tt) => { if (tt.ProgramLevel) s.add(tt.ProgramLevel); });
    return ["All", ...Array.from(s).sort()];
  }, [timetables]);

  const series = useMemo(() => {
    const s = new Set<string>();
    timetables.forEach((tt) => { if (tt.ExamSeries) s.add(tt.ExamSeries); });
    return ["All", ...Array.from(s).sort()];
  }, [timetables]);

  const filtered = useMemo(() => {
    return timetables.filter((tt) => {
      if (levelFilter !== "All" && tt.ProgramLevel !== levelFilter) return false;
      if (seriesFilter !== "All" && tt.ExamSeries !== seriesFilter) return false;
      return true;
    });
  }, [timetables, levelFilter, seriesFilter]);

  const handleShare = (tt: any) => {
    const docUrl = getMediaUrl(tt.Document);
    const text = `${tt.ProgramLevel} - ${tt.ExamSeries} Timetable\n${descText(tt.Description)}`;
    if (navigator.share) {
      navigator.share({ title: `${tt.ProgramLevel} - ${tt.ExamSeries}`, text, url: docUrl || window.location.href });
    } else if (docUrl) {
      navigator.clipboard.writeText(docUrl);
      alert("Download link copied to clipboard!");
    }
  };

  return (
    <>
      <PageHero
        title="Exam Timetable"
        subtitle="View and download assessment timetables"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Assessment" }, { label: "Timetable" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-4">
              <Filter size={16} className="text-uvtab-blue" />
              Filter Timetables
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Program Level</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors"
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>{l === "All" ? "All Levels" : l}</option>
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
                  {series.map((s) => (
                    <option key={s} value={s}>{s === "All" ? "All Series" : s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          {!loading && timetables.length > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              Showing {filtered.length} of {timetables.length} timetable{timetables.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* Timetables list */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">{timetables.length === 0 ? "No timetables available." : "No timetables match your filter."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((tt, i) => {
                const docUrl = getMediaUrl(tt.Document);
                const desc = descText(tt.Description);
                const title = [tt.ProgramLevel, tt.ExamSeries].filter(Boolean).join(" - ");

                return (
                  <motion.div
                    key={tt.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="border-l-4 border-l-uvtab-blue p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-uvtab-blue/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-uvtab-blue/10 transition-colors">
                          <FileSpreadsheet className="w-6 h-6 text-uvtab-blue" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-uvtab-blue transition-colors">
                            {title}
                          </h3>
                          {desc && (
                            <p className="text-sm text-gray-600 mt-1">{desc}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {tt.ExamSeries && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Calendar size={12} />
                                {tt.ExamSeries}
                              </span>
                            )}
                            {tt.ProgramLevel && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Tag size={12} />
                                {tt.ProgramLevel}
                              </span>
                            )}
                            {tt.FileSize && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-medium">
                                <FileText size={11} />
                                Type: {tt.FileSize}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
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
                            onClick={() => handleShare(tt)}
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
