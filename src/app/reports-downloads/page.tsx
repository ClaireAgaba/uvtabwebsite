"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Download, FolderOpen, Search, Share2, Calendar, HardDrive, File, BookOpen, Mic, Gavel } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getReports, getDownloads, getSpeeches, getBidsTenders } from "@/lib/strapi";

type TabKey = "reports" | "downloads" | "speeches" | "bids";

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
  const pageUrl = `${window.location.origin}/reports-downloads`;
  const text = `${item.title} — UVTAB Reports & Policies`;
  if (navigator.share) {
    try { await navigator.share({ title: item.title, text, url: pageUrl }); } catch {}
  } else {
    await navigator.clipboard.writeText(pageUrl);
    alert("Link copied to clipboard!");
  }
}

const tabLabels: Record<TabKey, string> = {
  reports: "report",
  downloads: "download",
  speeches: "speech",
  bids: "bid/tender",
};

export default function ReportsDownloadsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [speeches, setSpeeches] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("reports");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.allSettled([getReports(), getDownloads(), getSpeeches(), getBidsTenders()])
      .then(([r, d, s, b]) => {
        if (r.status === "fulfilled") setReports(r.value);
        if (d.status === "fulfilled") setDownloads(d.value);
        if (s.status === "fulfilled") setSpeeches(s.value);
        if (b.status === "fulfilled") setBids(b.value);
      })
      .finally(() => setLoading(false));
  }, []);

  const dataMap: Record<TabKey, any[]> = { reports, downloads, speeches, bids };
  const items = dataMap[tab];

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

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "reports", label: "Reports", icon: <BookOpen size={15} />, count: reports.length },
    { key: "downloads", label: "Downloads", icon: <FolderOpen size={15} />, count: downloads.length },
    { key: "speeches", label: "Speeches", icon: <Mic size={15} />, count: speeches.length },
    { key: "bids", label: "Bids & Tenders", icon: <Gavel size={15} />, count: bids.length },
  ];

  return (
    <>
      <PageHero
        title="Reports & Policies"
        subtitle="Access UVTAB reports, policies, speeches, bids and tenders"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports & Policies" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports and policies..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue transition-colors shadow-sm"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.key
                    ? "bg-uvtab-blue text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.icon} {t.label} ({t.count})
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-5">
            {filtered.length} {tabLabels[tab]}{filtered.length !== 1 ? (tab === "bids" ? "s" : "es".startsWith(tabLabels[tab].slice(-1)) ? "s" : "s") : ""} found
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
