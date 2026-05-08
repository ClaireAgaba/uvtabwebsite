"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Clock, ZoomIn, CalendarCheck, CalendarClock, History } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getEvents, getMediaUrl, extractText, proxyUrl } from "@/lib/strapi";

type Tab = "ongoing" | "upcoming" | "past";

function getImageUrl(event: any): string {
  const media = event.Media;
  if (!media) return "";
  if (Array.isArray(media) && media.length > 0) {
    const m = media[0];
    return proxyUrl(m.formats?.medium?.url || m.formats?.small?.url || m.url || "");
  }
  return proxyUrl(media.formats?.medium?.url || media.formats?.small?.url || media.url || "");
}

function getFullImageUrl(event: any): string {
  const media = event.Media;
  if (!media) return "";
  if (Array.isArray(media) && media.length > 0) return proxyUrl(media[0].url || "");
  return proxyUrl(media.url || "");
}

function classifyEvent(event: any): Tab {
  const state = (event.State || "").toLowerCase();
  if (state === "ongoing") return "ongoing";
  if (state === "upcoming") return "upcoming";
  if (state === "past") return "past";
  // Fallback: classify by date
  const d = event.EventDate || event.Date;
  if (!d) return "past";
  const eventDate = new Date(d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  if (eDay.getTime() === today.getTime()) return "ongoing";
  if (eDay > today) return "upcoming";
  return "past";
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "ongoing", label: "Ongoing Events", icon: <CalendarCheck size={16} /> },
  { key: "upcoming", label: "Upcoming Events", icon: <CalendarClock size={16} /> },
  { key: "past", label: "Past Events", icon: <History size={16} /> },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("ongoing");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const g: Record<Tab, any[]> = { ongoing: [], upcoming: [], past: [] };
    events.forEach((e) => g[classifyEvent(e)].push(e));
    // Sort upcoming by date asc, past by date desc
    g.upcoming.sort((a, b) => new Date(a.EventDate || 0).getTime() - new Date(b.EventDate || 0).getTime());
    g.past.sort((a, b) => new Date(b.EventDate || 0).getTime() - new Date(a.EventDate || 0).getTime());
    return g;
  }, [events]);

  // Auto-select first tab that has events
  useEffect(() => {
    if (!loading && events.length > 0) {
      if (grouped.ongoing.length > 0) setActiveTab("ongoing");
      else if (grouped.upcoming.length > 0) setActiveTab("upcoming");
      else setActiveTab("past");
    }
  }, [loading, events, grouped]);

  const currentEvents = grouped[activeTab];

  return (
    <>
      <PageHero
        title="Events"
        subtitle="Upcoming and past events organized by UVTAB"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }, { label: "Events" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const count = grouped[tab.key].length;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                    isActive
                      ? "bg-white text-uvtab-blue shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-uvtab-blue/10 text-uvtab-blue" : "bg-gray-200 text-gray-500"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Events list */}
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === "ongoing" ? <CalendarCheck size={28} className="text-gray-300" /> :
                 activeTab === "upcoming" ? <CalendarClock size={28} className="text-gray-300" /> :
                 <History size={28} className="text-gray-300" />}
              </div>
              <p className="text-gray-500 font-medium">No {activeTab} events at this time.</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for updates.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 gap-6"
              >
                {currentEvents.map((event, i) => {
                  const imageUrl = getImageUrl(event);
                  const fullImgUrl = getFullImageUrl(event);
                  const eventDate = event.EventDate || event.Date;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-52 bg-gradient-to-br from-uvtab-blue/5 to-uvtab-blue/10 overflow-hidden">
                        {imageUrl ? (
                          <>
                            <img
                              src={imageUrl}
                              alt={event.Title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            {fullImgUrl && (
                              <button
                                onClick={() => setLightbox(fullImgUrl)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ZoomIn size={14} />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CalendarDays size={40} className="text-uvtab-blue/15" />
                          </div>
                        )}
                        {/* Status badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          activeTab === "ongoing" ? "bg-green-500 text-white" :
                          activeTab === "upcoming" ? "bg-uvtab-gold text-white" :
                          "bg-gray-500 text-white"
                        }`}>
                          {activeTab}
                        </div>
                        {/* Date on image */}
                        {eventDate && (
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1.5">
                            <CalendarDays size={11} />
                            {new Date(eventDate).toLocaleDateString("en-UG", { year: "numeric", month: "short", day: "numeric" })}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-uvtab-blue transition-colors">
                          {event.Title}
                        </h3>
                        {event.Description && (
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                            {typeof event.Description === "string" ? event.Description : extractText(event.Description)}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-50">
                          {eventDate && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Clock size={12} />
                              {new Date(eventDate).toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                          {event.Location && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={12} />
                              {event.Location}
                            </span>
                          )}
                          {event.SeeMore && (
                            <a
                              href={event.SeeMore}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto text-xs text-uvtab-blue font-medium hover:underline"
                            >
                              Learn more →
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightbox}
            alt="Event"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
