"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Star, Rocket, ListChecks } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getAboutUs, extractText, type AboutUs } from "@/lib/strapi";

export default function AboutPage() {
  const [data, setData] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutUs()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Learn about UVTAB's mission, vision, and commitment to excellence"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-uvtab-blue/20 border-t-uvtab-blue rounded-full animate-spin" />
            </div>
          ) : !data ? (
            <div className="text-center py-12 bg-amber-50 rounded-xl">
              <p className="text-amber-700">No about us information is currently available.</p>
            </div>
          ) : (
            <>
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-lg max-w-none mb-16"
              >
                <p className="text-gray-600 leading-relaxed text-lg">
                  {extractText(data.Introduction)}
                </p>
              </motion.div>

              {/* Our Philosophy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-uvtab-blue mb-4">Our Philosophy</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  At UVTAB, our core philosophy is rooted in unwavering commitment to excellent customer service.
                  Customer focus is our way of life.
                </p>
              </motion.div>

              {/* Mission, Vision, Core Values */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {/* Mission */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-uvtab-blue to-uvtab-blue-light text-white p-8 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Target className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{data.Mission?.Title || "Mission"}</h3>
                    <p className="text-white/90 leading-relaxed text-sm">
                      {extractText(data.Mission?.Description || [])}
                    </p>
                  </div>
                </motion.div>

                {/* Vision */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 to-green-500 text-white p-8 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Eye className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{data.Vision?.Title || "Vision"}</h3>
                    <p className="text-white/90 leading-relaxed text-sm">
                      {extractText(data.Vision?.Description || [])}
                    </p>
                  </div>
                </motion.div>

                {/* Core Values */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-orange-400 text-white p-8 group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Core Values</h3>
                    <div className="space-y-2 mt-3">
                      {data.CoreValues?.[0]?.Description?.split("\n").map((value: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white/80 rounded-full shrink-0" />
                          <span className="text-white/90 text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mode of Assessment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-uvtab-blue text-center mb-10">
                  Mode of Competence Based Assessment
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Continuous Assessment */}
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-uvtab-blue mb-4">Continuous Assessment</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {["Course Work", "Industrial Training", "Real Life Projects"].map((item) => (
                        <div
                          key={item}
                          className="w-28 h-28 rounded-full bg-uvtab-blue/5 flex items-center justify-center text-sm font-medium text-uvtab-blue"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:block text-4xl text-uvtab-blue/20 font-light">&#x2192;</div>
                  {/* Final Assessment */}
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-uvtab-blue mb-4">Final Assessment</h3>
                    <div className="flex justify-center gap-3">
                      {["Theory Assessment", "Practical Assessment"].map((item) => (
                        <div
                          key={item}
                          className="w-32 h-32 rounded-full bg-uvtab-blue/5 flex items-center justify-center text-sm font-medium text-uvtab-blue text-center p-2"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:block text-4xl text-uvtab-blue/20 font-light">&#x2192;</div>
                  {/* Certification */}
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-uvtab-blue mb-4">Certification</h3>
                    <div className="w-40 h-40 rounded-full bg-uvtab-blue/10 flex items-center justify-center text-lg font-semibold text-uvtab-blue mx-auto">
                      Awards
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Goal & Strategic Objectives */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-gradient-to-br from-uvtab-blue to-uvtab-blue-light text-white p-8 hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Goal</h3>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    To contribute to a productive, self-reliant, competitive and employable workforce for improved quality of life.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-gradient-to-br from-blue-50 to-orange-50 p-8 hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-uvtab-blue/10 rounded-full flex items-center justify-center">
                      <ListChecks className="w-6 h-6 text-uvtab-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-uvtab-blue">Strategic Objectives</h3>
                  </div>
                  <ol className="space-y-3 text-gray-700">
                    <li className="leading-relaxed">1) To enhance the conduct and regulation of Competence-Based Assessment (CBA) and certification for credible TVET awards;</li>
                    <li className="leading-relaxed">2) To strengthen the responsiveness of the TVET curriculum to match the needs of the World of Work; and</li>
                    <li className="leading-relaxed">3) To strengthen the capacity of UVTAB for efficient and effective service delivery.</li>
                  </ol>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
