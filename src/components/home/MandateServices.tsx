"use client";

import { motion } from "framer-motion";
import { Target, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MandateServices() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-uvtab-blue/5 text-uvtab-blue text-sm font-medium mb-4">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Mandate & Services
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mandate Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-uvtab-blue to-uvtab-blue-light" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-uvtab-blue/10 flex items-center justify-center group-hover:bg-uvtab-blue group-hover:text-white transition-all">
                <Target size={24} className="text-uvtab-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mandate</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              To regulate, coordinate, and conduct assessments for Business,
              Technical, Vocational Education and Training (BTVET) in Uganda,
              ensuring quality standards and credible certification processes
              that meet industry requirements and international benchmarks.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-uvtab-blue font-medium hover:gap-3 transition-all"
            >
              Read more <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Services Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-uvtab-gold to-uvtab-gold-light" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-uvtab-gold/10 flex items-center justify-center group-hover:bg-uvtab-gold transition-all">
                <Briefcase size={24} className="text-uvtab-gold group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Services</h3>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "Registration and assessment of candidates",
                "Accreditation of assessment centers",
                "Development of assessment instruments",
                "Quality assurance and standards",
                "Document verification and certification",
                "Equating of qualifications",
              ].map((service) => (
                <li key={service} className="flex items-start gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-uvtab-gold mt-2 shrink-0" />
                  {service}
                </li>
              ))}
            </ul>
            <Link
              href="/services/verification"
              className="inline-flex items-center gap-2 text-uvtab-gold font-medium hover:gap-3 transition-all"
            >
              Explore services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
