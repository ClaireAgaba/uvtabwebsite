"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { getAnnouncements } from "@/lib/strapi";

export default function AnnouncementBar() {
  const [items, setItems] = useState<{ title: string; content: string }[]>([]);

  useEffect(() => {
    getAnnouncements().then((data) => {
      const active = data.filter((a: any) => a.Active !== false && a.isActive !== false);
      if (active.length > 0) {
        setItems(
          active.map((a) => ({
            title: a.Title || "",
            content: a.Content || "",
          }))
        );
      }
    });
  }, []);

  if (items.length === 0) return null;

  // Duplicate items to ensure seamless loop
  const marqueeContent = [...items, ...items];

  return (
    <div className="fixed top-0 left-0 right-0 bg-uvtab-blue-dark text-white text-xs overflow-hidden z-[60]">
      <div className="flex items-center">
        {/* Fixed label */}
        <div className="bg-uvtab-gold text-uvtab-blue-dark px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 z-10">
          <Megaphone size={13} />
          <span className="hidden sm:inline">Updates</span>
        </div>

        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden py-1.5">
          <div className="flex animate-marquee whitespace-nowrap">
            {marqueeContent.map((item, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-2">
                <span className="w-1 h-1 bg-uvtab-gold rounded-full shrink-0" />
                <span>
                  <span className="font-bold text-uvtab-gold">{item.title}</span>
                  {item.content && <span className="text-white/90">{": "}{item.content}</span>}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
