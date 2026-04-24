"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Download, File, HardDrive, Calendar, FileText, Share2, Award } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getQMS } from "@/lib/strapi";

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
  const text = `QMS Document: ${item.title}`;
  if (navigator.share) {
    try { await navigator.share({ title: item.title, text, url: item.documentUrl || window.location.href }); } catch {}
  } else {
    await navigator.clipboard.writeText(item.documentUrl || window.location.href);
    alert("Link copied to clipboard!");
  }
}

export default function QMSPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQMS()
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Quality Management System"
        subtitle="Access UVTAB's QMS policies, procedures, and documentation"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }, { label: "QMS" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-uvtab-blue/5 to-uvtab-gold/5 rounded-2xl p-8 mb-10"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-uvtab-blue/10 rounded-xl flex items-center justify-center shrink-0">
                <Award size={28} className="text-uvtab-blue" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-xl mb-2">UVTAB Quality Management System</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  UVTAB is committed to maintaining the highest standards in vocational and technical assessment through a robust
                  Quality Management System. Below you will find our QMS documents including policies, procedures, manuals, and
                  other quality-related documentation available for download.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Documents count */}
          {!loading && (
            <p className="text-sm text-gray-400 mb-5">
              {documents.length} document{documents.length !== 1 ? "s" : ""} available
            </p>
          )}

          {/* Documents */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Shield size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No QMS documents available yet.</p>
              <p className="text-gray-400 text-sm mt-1">Documents will appear here once they are published.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map((item, i) => {
                const ext = item.fileExt || item.fileName?.split(".").pop() || "";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all group"
                  >
                    {/* File icon + ext badge */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 ${getFileColor(ext)}`}>
                        {getFileIcon(ext)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 group-hover:text-uvtab-blue transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {ext && (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full uppercase">
                              {ext.replace(".", "")}
                            </span>
                          )}
                          {item.fileSize > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                              <HardDrive size={9} />
                              {formatFileSize(item.fileSize)}
                            </span>
                          )}
                          {item.publishedAt && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                              <Calendar size={9} />
                              {new Date(item.publishedAt).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {item.documentUrl ? (
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 bg-uvtab-blue text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-uvtab-blue-dark transition-colors"
                        >
                          <Download size={14} /> Download
                        </a>
                      ) : (
                        <span className="flex-1 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium text-center">
                          No file attached
                        </span>
                      )}
                      <button
                        onClick={() => handleShare(item)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-uvtab-blue hover:border-uvtab-blue/30 transition-colors shrink-0"
                        title="Share"
                      >
                        <Share2 size={15} />
                      </button>
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
