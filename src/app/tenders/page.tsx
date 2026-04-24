"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gavel, Calendar, Download, ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import { fetchStrapi, getStrapiAttributes, getMediaUrl, extractText } from "@/lib/strapi";

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrapi<any>("tenders", { sort: "createdAt:desc" })
      .then((items) =>
        items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }))
      )
      .then(setTenders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Tenders & Procurement"
        subtitle="Current and past procurement opportunities at UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tenders" }]}
      />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Gavel className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active tenders at this time. Check back later.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {tenders.map((tender, i) => {
                const docUrl = getMediaUrl(tender.Document || tender.Media);
                const desc =
                  typeof tender.Description === "string"
                    ? tender.Description
                    : extractText(tender.Description || []);
                return (
                  <motion.div
                    key={tender.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-uvtab-blue/5 rounded-xl flex items-center justify-center shrink-0">
                        <Gavel className="w-6 h-6 text-uvtab-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1">{tender.Title || tender.Name}</h3>
                        {tender.Deadline && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-2">
                            <Calendar className="w-3.5 h-3.5" />
                            Deadline: {new Date(tender.Deadline).toLocaleDateString("en-UG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        )}
                        {desc && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{desc}</p>}
                        <div className="flex gap-2">
                          {docUrl && (
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-uvtab-blue text-white rounded-lg text-sm font-medium hover:bg-uvtab-blue-dark transition-colors"
                            >
                              <Download className="w-4 h-4" /> Download
                            </a>
                          )}
                          {tender.Link && (
                            <a
                              href={tender.Link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> View Details
                            </a>
                          )}
                        </div>
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
