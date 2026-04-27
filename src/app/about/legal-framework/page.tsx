"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, File, HardDrive, Calendar, Shield, Eye, Share2, Scale, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getLegalDocuments, extractText, type LegalDocument } from "@/lib/strapi";

function isPDF(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf");
}

function getFileBg(name: string): string {
  if (isPDF(name)) return "from-red-50 to-red-100/50";
  return "from-blue-50 to-blue-100/50";
}

async function handleShare(e: React.MouseEvent) {
  e.stopPropagation();
  const pageUrl = `${window.location.origin}/about/legal-framework`;
  const text = "UVTAB Legal Framework — Laws and regulations governing UVTAB's operations";
  if (navigator.share) {
    try { await navigator.share({ title: "UVTAB Legal Framework", text, url: pageUrl }); } catch {}
  } else {
    await navigator.clipboard.writeText(pageUrl);
    alert("Link copied to clipboard!");
  }
}

export default function LegalFrameworkPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);

  useEffect(() => {
    getLegalDocuments()
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Legal Framework"
        subtitle="The laws and regulations governing UVTAB's operations"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Legal Framework" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-uvtab-blue/5 to-uvtab-gold/5 rounded-2xl p-8 mb-10"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-uvtab-blue/10 rounded-xl flex items-center justify-center shrink-0">
                <Scale size={28} className="text-uvtab-blue" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-xl mb-2">UVTAB Legal Framework</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Uganda Vocational and Technical Assessment Board operates under a comprehensive legal framework
                  that governs vocational and technical education assessment in Uganda. Below you will find the key
                  legal documents, acts, guidelines, and regulations.
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Shield size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No legal documents available yet.</p>
              <p className="text-gray-400 text-sm mt-1">Documents will appear here once they are published.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, i) => {
                const canPreview = isPDF(doc.documentName) && doc.documentUrl;

                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all group cursor-pointer flex flex-col"
                    onClick={() => canPreview && setPreviewDoc(doc)}
                  >
                    {/* Cover image or file icon */}
                    {doc.coverImageUrl ? (
                      <div className="h-36 bg-gray-100 overflow-hidden">
                        <img
                          src={doc.coverImageUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`bg-gradient-to-b ${getFileBg(doc.documentName)} p-6 flex items-center justify-center`}>
                        <File size={40} className={isPDF(doc.documentName) ? "text-red-500" : "text-blue-600"} />
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-uvtab-blue transition-colors line-clamp-2 mb-2">
                        {doc.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {doc.category && (
                          <span className="text-[10px] font-bold text-uvtab-blue bg-uvtab-blue/5 px-2 py-0.5 rounded-full">
                            {doc.category}
                          </span>
                        )}
                        {doc.documentName && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full uppercase">
                            {doc.documentName.split(".").pop()}
                          </span>
                        )}
                        {doc.publicationDate && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                            <Calendar size={8} />
                            {new Date(doc.publicationDate).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>

                      {doc.description?.length > 0 && (
                        <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                          {extractText(doc.description)}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-auto flex items-center gap-1.5">
                        {canPreview && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setPreviewDoc(doc); }}
                            className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Eye size={13} /> Preview
                          </button>
                        )}
                        {doc.documentUrl ? (
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-2 bg-uvtab-blue text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-uvtab-blue-dark transition-colors"
                          >
                            <Download size={13} /> Download
                          </a>
                        ) : (
                          <span className="flex-1 py-2 text-center text-xs text-gray-400 italic">Not uploaded</span>
                        )}
                        <button
                          onClick={(e) => handleShare(e)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-uvtab-blue hover:border-uvtab-blue/30 transition-colors shrink-0"
                          title="Share"
                        >
                          <Share2 size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <File size={18} className="text-red-500 shrink-0" />
                  <span className="font-bold text-gray-900 truncate">{previewDoc.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewDoc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-4 bg-uvtab-blue text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-uvtab-blue-dark transition-colors"
                  >
                    <Download size={13} /> Download
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <iframe
                  src={previewDoc.documentUrl}
                  className="w-full h-full"
                  title={`Preview: ${previewDoc.title}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
