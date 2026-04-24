"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, Copy, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getNewsStories, getMediaUrl, extractText } from "@/lib/strapi";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    getNewsStories()
      .then((items) => {
        const sorted = items.sort((a: any, b: any) => {
          const dateA = Date.parse(a.publishedAt || a.createdAt || "1900-01-01");
          const dateB = Date.parse(b.publishedAt || b.createdAt || "1900-01-01");
          return dateB - dateA;
        });
        setNews(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyLink = async (documentId: string) => {
    const url = `${window.location.origin}/media/news/${documentId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(documentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDescription = (item: any): string => {
    if (typeof item.Description === "string") return item.Description;
    if (Array.isArray(item.Description)) {
      return item.Description.map((block: any) =>
        block?.children?.map((c: any) => c.text).join("") || ""
      ).join(" ");
    }
    return "";
  };

  return (
    <>
      <PageHero
        title="News & Stories"
        subtitle="Stay updated with the latest news and stories from UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }, { label: "News & Stories" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No news available at this time.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, i) => {
                const desc = getDescription(item);
                const truncated = desc.length > 200 ? desc.substring(0, 200) + "..." : desc;
                const imageUrl = getMediaUrl(item.Media);
                const date = item.publishedAt || item.createdAt;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
                  >
                    {/* Image */}
                    <div className="h-52 bg-gray-100 overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.Title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-uvtab-blue/5">
                          <span className="text-uvtab-blue/20 text-4xl font-bold">UVTAB</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {date && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(date).toLocaleDateString("en-UG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
                        {item.Title || "Untitled"}
                      </h3>
                      <p className="text-gray-500 text-sm flex-1 line-clamp-3">{truncated}</p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <Link
                          href={`/media/news/${item.documentId}`}
                          className="inline-flex items-center gap-1.5 text-uvtab-blue text-sm font-semibold hover:gap-2.5 transition-all"
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => copyLink(item.documentId)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                          title="Copy link"
                        >
                          {copiedId === item.documentId ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
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
    </>
  );
}
