"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Newspaper, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";
import Link from "next/link";
import { getNews, NewsItem, proxyUrl } from "@/lib/strapi";

const SOCIAL_TABS = [
  { id: "news", label: "UVTAB News", icon: Newspaper },
  { id: "twitter", label: "X (Twitter)", icon: Twitter },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
] as const;

type TabId = (typeof SOCIAL_TABS)[number]["id"];

function TwitterEmbed() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Twitter size={32} className="text-gray-800" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Follow us on X</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
        Get the latest updates, announcements, and news from UVTAB on X (formerly Twitter).
      </p>
      <a
        href="https://x.com/UVTABOfficial"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
      >
        <Twitter size={18} />
        Follow @UVTABOfficial
      </a>
    </div>
  );
}

function FacebookEmbed() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Facebook size={32} className="text-[#1877F2]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Follow us on Facebook</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
        Stay up to date with UVTAB announcements, events, and news on our official Facebook page.
      </p>
      <a
        href="https://www.facebook.com/uvtabofficial/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-xl font-medium hover:bg-[#166FE5] transition-colors"
      >
        <Facebook size={18} />
        Follow UVTAB on Facebook
      </a>
    </div>
  );
}

function YouTubeEmbed() {
  return (
    <div className="space-y-4">
      <iframe
        src="https://www.youtube.com/embed/videoseries?list=UUBD9kRc0d8aKVFC4bzzOstw&autoplay=1&mute=1"
        width="100%"
        height="400"
        className="rounded-xl w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="UVTAB YouTube Channel"
      />
      <div className="text-center">
        <a
          href="https://www.youtube.com/@uvtabofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-sm"
        >
          <Youtube size={16} />
          Visit our YouTube Channel
        </a>
      </div>
    </div>
  );
}

function LinkedInEmbed() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-[#0A66C2]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Linkedin size={32} className="text-[#0A66C2]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Follow us on LinkedIn</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
        Stay connected with UVTAB for professional updates, career opportunities, and industry insights.
      </p>
      <a
        href="https://ug.linkedin.com/company/uganda-business-technical-examinations-board"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-xl font-medium hover:bg-[#004182] transition-colors"
      >
        <Linkedin size={18} />
        Follow UVTAB on LinkedIn
      </a>
    </div>
  );
}

function getNewsImage(item: any): string {
  // Try Media array first (Strapi v4 format)
  const media = item.Media || item.media;
  if (Array.isArray(media) && media.length > 0) {
    const img = media[0];
    // Prefer medium/small format for thumbnails
    const thumb =
      img.formats?.medium?.url ||
      img.formats?.small?.url ||
      img.formats?.thumbnail?.url ||
      img.url;
    if (thumb) return proxyUrl(thumb);
  }
  // Try Image field
  const image = item.Image || item.image;
  if (image?.url) return proxyUrl(image.url);
  if (image?.data?.attributes?.url) return proxyUrl(image.data.attributes.url);
  if (image?.formats?.medium?.url) return proxyUrl(image.formats.medium.url);
  return "";
}

function LoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
    </div>
  );
}

export default function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("news");

  useEffect(() => {
    getNews(6)
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-uvtab-blue/5 text-uvtab-blue text-sm font-medium mb-4">
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest News & Social
            </h2>
          </div>
          <Link
            href="/media/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-uvtab-blue/20 text-uvtab-blue font-medium hover:bg-uvtab-blue hover:text-white transition-all"
          >
            View All News
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
          {SOCIAL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-uvtab-blue text-white shadow-md shadow-uvtab-blue/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <tab.icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "news" && (
            <>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No news articles yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.slice(0, 6).map((item, i) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <Link href={`/media/news/${item.documentId}`}>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
                          <div className="h-48 bg-gradient-to-br from-uvtab-blue/10 to-uvtab-blue/5 relative overflow-hidden">
                            {getNewsImage(item) ? (
                              <img
                                src={getNewsImage(item)}
                                alt={item.Title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-uvtab-blue/5 flex items-center justify-center">
                                <Newspaper size={32} className="text-uvtab-blue/20" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-uvtab-blue text-white text-xs font-medium rounded-full">News</span>
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                              <Calendar size={12} />
                              {new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-UG", {
                                year: "numeric", month: "long", day: "numeric",
                              })}
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-uvtab-blue transition-colors mb-2 line-clamp-2">
                              {item.Title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                              {typeof item.Description === "string"
                                ? item.Description
                                : Array.isArray(item.Description)
                                ? item.Description.map((b: any) => b?.children?.map((c: any) => c.text).join("") || "").join(" ").slice(0, 150)
                                : typeof item.Content === "string"
                                ? item.Content.replace(/<[^>]*>/g, "").slice(0, 150)
                                : ""}
                            </p>
                            <span className="text-uvtab-blue text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read more <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "twitter" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <TwitterEmbed />
            </div>
          )}

          {activeTab === "facebook" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <FacebookEmbed />
            </div>
          )}

          {activeTab === "youtube" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <YouTubeEmbed />
            </div>
          )}

          {activeTab === "linkedin" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <LinkedInEmbed />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
