"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

const leaders = [
  {
    name: "Onesmus Oyesigye (CPA)",
    title: "Executive Secretary",
    image: "/es.png",
    statement:
      "Welcome to our website, lol will edit this after its shared",
  },
  {
    name: "Board Chairperson",
    title: "Chairperson, UVTAB Board",
    image: "/boardchair.png",
    statement:
      "Welcome to UVTAB website, will edit this once its also shared",
  },
];

export default function LeadershipStatements() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-uvtab-gold font-semibold text-sm uppercase tracking-wider">
            Leadership
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Opening Statements
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-uvtab-blue to-uvtab-gold mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {leaders.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-500 group"
            >
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-uvtab-blue via-uvtab-gold to-uvtab-blue" />

              <div className="p-8 md:p-10">
                {/* Quote icon */}
                <div className="absolute top-8 right-8 opacity-[0.06]">
                  <Quote size={80} className="text-uvtab-blue" />
                </div>

                {/* Profile */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-uvtab-gold/30 shadow-lg shrink-0 group-hover:border-uvtab-gold transition-colors duration-300">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-top"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                      {leader.name}
                    </h3>
                    <p className="text-uvtab-blue font-medium text-sm mt-0.5">
                      {leader.title}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-uvtab-gold/40 mb-5 rounded-full" />

                {/* Statement */}
                <p className="text-gray-600 leading-relaxed text-[15px] relative z-10 italic">
                  &ldquo;{leader.statement}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
