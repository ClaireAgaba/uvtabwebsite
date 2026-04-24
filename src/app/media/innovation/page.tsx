"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lightbulb, ArrowRight, Calendar, ZoomIn, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getInnovations, extractText } from "@/lib/strapi";

function getImageUrl(item: any): string {
  const media = item.Media;
  if (!media) return "";
  if (Array.isArray(media) && media.length > 0) {
    const m = media[0];
    return m.formats?.medium?.url || m.formats?.small?.url || m.url || "";
  }
  return media.formats?.medium?.url || media.formats?.small?.url || media.url || "";
}

function getFullImageUrl(item: any): string {
  const media = item.Media;
  if (!media) return "";
  if (Array.isArray(media) && media.length > 0) return media[0].url || "";
  return media.url || "";
}

export default function InnovationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

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
        subtitle="Discover innovative projects and ideas from vocational education trainees"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }, { label: "Innovation Corner" }]}
      />

      {/* Intro */}
      <section className="py-10 bg-gradient-to-r from-uvtab-gold/5 to-uvtab-blue/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-uvtab-gold/10 rounded-full mb-4">
            <Sparkles size={16} className="text-uvtab-gold" />
            <span className="text-sm font-semibold text-uvtab-gold">Celebrating TVET Innovation</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Showcasing remarkable projects and entrepreneurial journeys from vocational education trainees across Uganda. These innovators are transforming communities with practical, hands-on solutions.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No innovations available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, i) => {
                const imageUrl = getImageUrl(item);
                const fullImgUrl = getFullImageUrl(item);
                const desc = typeof item.Description === "string" ? item.Description : extractText(item.Description || []);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-60 bg-gradient-to-br from-uvtab-gold/5 to-uvtab-blue/5 overflow-hidden">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={item.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          {fullImgUrl && (
                            <button
                              onClick={() => setLightbox(fullImgUrl)}
                              className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ZoomIn size={14} />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Lightbulb size={48} className="text-uvtab-gold/20" />
                        </div>
                      )}
                      {/* Innovation badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-uvtab-gold text-white rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                        <Lightbulb size={11} />
                        Innovation
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {item.createdAt && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                          <Calendar size={12} />
                          {new Date(item.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-uvtab-blue transition-colors">
                        {item.Title}
                      </h3>
                      {desc && (
                        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-4 mb-4">
                          {desc}
                        </p>
                      )}
                      <Link
                        href={`/innovation/${item.documentId}`}
                        className="inline-flex items-center gap-1.5 text-uvtab-blue text-sm font-semibold mt-auto hover:gap-2.5 transition-all group/link"
                      >
                        Read Full Story
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightbox}
            alt="Innovation"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
