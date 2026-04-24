"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lightbulb, ArrowRight, Calendar } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getInnovations, getMediaUrl, extractText } from "@/lib/strapi";

export default function InnovationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInnovations()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Innovation Corner"
        subtitle="Discover innovative projects and ideas in vocational education"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Innovation Corner" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No innovations available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => {
                const imageUrl = getMediaUrl(item.Media || item.Image);
                const desc = typeof item.Description === "string" ? item.Description : extractText(item.Description || []);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
                  >
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.Title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-uvtab-blue/5 to-uvtab-gold/5">
                          <Lightbulb className="w-12 h-12 text-uvtab-gold/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {item.createdAt && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.Title}</h3>
                      {desc && <p className="text-gray-500 text-sm flex-1 line-clamp-3">{desc}</p>}
                      <Link
                        href={`/innovation/${item.documentId}`}
                        className="inline-flex items-center gap-1.5 text-uvtab-blue text-sm font-semibold mt-3 hover:gap-2.5 transition-all"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
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
