"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quote, ChevronDown } from "lucide-react";

const leaders = [
  {
    name: "Onesmus Oyesigye (CPA)",
    title: "Executive Secretary",
    image: "/es.png",
    statement:
      "I am pleased to welcome you to UVTAB Website. UVTAB is a national TVET assessment body established by the TVET Act No.3 of 2025. UVTAB is responsible for the assessment and certification of competencies obtained through formal and informal TVET. The Board is responsible for the development of Assessment Training Packages and TVET curricular in consultation with the Sector Skills Expert committees, TVTE provider and with approval of TVET Council.\n\nThe Board is guided by the philosophy of customer centredness in all that we do in order to build mutual relationships with stakeholders. We are also guided by three strategic objective to deliver our mandate.\n\nGuided by our vision and mission and core values, the Board is committed to conducting quality assessments and development of Assessment Training Packages and TVET curriculum that address the needs of the industry — TVET that is employer-led. In all our processes, we remain committed to working with the professionals and Experts in various TVET fields in line with our mandate. We encourage various practitioners and employers who need to certify their skills for recognition of their competencies for competitiveness and professional growth.\n\nI invite you to partner with UVTAB to drive the assessment and certification of TVET programmes and occupations as well as the development of Assessment Training Packages and curricular.",
  },
  {
    name: "Assoc. Prof. Dorothy Okello",
    title: "Board Chairperson",
    image: "/boardchair.png",
    statement:
      "On behalf of the Board of Uganda Vocational and Technical Assessment Board (UVTAB), I am pleased to welcome you to our official website. UVTAB is the national assessment body responsible for the assessment and certification of competencies obtained through both formal and informal TVET in Uganda.\n\nThe Board plays a vital role in the national TVET landscape, including assessing TVET candidates, accrediting TVET providers as assessment centers, awarding TVET qualifications, and developing training packages and curricula for TVET programs. Additionally, the Board undertakes research projects in priority areas such as TVET graduate tracer studies, assessment and delivery methods, as well as technology and innovation.\n\nThis website serves as an interactive platform for stakeholders involved in the delivery, assessment, regulation, and policy development of TVET. It offers access to relevant and up-to-date information on the status of TVET assessment and curriculum development in Uganda and beyond.\n\nThe Board is dedicated to providing strategic guidance and oversight to the UVTAB Secretariat to fulfill its mandate. This includes the development and promotion of evidence-based policies, demand-driven curricula, assessment training packages, and the assessment and certification of TVET trainees. Our goal is to produce skilled and knowledgeable artisans and technicians who will contribute to social and economic transformation and national development.\n\nI trust you will find this website beneficial as you explore and access the information and updates provided. We encourage your feedback and suggestions to help UVTAB better fulfill its mandate.",
  },
];

function LeaderCard({ leader, index }: { leader: typeof leaders[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = leader.statement.split("\n\n");
  const preview = paragraphs[0];
  const hasMore = paragraphs.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
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
        <div className="relative z-10">
          <p className="text-gray-600 leading-relaxed text-[15px] italic">
            &ldquo;{preview}
            {!hasMore || expanded ? "&rdquo;" : "...&rdquo;"}
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {paragraphs.slice(1).map((p, pi) => (
                  <p key={pi} className="text-gray-600 leading-relaxed text-[15px] italic mt-4">
                    {p}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 inline-flex items-center gap-1.5 text-uvtab-blue font-semibold text-sm hover:gap-2.5 transition-all"
            >
              {expanded ? "Show less" : "Read more"}
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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
            <LeaderCard key={leader.name} leader={leader} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
