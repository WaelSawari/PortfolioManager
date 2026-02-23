"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Company = { id: string; name: string; sector: string; };
type Fund = { id: string; name: string; currency: string; mandate: { name: string; id: string } };

export default function AddCompanyForm({ fund, availableCompanies }: { fund: Fund; availableCompanies: Company[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyId: "", investedAmount: "", ownershipPct: "",
    currentFV: "", investmentDate: "", status: "Active", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/funds/${fund.id}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push(`/funds/${fund.id}`);
    setLoading(false);
  };

  const sym = fund.currency === "USD" ? "$" : "EGP";

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <a href="/mandates" className="hover:text-gray-600">Mandates</a>
        <span>/</span>
        <a href={`/mandates/${fund.mandate.id}`} className="hover:text-gray-600">{fund.mandate.name}</a>
        <span>/</span>
        <a href={`/funds/${fund.id}`} className="hover:text-gray-600">{fund.name}</a>
        <span>/</span>
        <span className="text-gray-600">Add Company</span>
      </div>
      <h1 className="text-2xl font-bold mb-1">Add Company to {fund.name}</h1>
      <p className="text-gray-500 text-sm mb-8">All amounts in {fund.currency}</p>
      {availableCompanies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
          All portfolio companies are already in this fund.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.companyId} onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}>
              <option value="">Select company...</option>
              {availableCompanies.map(c => <option key={c.id} value={c.id}>{c.name} — {c.sector}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invested Amount ({sym})</label>
              <input type="number" step="any" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.investedAmount} onChange={e => setForm(f => ({ ...f, investedAmount: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ownership %</label>
              <input type="number" step="0.001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.ownershipPct} onChange={e => setForm(f => ({ ...f, ownershipPct: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current FV ({sym})</label>
              <input type="number" step="any" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.currentFV} onChange={e => setForm(f => ({ ...f, currentFV: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Date</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.investmentDate} onChange={e => setForm(f => ({ ...f, investmentDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["Active","Exited","Written Off"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Adding..." : "Add to Fund"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}