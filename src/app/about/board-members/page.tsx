"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getBoardMembers, getMediaUrl, type BoardMember } from "@/lib/strapi";

export default function BoardMembersPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBoardMembers()
      .then(setMembers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chair = members.find((m) => m.Position?.toLowerCase().includes("chairperson"));
  const es = members.find((m) => m.Position?.toLowerCase().includes("executive secretary"));
  const regular = members.filter(
    (m) =>
      !m.Position?.toLowerCase().includes("chairperson") &&
      !m.Position?.toLowerCase().includes("executive secretary")
  );

  return (
    <>
      <PageHero
        title="Board Members"
        subtitle="Meet the leaders driving UVTAB's mission forward"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Board Members" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No board members information available.</p>
            </div>
          ) : (
            <>
              {/* Chairperson */}
              {chair && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-16"
                >
                  <div className="inline-block">
                    <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-4 border-uvtab-gold bg-uvtab-blue/5">
                      {chair.ProfileImage?.url ? (
                        <img src={chair.ProfileImage.url} alt={chair.Name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-uvtab-blue/5">
                          <User className="w-16 h-16 text-uvtab-blue/30" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-uvtab-blue">{chair.Name}</h2>
                    <p className="text-uvtab-gold font-semibold">{chair.Position}</p>
                    {chair.Description && <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">{chair.Description}</p>}
                  </div>
                </motion.div>
              )}

              {/* Board Members Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {regular.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-uvtab-blue/5 border-2 border-gray-100">
                      {member.ProfileImage?.url ? (
                        <img src={member.ProfileImage.url} alt={member.Name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-uvtab-blue/30" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{member.Name}</h3>
                    <p className="text-uvtab-blue text-sm font-medium">{member.Position}</p>
                    {member.Description && <p className="text-gray-400 text-xs mt-2">{member.Description}</p>}
                  </motion.div>
                ))}
              </div>

              {/* Executive Secretary */}
              {es && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-block bg-gradient-to-br from-uvtab-blue to-uvtab-blue-light text-white rounded-2xl p-8">
                    <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-uvtab-gold/50 bg-white/10">
                      {es.ProfileImage?.url ? (
                        <img src={es.ProfileImage.url} alt={es.Name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{es.Name}</h2>
                    <p className="text-uvtab-gold font-semibold text-sm">{es.Position}</p>
                    {es.Description && <p className="text-white/70 mt-2 text-sm max-w-md mx-auto">{es.Description}</p>}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
