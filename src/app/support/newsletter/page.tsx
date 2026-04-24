"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Send } from "lucide-react";
import PageHero from "@/components/PageHero";
import { subscribeNewsletter } from "@/lib/strapi";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    const ok = await subscribeNewsletter(email);
    if (ok) {
      setSuccess(true);
      setEmail("");
    } else {
      setError("Failed to subscribe. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <PageHero
        title="Newsletter"
        subtitle="Stay informed with UVTAB updates delivered to your inbox"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Support" }, { label: "Newsletter" }]}
      />

      <section className="section-padding">
        <div className="max-w-lg mx-auto text-center">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Subscribed!</h2>
              <p className="text-gray-500 mb-6">You&apos;ll receive UVTAB updates at your email address.</p>
              <button onClick={() => setSuccess(false)} className="text-uvtab-blue font-semibold hover:underline">
                Subscribe another email
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 bg-uvtab-blue/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-uvtab-blue" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-gray-500 mb-8">Get the latest news, announcements, and updates from UVTAB.</p>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}

              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-uvtab-blue text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-uvtab-blue-dark disabled:opacity-50 transition-colors shrink-0"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                  Subscribe
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
