"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NewRoundPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    roundName: "Series A", date: "", preMoneyVal: "", postMoneyVal: "",
    roundSize: "", ourInvestment: "", leadInvestor: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/companies/${companyId}/rounds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push(`/portfolio/${companyId}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Add Funding Round</h1>
      <p className="text-gray-500 text-sm mb-8">Record a new funding round</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {([
            ["Round Name", "roundName", "text", ["Pre-Seed","Seed","Series A","Series B","Series C","Growth","Bridge"]],
            ["Date", "date", "date"],
            ["Pre-Money Val ($)", "preMoneyVal", "number"],
            ["Post-Money Val ($)", "postMoneyVal", "number"],
            ["Round Size ($)", "roundSize", "number"],
            ["Our Investment ($)", "ourInvestment", "number"],
            ["Lead Investor", "leadInvestor", "text"],
          ] as [string, string, string, string[]?][]).map(([label, key, type, opts]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {opts ? (
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Round"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}