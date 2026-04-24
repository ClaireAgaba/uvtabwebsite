"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getLegalDocuments, extractText, type LegalDocument } from "@/lib/strapi";

export default function LegalFrameworkPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No legal documents available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {doc.coverImageUrl && (
                    <div className="h-48 bg-gray-100">
                      <img src={doc.coverImageUrl} alt={doc.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-uvtab-blue/5 rounded-lg flex items-center justify-center shrink-0 mt-1">
                        <FileText className="w-5 h-5 text-uvtab-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{doc.title}</h3>
                        {doc.category && (
                          <span className="inline-block px-2 py-0.5 text-xs bg-uvtab-blue/5 text-uvtab-blue rounded-full mt-1">
                            {doc.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {doc.description?.length > 0 && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                        {extractText(doc.description)}
                      </p>
                    )}

                    {doc.documentUrl ? (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-uvtab-blue text-white rounded-lg text-sm font-medium hover:bg-uvtab-blue-dark transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Document
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Document not yet uploaded</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
