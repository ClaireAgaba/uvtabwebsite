"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getCenters } from "@/lib/strapi";

export default function CentersPage() {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCenters()
      .then(setCenters)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = centers.filter(
    (c) =>
      c.Name?.toLowerCase().includes(search.toLowerCase()) ||
      c.District?.toLowerCase().includes(search.toLowerCase()) ||
      c.Region?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHero
        title="Assessment Centers"
        subtitle="Find UVTAB-accredited assessment centers across Uganda"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: "Centers" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, district, or region..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">{search ? "No centers match your search." : "No centers available."}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((center, i) => (
                <motion.div
                  key={center.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-uvtab-blue/5 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-uvtab-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{center.Name}</h3>
                      {center.District && <p className="text-xs text-gray-500 mt-1">{center.District}</p>}
                      {center.Region && (
                        <span className="inline-block px-2 py-0.5 bg-uvtab-blue/5 text-uvtab-blue text-xs rounded-full mt-2">
                          {center.Region}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
