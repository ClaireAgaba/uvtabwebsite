"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getGallery, getMediaUrl, proxyUrl } from "@/lib/strapi";

export default function GalleryPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ images: any[]; index: number } | null>(null);

  useEffect(() => {
    getGallery()
      .then(setAlbums)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allImages = useMemo(() => {
    const images = albums.flatMap((a) =>
      (Array.isArray(a.Media) ? a.Media : []).map((m: any) => ({ ...m, albumTitle: a.Title }))
    );

    return images.sort((a: any, b: any) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return bTime - aTime;
    });
  }, [albums]);

  return (
    <>
      <PageHero
        title="Photo Gallery"
        subtitle="Explore photos from UVTAB events and activities"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }, { label: "Gallery" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : allImages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No gallery images available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <motion.div
                  key={img.id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setLightbox({ images: allImages, index: i })}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                >
                  <img src={proxyUrl(img.url)} alt={img.alternativeText || img.albumTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.albumTitle}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length }); }}
              className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-lg"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img
              src={proxyUrl(lightbox.images[lightbox.index].url)}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length }); }}
              className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-lg"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
