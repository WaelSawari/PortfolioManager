"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", sector: "", stage: "Seed", website: "", description: "",
    foundedYear: "", country: "", totalInvestedAmount: "", ownershipPct: "",
    currentValuation: "", status: "Active", initialInvestmentDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/portfolio/${data.id}`);
    }
    setLoading(false);
  };

  const field = (label: string, key: keyof typeof form, type = "text", opts?: string[]) => (
    <div key={key}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {opts ? (
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Add Company</h1>
      <p className="text-gray-500 text-sm mb-8">Add a new portfolio company</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {field("Company Name *", "name")}
          {field("Sector *", "sector")}
          {field("Stage", "stage", "text", ["Pre-Seed","Seed","Series A","Series B","Series C","Growth","Late Stage"])}
          {field("Status", "status", "text", ["Active","Exited","Written Off"])}
          {field("Country", "country")}
          {field("Website", "website")}
          {field("Founded Year", "foundedYear", "number")}
          {field("Initial Investment Date", "initialInvestmentDate", "date")}
          {field("Total Invested ($)", "totalInvestedAmount", "number")}
          {field("Ownership %", "ownershipPct", "number")}
          {field("Current Valuation ($)", "currentValuation", "number")}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {loading ? "Saving..." : "Add Company"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}