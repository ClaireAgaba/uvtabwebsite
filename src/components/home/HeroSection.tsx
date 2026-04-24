"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHeroSlides, type HeroSlide } from "@/lib/strapi";

const SLIDE_DURATION = 7000; // 7 seconds per slide

const fallbackSlides = [
  {
    id: 0,
    Title: "Uganda Vocational & Technical Assessment Board",
    description: "Regulating, coordinating and conducting credible, fair and valid assessments for vocational and technical education in Uganda.",
    imageUrl: "",
    link: "/about",
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState<
    { id: number; Title: string; description: string; imageUrl: string; link: string }[]
  >(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch slides from Strapi
  useEffect(() => {
    getHeroSlides().then((items) => {
      if (items.length > 0) {
        const mapped = items.map((s) => {
          const media = Array.isArray(s.Media) ? s.Media : [];
          const imageUrl = media.length > 0 ? (media[0].url || "") : "";
          const desc =
            typeof s.Description === "string"
              ? s.Description
              : Array.isArray(s.Description)
              ? s.Description.map((b: any) => b?.children?.map((c: any) => c.text).join("") || "").join(" ")
              : "";
          return {
            id: s.id,
            Title: s.Title || "",
            description: desc,
            imageUrl,
            link: s.ReadMoreUrl || "",
          };
        });
        setSlides(mapped);
      }
    });
  }, []);

  // Auto-advance with progress
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);
    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
    }, 50);

    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, slides.length, startTimer]);

  const goTo = (index: number) => {
    setCurrent(index);
  };

  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  const slide = slides[current];
  const hasImage = !!slide?.imageUrl;

  return (
    <section className="relative mt-7 overflow-hidden" style={{ height: "75vh", minHeight: "450px" }}>
      {/* Background: image slideshow OR gradient fallback */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {hasImage ? (
            <img
              src={slide.imageUrl}
              alt={slide.Title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 gradient-hero" />
          )}
          {/* Light bottom gradient only — so the image stays visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Caption bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Slide title + description */}
        <div className="max-w-5xl mx-auto px-6 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold drop-shadow-lg mb-1">
                {slide.Title}
              </h2>
              {slide.description && (
                <p className="text-white/80 text-sm drop-shadow-md line-clamp-2 max-w-2xl">
                  {slide.description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-3 bg-black/20 backdrop-blur-sm">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-7 h-2 bg-uvtab-gold"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
