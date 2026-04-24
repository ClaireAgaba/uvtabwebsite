"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Download, Calendar, BookOpen, Send, CheckCircle, ZoomIn } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getNewsletters, getMediaUrl, subscribeNewsletter } from "@/lib/strapi";

function getCoverUrl(nl: any): string {
  const img = nl.CoverImage || nl.coverImage;
  if (!img) return "";
  return img.formats?.medium?.url || img.formats?.small?.url || img.url || "";
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Subscribe form
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getNewsletters()
      .then(setNewsletters)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    setError("");
    const ok = await subscribeNewsletter(email);
    if (ok) {
      setSuccess(true);
      setEmail("");
    } else {
      setError("Failed to subscribe. Please try again.");
    }
    setSubLoading(false);
  };

  return (
    <>
      <PageHero
        title="Newsletter"
        subtitle="UVTAB E-Newsletter editions and subscription"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }, { label: "Newsletter" }]}
      />

      {/* Newsletter Editions */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-uvtab-blue/5 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-uvtab-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Newsletter Editions</h2>
              <p className="text-sm text-gray-500">Browse and download past editions of the UVTAB E-Newsletter</p>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No newsletter editions available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((nl, i) => {
                const coverUrl = getCoverUrl(nl);
                const fullCoverUrl = nl.CoverImage?.url || "";
                const docUrl = getMediaUrl(nl.Document);
                const pubDate = nl.PublicationDate || nl.publishedAt;

                return (
                  <motion.div
                    key={nl.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    {/* Cover Image */}
                    <div className="relative h-64 bg-gradient-to-br from-uvtab-blue/5 to-uvtab-gold/5 overflow-hidden">
                      {coverUrl ? (
                        <>
                          <img
                            src={coverUrl}
                            alt={nl.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          {fullCoverUrl && (
                            <button
                              onClick={() => setLightbox(fullCoverUrl)}
                              className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ZoomIn size={14} />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={48} className="text-uvtab-blue/15" />
                        </div>
                      )}
                      {/* Date badge */}
                      {pubDate && (
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <Calendar size={11} />
                          {new Date(pubDate).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 leading-snug mb-3 group-hover:text-uvtab-blue transition-colors flex-1">
                        {nl.Title}
                      </h3>

                      {/* Download */}
                      {docUrl && (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-uvtab-blue text-white text-xs font-semibold rounded-lg hover:bg-uvtab-blue-dark transition-colors justify-center uppercase tracking-wide"
                        >
                          <Download size={13} />
                          Download
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-gradient-to-br from-uvtab-blue to-uvtab-blue-dark">
        <div className="max-w-xl mx-auto px-6 text-center">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Subscribed!</h2>
              <p className="text-white/70 mb-6">You&apos;ll receive UVTAB updates at your email address.</p>
              <button onClick={() => setSuccess(false)} className="text-uvtab-gold font-semibold hover:underline">
                Subscribe another email
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-white/70 mb-8">Get the latest editions, news, and updates delivered to your inbox.</p>

              {error && <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-xl p-3 mb-4">{error}</div>}

              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-uvtab-gold/50 focus:border-uvtab-gold outline-none text-sm backdrop-blur-sm"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="px-6 py-3 bg-uvtab-gold text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-uvtab-gold/90 disabled:opacity-50 transition-colors shrink-0"
                >
                  {subLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                  Subscribe
                </button>
              </form>
            </motion.div>
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
            alt="Newsletter"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
