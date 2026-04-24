"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Download, ZoomIn, Share2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getPressReleases, extractText, getMediaUrl } from "@/lib/strapi";

function getThumbUrl(pr: any): string {
  const img = pr.ThumbnailImage || pr.thumbnailImage;
  if (!img) return "";
  return img.formats?.medium?.url || img.formats?.small?.url || img.url || "";
}

export default function PressReleasesPage() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getPressReleases()
      .then(setReleases)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleShare = (pr: any) => {
    const docUrl = getMediaUrl(pr.Document || pr.Media);
    if (navigator.share) {
      navigator.share({ title: pr.Title, url: docUrl || window.location.href });
    } else if (docUrl) {
      navigator.clipboard.writeText(docUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <PageHero
        title="Press Releases"
        subtitle="Official press releases and statements from UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }, { label: "Press Releases" }]}
      />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : releases.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No press releases available.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {releases.map((pr, i) => {
                const docUrl = getMediaUrl(pr.Document || pr.Media);
                const thumbUrl = getThumbUrl(pr);
                const fullImgUrl = pr.ThumbnailImage?.url || "";
                const pubDate = pr.PublicationDate || pr.publishedAt;

                return (
                  <motion.div
                    key={pr.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-56 bg-gradient-to-br from-uvtab-blue/5 to-uvtab-blue/10 overflow-hidden">
                      {thumbUrl ? (
                        <>
                          <img
                            src={thumbUrl}
                            alt={pr.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                          <FileText size={48} className="text-uvtab-blue/15" />
                        </div>
                      )}
                      {/* Date badge on image */}
                      {pubDate && (
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <Calendar size={11} />
                          {new Date(pubDate).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 leading-snug mb-3 line-clamp-3 group-hover:text-uvtab-blue transition-colors flex-1">
                        {pr.Title}
                      </h3>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                        {docUrl && (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-uvtab-blue text-white text-xs font-semibold rounded-lg hover:bg-uvtab-blue-dark transition-colors flex-1 justify-center uppercase tracking-wide"
                          >
                            <Download size={13} />
                            Download Press Release
                          </a>
                        )}
                        <button
                          onClick={() => handleShare(pr)}
                          className="p-2.5 text-gray-400 hover:text-uvtab-blue hover:bg-uvtab-blue/5 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 size={16} />
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
            alt="Press Release"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
