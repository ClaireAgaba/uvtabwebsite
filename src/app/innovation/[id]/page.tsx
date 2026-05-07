"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getMediaUrl, extractText } from "@/lib/strapi";
import axios from "axios";

const API_URL = "https://cms.uvtab.go.ug/api";

export default function InnovationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/innovations/${id}?populate=*`)
        .then((res) => setItem(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDescription = (data: any): string => {
    if (!data) return "";
    const desc = data.Description || data.Content;
    if (typeof desc === "string") return desc;
    if (Array.isArray(desc)) return extractText(desc);
    return "";
  };

  return (
    <>
      <PageHero
        title={item?.Title || "Innovation"}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Innovation", href: "/innovation" },
          { label: item?.Title?.substring(0, 40) + "..." || "Detail" },
        ]}
      />

      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : !item ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Innovation not found.</p>
              <Link href="/innovation" className="text-uvtab-blue font-semibold hover:underline">Back to Innovation Corner</Link>
            </div>
          ) : (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <Link href="/innovation" className="inline-flex items-center gap-1.5 text-uvtab-blue text-sm font-medium hover:gap-2.5 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>

              {item.createdAt && (
                <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}

              {getMediaUrl(item.Media || item.Image) && (
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img src={getMediaUrl(item.Media || item.Image)} alt={item.Title} className="w-full max-h-[500px] object-cover" />
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{item.Title}</h1>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {getDescription(item)}
              </div>
            </motion.article>
          )}
        </div>
      </section>
    </>
  );
}
