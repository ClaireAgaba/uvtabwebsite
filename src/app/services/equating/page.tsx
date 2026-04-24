"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Upload, Send, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import axios from "axios";

const API_URL = "https://nice-books-5133946fb0.strapiapp.com/api";

export default function EquatingPage() {
  const [form, setForm] = useState({ FullName: "", EmailAddress: "", PhoneNumber: "" });
  const [invoice, setInvoice] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.FullName || !form.EmailAddress || !form.PhoneNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        FullName: form.FullName,
        EmailAddress: form.EmailAddress,
        PhoneNumber: Number(form.PhoneNumber),
      }));
      if (invoice) formData.append("files.invoice", invoice);
      documents.forEach((doc) => formData.append("files.Documents", doc));

      await axios.post(`${API_URL}/equatings`, formData);
      setSuccess(true);
      setForm({ FullName: "", EmailAddress: "", PhoneNumber: "" });
      setInvoice(null);
      setDocuments([]);
    } catch (err: any) {
      setError("Failed to submit. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title="Equating Services"
        subtitle="Apply for equating of your vocational and technical qualifications"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: "Equating" }]}
      />

      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
              <p className="text-gray-500 mb-6">Your equating application has been received. We will contact you via email.</p>
              <button onClick={() => setSuccess(false)} className="px-6 py-2.5 bg-uvtab-blue text-white rounded-xl font-semibold hover:bg-uvtab-blue-dark transition-colors">
                Submit Another
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="w-6 h-6 text-uvtab-blue" />
                <h2 className="text-xl font-bold text-gray-900">Equating Application Form</h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" value={form.FullName} onChange={(e) => setForm({ ...form, FullName: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" value={form.EmailAddress} onChange={(e) => setForm({ ...form, EmailAddress: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm" placeholder="your@email.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input type="tel" value={form.PhoneNumber} onChange={(e) => setForm({ ...form, PhoneNumber: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none text-sm" placeholder="e.g., 0770123456" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Invoice</label>
                <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-uvtab-blue/30 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{invoice ? invoice.name : "Choose invoice file"}</span>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setInvoice(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supporting Documents</label>
                <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-uvtab-blue/30 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{documents.length > 0 ? `${documents.length} file(s) selected` : "Choose documents"}</span>
                  <input type="file" className="hidden" multiple accept="image/*,.pdf,.doc,.docx" onChange={(e) => setDocuments(Array.from(e.target.files || []))} />
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-uvtab-blue text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-uvtab-blue-dark disabled:opacity-50 transition-colors">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
