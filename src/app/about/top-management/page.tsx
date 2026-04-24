"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getTopManagement } from "@/lib/strapi";

export default function TopManagementPage() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopManagement()
      .then(setManagers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="Top Management"
        subtitle="The executive team steering UVTAB's operations"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Top Management" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : managers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No top management information available.</p>
            </div>
          ) : (
            (() => {
              const pos = (m: any) => (m.Position || "").toLowerCase();
              const es = managers.filter((m) => pos(m).includes("executive secretary") && !pos(m).includes("deputy"));
              const des = managers.filter((m) => pos(m).includes("deputy executive"));
              const senior = managers.filter((m) => pos(m).includes("senior manager"));
              const mgrs = managers.filter((m) => pos(m).includes("manager") && !pos(m).includes("senior") && !pos(m).includes("executive") && !pos(m).includes("deputy"));

              const tiers = [
                { label: "Executive Secretary", members: es },
                { label: "Deputy Executive Secretaries", members: des },
                { label: "Senior Management", members: senior },
                { label: "Managers", members: mgrs },
              ].filter((t) => t.members.length > 0);

              return (
                <div className="space-y-12">
                  {tiers.map((tier, ti) => (
                    <motion.div
                      key={tier.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: ti * 0.1 }}
                    >
                      <h3 className="text-center text-sm font-semibold text-uvtab-blue/60 uppercase tracking-wider mb-6">
                        {tier.label}
                      </h3>
                      <div className={`flex flex-wrap justify-center gap-8 ${tier.members.length === 1 ? "max-w-sm mx-auto" : tier.members.length === 2 ? "max-w-2xl mx-auto" : ""}`}>
                        {tier.members.map((manager, i) => (
                          <motion.div
                            key={manager.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: ti * 0.1 + i * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group w-full sm:w-72"
                          >
                            <div className="h-2 gradient-uvtab" />
                            <div className="p-6 text-center">
                              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-uvtab-blue/5 border-2 border-gray-100 group-hover:border-uvtab-gold transition-colors">
                                {manager.ProfileImage?.url ? (
                                  <img src={manager.ProfileImage.url} alt={manager.Name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-uvtab-blue/30" />
                                  </div>
                                )}
                              </div>
                              <h3 className="font-bold text-gray-900 text-lg">{manager.Name}</h3>
                              <p className="text-uvtab-blue text-sm font-medium mt-1">{manager.Position}</p>
                              {manager.Description && (
                                <p className="text-gray-400 text-xs mt-3 leading-relaxed">{manager.Description}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {ti < tiers.length - 1 && (
                        <div className="flex justify-center mt-8">
                          <div className="w-px h-8 bg-uvtab-blue/20" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      </section>
    </>
  );
}
