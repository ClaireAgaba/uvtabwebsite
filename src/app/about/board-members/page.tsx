"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Crown, Briefcase } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getBoardMembers, getMediaUrl, proxyUrl, type BoardMember } from "@/lib/strapi";

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

      <section className="section-padding bg-gradient-to-b from-gray-50/50 to-white">
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
              {/* ── Chairperson ── */}
              {chair && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-20"
                >
                  <div className="inline-flex items-center gap-2 bg-uvtab-gold/10 text-uvtab-gold px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
                    <Crown className="w-3.5 h-3.5" />
                    Chairperson
                  </div>
                  <div className="group cursor-default">
                    <div className="relative w-56 h-56 mx-auto mb-5">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-uvtab-gold via-uvtab-gold-light to-uvtab-blue opacity-60 blur-sm group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {chair.ProfileImage?.url ? (
                          <img
                            src={proxyUrl(chair.ProfileImage.url)}
                            alt={chair.Name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-uvtab-blue/10 to-uvtab-gold/10">
                            <User className="w-16 h-16 text-uvtab-blue/30" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">{chair.Name}</h2>
                    <p className="text-uvtab-gold font-semibold text-sm mt-1">{chair.Position}</p>
                    {chair.Description && (
                      <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm leading-relaxed">{chair.Description}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Divider ── */}
              <div className="flex items-center gap-4 mb-14">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-uvtab-blue/15" />
                <span className="text-xs font-semibold uppercase tracking-widest text-uvtab-blue/50">Board Members</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-uvtab-blue/15" />
              </div>

              {/* ── Board Members Grid ── */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 mb-20">
                {regular.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="text-center group cursor-default"
                  >
                    <div className="relative w-44 h-44 mx-auto mb-4">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-uvtab-blue/20 to-uvtab-gold/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                      <div className="relative w-44 h-44 rounded-full overflow-hidden border-3 border-gray-200 group-hover:border-uvtab-gold/60 shadow-md group-hover:shadow-xl transition-all duration-500">
                        {member.ProfileImage?.url ? (
                          <img
                            src={proxyUrl(member.ProfileImage.url)}
                            alt={member.Name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <User className="w-10 h-10 text-uvtab-blue/25" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-[0.95rem]">{member.Name}</h3>
                    <p className="text-uvtab-blue text-sm font-medium mt-0.5">{member.Position}</p>
                    {member.Description && (
                      <p className="text-gray-400 text-xs mt-2 max-w-[220px] mx-auto leading-relaxed">{member.Description}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-4 mb-14">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-uvtab-blue/15" />
                <span className="text-xs font-semibold uppercase tracking-widest text-uvtab-blue/50">Secretariat Board</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-uvtab-blue/15" />
              </div>

              {/* ── Executive Secretary ── */}
              {es && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center pb-8"
                >
                  <div className="inline-flex items-center gap-2 bg-uvtab-blue/5 text-uvtab-blue px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
                    <Briefcase className="w-3.5 h-3.5" />
                    Executive Secretary
                  </div>
                  <div className="group cursor-default">
                    <div className="relative w-52 h-52 mx-auto mb-5">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-uvtab-blue via-uvtab-blue-light to-uvtab-gold opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500" />
                      <div className="relative w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {es.ProfileImage?.url ? (
                          <img
                            src={proxyUrl(es.ProfileImage.url)}
                            alt={es.Name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-uvtab-blue/10 to-uvtab-gold/10">
                            <User className="w-14 h-14 text-uvtab-blue/30" />
                          </div>
                        )}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{es.Name}</h2>
                    <p className="text-uvtab-gold font-semibold text-sm mt-1">{es.Position}</p>
                    {es.Description && (
                      <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto leading-relaxed">{es.Description}</p>
                    )}
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
