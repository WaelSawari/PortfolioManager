"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Company { id: string; name: string; }

function NewKPIForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyId: searchParams.get("companyId") ?? "",
    period: "", date: new Date().toISOString().split("T")[0],
    arr: "", mrr: "", revenue: "", grossMargin: "",
    burnRate: "", cashBalance: "", runway: "",
    headcount: "", customers: "", growthMoM: "", notes: "",
  });

  useEffect(() => {
    fetch("/api/companies").then(r => r.json()).then(setCompanies);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/kpis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/kpis");
    setLoading(false);
  };

  const numField = (label: string, key: keyof typeof form) => (
    <div key={key}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="number" step="any" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Log KPIs</h1>
      <p className="text-gray-500 text-sm mb-8">Record performance metrics for a portfolio company</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.companyId} onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}>
              <option value="">Select company...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
            <input required type="text" placeholder="e.g. Q1 2025" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
        </div>
        <hr className="border-gray-100" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Financials</p>
        <div className="grid grid-cols-3 gap-4">
          {numField("ARR ($)", "arr")}
          {numField("MRR ($)", "mrr")}
          {numField("Revenue ($)", "revenue")}
          {numField("Gross Margin (%)", "grossMargin")}
          {numField("Burn Rate ($/mo)", "burnRate")}
          {numField("Cash Balance ($)", "cashBalance")}
          {numField("Runway (months)", "runway")}
        </div>
        <hr className="border-gray-100" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Growth</p>
        <div className="grid grid-cols-3 gap-4">
          {numField("Headcount", "headcount")}
          {numField("Customers", "customers")}
          {numField("Growth MoM (%)", "growthMoM")}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">{loading ? "Saving..." : "Save KPIs"}</button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function NewKPIPage() {
  return <Suspense><NewKPIForm /></Suspense>;
}