"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getPrograms } from "@/lib/strapi";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Assessment Programs"
        subtitle="Programs assessed and certified by UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Assessment" }, { label: "Programs" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No programs available.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {programs.map((prog, i) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-uvtab-blue/5 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-uvtab-blue" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{prog.Title || prog.Name}</h3>
                  {prog.Level && <span className="inline-block px-2 py-0.5 bg-uvtab-gold/10 text-uvtab-gold text-xs rounded-full">{prog.Level}</span>}
                  {prog.Description && <p className="text-gray-500 text-xs mt-2 line-clamp-3">{typeof prog.Description === "string" ? prog.Description : ""}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
