"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowLeft, Share2, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getNewsById, getMediaUrl, extractText } from "@/lib/strapi";

export default function NewsDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (documentId) {
      getNewsById(documentId)
        .then(setArticle)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [documentId]);

  const getDescription = (item: any): string => {
    if (!item) return "";
    const desc = item.Description || item.Content;
    if (typeof desc === "string") return desc;
    if (Array.isArray(desc)) {
      return desc
        .map((block: any) => block?.children?.map((c: any) => c.text).join("") || "")
        .join("\n\n");
    }
    return "";
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHero
        title={article?.Title || "News Article"}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/media/news" },
          { label: article?.Title?.substring(0, 40) + "..." || "Article" },
        ]}
      />

      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : !article ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Article not found.</p>
              <Link href="/media/news" className="text-uvtab-blue font-semibold hover:underline">
                Back to News
              </Link>
            </div>
          ) : (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Meta */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/media/news"
                  className="inline-flex items-center gap-1.5 text-uvtab-blue text-sm font-medium hover:gap-2.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to News
                </Link>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>

              {/* Date */}
              {(article.publishedAt || article.createdAt) && (
                <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-UG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}

              {/* Image */}
              {getMediaUrl(article.Media) && (
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src={getMediaUrl(article.Media)}
                    alt={article.Title}
                    className="w-full max-h-[500px] object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {article.Title}
              </h1>

              {/* Content */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {getDescription(article)}
              </div>

              {/* Video if present */}
              {Array.isArray(article.Media) &&
                article.Media.some((m: any) => m.mime?.startsWith("video/")) && (
                  <div className="mt-8">
                    {article.Media.filter((m: any) => m.mime?.startsWith("video/")).map((vid: any) => (
                      <video key={vid.id} src={vid.url} controls className="w-full rounded-xl" />
                    ))}
                  </div>
                )}
            </motion.article>
          )}
        </div>
      </section>
    </>
  );
}
