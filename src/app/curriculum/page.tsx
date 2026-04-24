"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getCurriculum, getMediaUrl, extractText } from "@/lib/strapi";

export default function CurriculumPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurriculum()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Curriculum"
        subtitle="TVET curricula developed and maintained by UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Curriculum" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No curriculum documents available.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {items.map((item, i) => {
                const docUrl = getMediaUrl(item.Document || item.Media);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-uvtab-blue/5 rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-uvtab-blue" />
                      </div>
                      <h3 className="font-bold text-gray-900">{item.Title || item.Name}</h3>
                    </div>
                    {item.Description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                        {typeof item.Description === "string" ? item.Description : extractText(item.Description)}
                      </p>
                    )}
                    {docUrl && (
                      <a href={docUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-uvtab-blue text-white rounded-lg text-sm font-medium hover:bg-uvtab-blue-dark transition-colors">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    )}
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
