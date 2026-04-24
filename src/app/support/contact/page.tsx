"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Building2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import axios from "axios";

const STRAPI_URL = "https://nice-books-5133946fb0.strapiapp.com/api";

export default function ContactPage() {
  const [form, setForm] = useState({ Name: "", Email: "", Subject: "", Message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Name || !form.Email || !form.Subject || !form.Message) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`${STRAPI_URL}/contact-inquiries`, { data: form });
      setSuccess(true);
      setForm({ Name: "", Email: "", Subject: "", Message: "" });
    } catch {
      setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with the UVTAB team"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Support" }, { label: "Contact Us" }]}
      />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info - Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
              {/* Location */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <MapPin size={18} className="text-uvtab-blue" />
                  Our Location
                </h2>
                <p className="text-gray-600 text-sm">
                  Plot 891, Kigobe Road Kyambogo<br />P.O Box 1499, Kampala
                </p>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Clock size={18} className="text-uvtab-blue" />
                  Opening Hours
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Monday - Friday</p>
                  <p className="font-medium text-gray-900">8:00 AM - 5:00 PM</p>
                </div>
              </div>

              {/* Department Contacts */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Building2 size={18} className="text-uvtab-blue" />
                  Department Contacts
                </h2>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">General Inquiries</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Mail size={13} /> info@uvtab.go.ug
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <Phone size={13} /> 0392002468
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Accreditation</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Mail size={13} /> info@uvtab.go.ug
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <Phone size={13} /> 0787093112
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Registration</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Mail size={13} /> info@uvtab.go.ug
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <Phone size={13} /> 0753070256
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form - Right */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                {success ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Message Sent Successfully!</h4>
                    <p className="text-gray-500 text-sm mb-6">Your message has been sent successfully! We will get back to you soon.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-uvtab-blue font-semibold text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                        <input
                          type="text"
                          name="Name"
                          value={form.Name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                        <input
                          type="email"
                          name="Email"
                          value={form.Email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                      <input
                        type="text"
                        name="Subject"
                        value={form.Subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm"
                        placeholder="Subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your message *</label>
                      <textarea
                        name="Message"
                        value={form.Message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">{error}</div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-uvtab-blue text-white rounded-xl font-semibold hover:bg-uvtab-blue-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      {loading ? "Sending..." : "Submit"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <div className="mt-10 rounded-2xl overflow-hidden border border-gray-100 h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7574!2d32.6301!3d0.3476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0!2sUVTAB!5e0!3m2!1sen!2sug!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="UVTAB Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
