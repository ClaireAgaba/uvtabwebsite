"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, Download, FileText, ZoomIn } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getNotices, extractText, getMediaUrl, proxyUrl } from "@/lib/strapi";

function getThumbUrl(notice: any): string {
  const img = notice.ThumbnailImage || notice.thumbnailImage;
  if (!img) return "";
  return proxyUrl(img.formats?.medium?.url || img.formats?.small?.url || img.url || "");
}

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getNotices()
      .then(setNotices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Notice Board"
        subtitle="Important notices and announcements from UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Notice Board" }]}
      />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No notices available at this time.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice, i) => {
                const docUrl = getMediaUrl(notice.Document || notice.Media);
                const thumbUrl = getThumbUrl(notice);
                const fullImgUrl = notice.ThumbnailImage?.url || "";

                return (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 bg-gradient-to-br from-uvtab-blue/5 to-uvtab-blue/10 overflow-hidden">
                      {thumbUrl ? (
                        <>
                          <img
                            src={thumbUrl}
                            alt={notice.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
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
                          <FileText size={40} className="text-uvtab-blue/15" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-uvtab-blue transition-colors">
                        {notice.Title}
                      </h3>
                      {notice.publishedAt && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                          <Calendar className="w-3 h-3" />
                          {new Date(notice.publishedAt).toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      )}
                      {notice.Description && (
                        <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1 leading-relaxed">
                          {typeof notice.Description === "string" ? notice.Description : extractText(notice.Description)}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                        {docUrl && (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-uvtab-blue text-white text-xs font-medium rounded-lg hover:bg-uvtab-blue-dark transition-colors flex-1 justify-center"
                          >
                            <Download size={13} />
                            Download
                          </a>
                        )}
                        {fullImgUrl && (
                          <button
                            onClick={() => setLightbox(fullImgUrl)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <ZoomIn size={13} />
                            View
                          </button>
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
            alt="Notice"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
