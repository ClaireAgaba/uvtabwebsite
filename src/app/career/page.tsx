"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, MapPin, Download, ExternalLink, ClipboardList, ListChecks, Clock, AlertCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getJobs, getInternships, getActivities, extractText, getMediaUrl } from "@/lib/strapi";

function extractLinks(desc: any): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  if (!Array.isArray(desc)) return links;
  for (const block of desc) {
    if (block.children) {
      for (const child of block.children) {
        if (child.type === "link" && child.url) {
          const linkText = child.children?.map((c: any) => c.text || "").join("") || child.url;
          links.push({ text: linkText, url: child.url });
        }
      }
    }
  }
  return links;
}

function getDeadlineStatus(deadline: string | null): { label: string; color: string } | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  const now = new Date();
  if (d < now) return { label: "Closed", color: "bg-red-100 text-red-700" };
  const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 7) return { label: `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`, color: "bg-orange-100 text-orange-700" };
  return { label: "Open", color: "bg-green-100 text-green-700" };
}

type TabKey = "jobs" | "shortlists" | "internships" | "activities";

export default function CareerPage() {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("jobs");

  useEffect(() => {
    Promise.all([getJobs(), getInternships(), getActivities()])
      .then(([j, i, a]) => { setAllJobs(j); setInternships(i); setActivities(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const jobs = useMemo(() => allJobs.filter((j) => !(j.Title || "").toLowerCase().includes("shortlist")), [allJobs]);
  const shortlists = useMemo(() => allJobs.filter((j) => (j.Title || "").toLowerCase().includes("shortlist")), [allJobs]);

  const tabs: { key: TabKey; label: string; icon: any; count: number }[] = [
    { key: "jobs", label: "Job Openings", icon: Briefcase, count: jobs.length },
    { key: "shortlists", label: "Shortlists", icon: ListChecks, count: shortlists.length },
    { key: "internships", label: "Internships", icon: GraduationCap, count: internships.length },
    { key: "activities", label: "UVTAB Activities", icon: ClipboardList, count: activities.length },
  ];

  const currentItems = tab === "jobs" ? jobs : tab === "shortlists" ? shortlists : tab === "internships" ? internships : activities;

  return (
    <>
      <PageHero
        title="Career"
        subtitle="Join UVTAB and contribute to vocational education excellence"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      tab === t.key ? "bg-uvtab-blue text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <t.icon size={16} />
                    {t.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      tab === t.key ? "bg-white/20" : "bg-gray-200"
                    }`}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Content */}
              {currentItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <AlertCircle size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No {tab === "jobs" ? "job openings" : tab === "shortlists" ? "shortlists" : tab === "internships" ? "internships" : "activities"} available at this time.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Check back later for new opportunities.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {currentItems.map((item, i) => {
                    const desc = typeof item.Description === "string" ? item.Description : extractText(item.Description || []);
                    const docUrl = getMediaUrl(item.DescriptionDocument || item.Document || item.Media);
                    const links = extractLinks(item.Description);
                    const deadlineStatus = getDeadlineStatus(item.Deadline);
                    const isShortlist = tab === "shortlists";
                    const isActivity = tab === "activities";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all group ${
                          isShortlist ? "border-uvtab-gold/20" : "border-gray-100"
                        }`}
                      >
                        {/* Top accent bar */}
                        <div className={`h-1 ${isShortlist ? "bg-uvtab-gold" : isActivity ? "bg-green-500" : "bg-uvtab-blue"}`} />

                        <div className="p-6 sm:p-7">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              isShortlist ? "bg-uvtab-gold/10" : isActivity ? "bg-green-50" : "bg-uvtab-blue/5"
                            }`}>
                              {isShortlist ? <ListChecks size={22} className="text-uvtab-gold" /> :
                               isActivity ? <ClipboardList size={22} className="text-green-600" /> :
                               <Briefcase size={22} className="text-uvtab-blue" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start gap-3 mb-2">
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-uvtab-blue transition-colors">
                                  {item.Title || item.Name}
                                </h3>
                                {deadlineStatus && (
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${deadlineStatus.color}`}>
                                    {deadlineStatus.label}
                                  </span>
                                )}
                                {item.Type && (
                                  <span className="px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full shrink-0 font-medium">
                                    {item.Type}
                                  </span>
                                )}
                                {item.State && !deadlineStatus && (
                                  <span className={`px-2.5 py-0.5 text-xs rounded-full shrink-0 font-semibold ${
                                    item.State === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {item.State}
                                  </span>
                                )}
                              </div>

                              {/* Meta row */}
                              <div className="flex flex-wrap items-center gap-4 mb-3">
                                {item.Location && (
                                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <MapPin size={14} className="text-gray-400" /> {item.Location}
                                  </div>
                                )}
                                {item.Deadline && (
                                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Clock size={14} className="text-gray-400" />
                                    Deadline: {new Date(item.Deadline).toLocaleDateString("en-UG", { year: "numeric", month: "long", day: "numeric" })}
                                  </div>
                                )}
                                {item.PostedDate && (
                                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Calendar size={14} className="text-gray-400" />
                                    Posted: {new Date(item.PostedDate).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                                  </div>
                                )}
                              </div>

                              {desc && (
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{desc}</p>
                              )}

                              {/* Action buttons */}
                              <div className="flex flex-wrap items-center gap-3">
                                {docUrl && (
                                  <a
                                    href={docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-white rounded-lg text-sm font-semibold transition-colors ${
                                      isShortlist ? "bg-uvtab-gold hover:bg-uvtab-gold/90" : "bg-uvtab-blue hover:bg-uvtab-blue-dark"
                                    }`}
                                  >
                                    <Download size={15} />
                                    {isShortlist ? "Download Shortlist" : "Download Details"}
                                  </a>
                                )}
                                {links.map((link, li) => (
                                  <a
                                    key={li}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                  >
                                    <ExternalLink size={15} />
                                    {link.text}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* CTA */}
              <div className="mt-12 text-center bg-gradient-to-br from-uvtab-blue/5 to-uvtab-gold/5 rounded-2xl p-8">
                <Briefcase size={32} className="text-uvtab-blue mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-lg mb-2">Want to work with us?</h3>
                <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
                  UVTAB is an equal opportunity employer. Keep checking this page for new openings and opportunities.
                </p>
                <a
                  href="/support/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-uvtab-blue text-white rounded-xl font-semibold hover:bg-uvtab-blue-dark transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
