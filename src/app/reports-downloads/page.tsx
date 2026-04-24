"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Download, FolderOpen, Search, Share2, Calendar, HardDrive, File, BookOpen } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getReports, getDownloads } from "@/lib/strapi";

function formatFileSize(kb: number): string {
  if (!kb) return "";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}

function getFileIcon(ext: string) {
  const e = ext.toLowerCase().replace(".", "");
  if (e === "pdf") return <File size={24} className="text-red-500" />;
  if (["doc", "docx"].includes(e)) return <FileText size={24} className="text-blue-600" />;
  if (["xls", "xlsx"].includes(e)) return <FileText size={24} className="text-green-600" />;
  return <FileText size={24} className="text-uvtab-blue" />;
}

function getFileColor(ext: string): string {
  const e = ext.toLowerCase().replace(".", "");
  if (e === "pdf") return "bg-red-50 border-red-100";
  if (["doc", "docx"].includes(e)) return "bg-blue-50 border-blue-100";
  if (["xls", "xlsx"].includes(e)) return "bg-green-50 border-green-100";
  return "bg-uvtab-blue/5 border-uvtab-blue/10";
}

async function handleShare(item: any) {
  const text = `${item.title}${item.description ? " - " + item.description : ""}`;
  if (navigator.share) {
    try { await navigator.share({ title: item.title, text, url: item.documentUrl || window.location.href }); } catch {}
  } else {
    await navigator.clipboard.writeText(item.documentUrl || window.location.href);
    alert("Link copied to clipboard!");
  }
}

export default function ReportsDownloadsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"reports" | "downloads">("reports");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([getReports(), getDownloads()])
      .then(([r, d]) => { setReports(r); setDownloads(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = tab === "reports" ? reports : downloads;

  const filtered = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(s) ||
        (item.description || "").toLowerCase().includes(s) ||
        (item.fileName || "").toLowerCase().includes(s)
    );
  }, [items, search]);

  return (
    <>
      <PageHero
        title="Reports & Downloads"
        subtitle="Access UVTAB reports, publications, and downloadable resources"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports & Downloads" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Search + Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports and downloads..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors shadow-sm"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setTab("reports")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  tab === "reports"
                    ? "bg-uvtab-blue text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BookOpen size={16} /> Reports ({reports.length})
              </button>
              <button
                onClick={() => setTab("downloads")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  tab === "downloads"
                    ? "bg-uvtab-blue text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FolderOpen size={16} /> Downloads ({downloads.length})
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-5">
            {filtered.length} {tab === "reports" ? "report" : "download"}{filtered.length !== 1 ? "s" : ""} found
          </p>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <FolderOpen size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No {tab} found.</p>
              {search && <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item, i) => {
                const ext = item.fileExt || item.fileName?.split(".").pop() || "";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:shadow-lg hover:border-gray-200 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* File icon */}
                      <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 ${getFileColor(ext)}`}>
                        {getFileIcon(ext)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 group-hover:text-uvtab-blue transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                        )}

                        {/* Metadata tags */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          {item.fileName && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                              <File size={11} />
                              <span className="truncate max-w-[200px]">{item.fileName}</span>
                            </span>
                          )}
                          {item.fileSize > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                              <HardDrive size={11} />
                              {formatFileSize(item.fileSize)}
                            </span>
                          )}
                          {ext && (
                            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full uppercase">
                              {ext.replace(".", "")}
                            </span>
                          )}
                          {item.publishedAt && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Calendar size={11} />
                              {new Date(item.publishedAt).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 mt-1">
                        <button
                          onClick={() => handleShare(item)}
                          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-uvtab-blue hover:border-uvtab-blue/30 transition-colors"
                          title="Share"
                        >
                          <Share2 size={15} />
                        </button>
                        {item.documentUrl && (
                          <a
                            href={item.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-uvtab-blue text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-uvtab-blue-dark transition-colors"
                          >
                            <Download size={14} /> Download
                          </a>
                        )}
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
