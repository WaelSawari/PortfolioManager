"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewLPUpdatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ period: "", title: "", tone: "professional" });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/lp-updates/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/lp-updates/${data.id}`);
    } else {
      alert("Failed to generate update. Make sure ANTHROPIC_API_KEY is set.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Generate LP Update</h1>
      <p className="text-gray-500 text-sm mb-8">AI will draft an LP update using your portfolio data</p>
      <form onSubmit={handleGenerate} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
          <input required type="text" placeholder="e.g. Q4 2025" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input required type="text" placeholder="e.g. Q4 2025 Portfolio Update" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}>
            <option value="professional">Professional</option>
            <option value="warm">Warm &amp; Conversational</option>
            <option value="concise">Concise &amp; Factual</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : "Generate with AI"}
        </button>
      </form>
    </div>
  );
}