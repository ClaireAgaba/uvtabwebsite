"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getBoardFunctions, extractText, type BoardFunction } from "@/lib/strapi";

export default function BoardFunctionsPage() {
  const [functions, setFunctions] = useState<BoardFunction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBoardFunctions()
      .then(setFunctions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Board Functions"
        subtitle="Understanding the roles and responsibilities of the UVTAB Board"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Board Functions" }]}
      />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : functions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No board functions information available.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {functions.map((func, i) => (
                <motion.div
                  key={func.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-uvtab-blue/5 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-uvtab-blue" />
                    </div>
                    <h2 className="text-xl font-bold text-uvtab-blue">{func.Title}</h2>
                  </div>

                  {func.Introduction?.length > 0 && (
                    <p className="text-gray-600 mb-4 leading-relaxed">{extractText(func.Introduction)}</p>
                  )}

                  {func.Functions?.length > 0 && (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {extractText(func.Functions)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
