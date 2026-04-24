"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Upload,
  CheckCircle,
  XCircle,
  User,
  GraduationCap,
  MapPin,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import PageHero from "@/components/PageHero";

interface CandidateResult {
  full_name: string;
  registration_number: string;
  occupation: string;
  programme?: string;
  assessment_center: string;
  entry_year: string;
  intake: string;
  is_graduated: boolean;
  graduation_status: string;
  status?: string;
  source: string;
  source_system: "emis" | "eims";
  person_id: string;
  gender?: string;
  date_of_birth?: string;
  district?: string;
  center_number?: string;
  registration_category?: string;
  nationality?: string;
  national_id?: string;
  contact?: string;
  certificate_serial_number?: string;
  transcript_serial_number?: string;
  photo_base64?: string;
}

export default function VerificationPage() {
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<CandidateResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type: string = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      showToast("Please enter a registration number", "warning");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const [emisRes, eimsRes] = await Promise.allSettled([
        fetch(`https://emis.uvtab.go.ug/api/v1/verify/candidate?reg_no=${encodeURIComponent(trimmed)}`).then((r) =>
          r.ok ? r.json() : Promise.reject()
        ),
        fetch(`/api/eims?reg_no=${encodeURIComponent(trimmed)}`).then((r) =>
          r.ok ? r.json() : Promise.reject()
        ),
      ]);

      const allResults: CandidateResult[] = [];

      if (emisRes.status === "fulfilled" && emisRes.value?.count > 0) {
        emisRes.value.results.forEach((r: any) =>
          allResults.push({ ...r, source_system: "emis" })
        );
      }

      if (eimsRes.status === "fulfilled" && eimsRes.value?.data) {
        const e = eimsRes.value.data;
        allResults.push({
          full_name: e.full_name || "",
          registration_number: e.registration_number || trimmed,
          occupation: e.programme || e.occupation || "",
          programme: e.programme || "",
          assessment_center: e.assessment_center || "",
          entry_year: e.entry_year || "",
          intake: e.intake || "",
          is_graduated: !!e.graduated,
          graduation_status: e.graduated ? "Graduated" : "Not Graduated",
          source: "eims",
          source_system: "eims",
          person_id: e.person_id || "",
          gender: e.gender || "",
          date_of_birth: e.date_of_birth || "",
          certificate_serial_number: e.certificate_serial_number || "",
          transcript_serial_number: e.transcript_serial_number || "",
          photo_base64: e.photo_base64 || "",
        });
      }

      setResults(allResults);
      if (allResults.length === 0) {
        showToast("No candidates found in either system", "info");
      }
    } catch {
      showToast("Search failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const getSourceLabel = (c: CandidateResult) => {
    if (c.source_system === "eims") return "EIMS (Formal)";
    if (c.source === "current") return "UVTAB";
    return "DIT Legacy";
  };

  return (
    <>
      <PageHero
        title="Document Verification"
        subtitle="Verify the authenticity of UVTAB candidate certificates and transcripts"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: "Verification" }]}
      />

      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-8 h-8 text-uvtab-blue" />
              <h2 className="text-2xl font-bold text-uvtab-blue">Document Verification</h2>
            </div>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Search by registration number to confirm graduation status.
            </p>
          </motion.div>

          {/* Guide */}
          <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
            <button
              onClick={() => setGuideOpen(!guideOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Info className="w-4 h-4 text-uvtab-blue" /> How to use this portal
              </span>
              {guideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {guideOpen && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3 text-sm text-gray-600 space-y-2">
                <p>This portal verifies UVTAB candidate documents across both informal (EMIS) and formal (EIMS) systems:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-uvtab-blue text-white text-xs rounded-full">UVTAB</span>
                    <span>Current candidates (e.g., UVT001/U/25/A/HD/F/003)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-200 text-xs rounded-full">DIT</span>
                    <span>Legacy candidates (e.g., MAC/0269/01/MCM/05/25/008)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">EIMS</span>
                    <span>Formal system (e.g., BTV001/2022/T/C/M/0007)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Mode tabs */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setMode("single")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  mode === "single" ? "bg-uvtab-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Single Candidate
              </button>
              <button
                onClick={() => setMode("multiple")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  mode === "multiple" ? "bg-uvtab-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Multiple Candidates
              </button>
            </div>

            {mode === "single" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Number</label>
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g., UVT001/U/25/A/HD/F/003"
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uvtab-blue/20 focus:border-uvtab-blue outline-none transition-all text-sm"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="w-full py-3 bg-uvtab-blue text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-uvtab-blue-dark disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {loading ? "Searching..." : "Verify Candidate"}
                </button>

                {/* Results */}
                {hasSearched && !loading && (
                  <div className="mt-5">
                    {results.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                          Found {results.length} result{results.length !== 1 ? "s" : ""}
                        </p>
                        {results.map((c, i) => (
                          <div
                            key={`${c.source_system}-${c.person_id}-${i}`}
                            className={`p-4 rounded-xl border-2 transition-shadow hover:shadow-md ${
                              c.is_graduated ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900">{c.full_name}</h3>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                                  c.source_system === "eims"
                                    ? "bg-purple-100 text-purple-700"
                                    : c.source === "current"
                                    ? "bg-uvtab-blue/10 text-uvtab-blue"
                                    : "bg-gray-100 text-gray-600"
                                }`}>
                                  {getSourceLabel(c)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{c.registration_number}</span>
                              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{c.programme || c.occupation}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.assessment_center}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{c.entry_year} &middot; {c.intake}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                c.is_graduated ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              }`}>
                                {c.is_graduated ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                {c.graduation_status || c.status}
                              </span>
                              <button
                                onClick={() => setDetailCandidate(c)}
                                className="text-xs text-uvtab-blue font-semibold hover:underline"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-800 text-sm">No records found</p>
                          <p className="text-amber-600 text-xs">for &quot;{query}&quot;. Check the registration number and try again.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">Upload an Excel file with registration numbers in the first column.</p>
                <p className="text-xs text-gray-400">Bulk verification coming soon in the Next.js version.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {detailCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDetailCandidate(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-uvtab-blue text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Verification Details</span>
              </div>
              <button onClick={() => setDetailCandidate(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-uvtab-blue/5 flex items-center justify-center overflow-hidden border-2 border-gray-100">
                  {detailCandidate.photo_base64 ? (
                    <img src={`data:image/jpeg;base64,${detailCandidate.photo_base64}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-uvtab-blue/30" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{detailCandidate.full_name}</h3>
                  <div className="flex gap-1.5 mt-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      detailCandidate.source_system === "eims" ? "bg-purple-100 text-purple-700" : "bg-uvtab-blue/10 text-uvtab-blue"
                    }`}>
                      {getSourceLabel(detailCandidate)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      detailCandidate.is_graduated ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {detailCandidate.is_graduated ? "Graduated" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`rounded-xl p-3 flex items-center gap-2 text-sm ${
                detailCandidate.is_graduated ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
              }`}>
                {detailCandidate.is_graduated ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                {detailCandidate.is_graduated
                  ? "This candidate has been verified as a graduate."
                  : "This candidate is registered but has not yet graduated."}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Registration No.", detailCandidate.registration_number],
                  ["Gender", detailCandidate.gender],
                  ["Date of Birth", detailCandidate.date_of_birth],
                  [detailCandidate.source_system === "eims" ? "Programme" : "Occupation", detailCandidate.programme || detailCandidate.occupation],
                  ["Assessment Center", detailCandidate.assessment_center],
                  ["Entry Year", detailCandidate.entry_year],
                  ["Intake", detailCandidate.intake],
                  ["Certificate Serial", detailCandidate.certificate_serial_number],
                  ["Transcript Serial", detailCandidate.transcript_serial_number],
                  ["District", detailCandidate.district],
                  ["Nationality", detailCandidate.nationality],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-900">{value}</p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setDetailCandidate(null)}
                className="w-full py-2.5 bg-uvtab-blue text-white rounded-xl font-semibold hover:bg-uvtab-blue-dark transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${
            toast.type === "error" ? "bg-red-500" : toast.type === "warning" ? "bg-amber-500" : "bg-uvtab-blue"
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
