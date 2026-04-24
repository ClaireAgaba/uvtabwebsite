"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stakeholders = [
  { name: "NCHE", logo: "/images/nche.png", alt: "National Council for Higher Education" },
  { name: "NCDC", logo: "/images/ncdc.png", alt: "National Curriculum Development Centre" },
  { name: "NCS", logo: "/images/ncs.png", alt: "National Council of Sports" },
  { name: "ESC", logo: "/images/esc.png", alt: "Education Service Commission" },
  { name: "TVET", logo: "/images/tvet.png", alt: "Technical Vocational Education & Training" },
  { name: "UNEB", logo: "/images/uneb.png", alt: "Uganda National Examinations Board" },
  { name: "UIPE", logo: "/images/uipe.png", alt: "Uganda Institution of Professional Engineers" },
  { name: "HESFB", logo: "/images/hesfb.jpg", alt: "Higher Education Students Financing Board" },
];

export default function StakeholdersSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-uvtab-blue/5 text-uvtab-blue text-sm font-medium mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Key Stakeholders
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center"
        >
          {stakeholders.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-default"
            >
              <div className="w-32 h-20 relative flex items-center justify-center">
                <Image
                  src={s.logo}
                  alt={s.alt}
                  width={120}
                  height={70}
                  className="object-contain max-h-[70px]"
                />
              </div>
              <p className="text-xs text-gray-500 text-center leading-tight">
                {s.alt}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
