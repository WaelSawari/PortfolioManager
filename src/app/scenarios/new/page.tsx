"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Company { id: string; name: string; totalInvestedAmount: number; ownershipPct: number; }

export default function NewScenarioPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyId: "", name: "Base Case", exitYear: String(new Date().getFullYear() + 5),
    exitMultiple: "", exitValuation: "", ourOwnershipAtExit: "",
    proceeds: "", irr: "", moic: "", notes: "",
  });

  useEffect(() => {
    fetch("/api/companies").then(r => r.json()).then(setCompanies);
  }, []);

  // Auto-calculate proceeds and MOIC when company/ownership/valuation changes
  useEffect(() => {
    const company = companies.find(c => c.id === form.companyId);
    if (company && form.exitValuation && form.ourOwnershipAtExit) {
      const proceeds = (parseFloat(form.exitValuation) * parseFloat(form.ourOwnershipAtExit)) / 100;
      const moic = company.totalInvestedAmount > 0 ? proceeds / company.totalInvestedAmount : 0;
      const years = parseFloat(form.exitYear) - new Date().getFullYear();
      const irr = years > 0 ? ((Math.pow(moic, 1 / years) - 1) * 100) : 0;
      setForm(f => ({ ...f, proceeds: proceeds.toFixed(0), moic: moic.toFixed(2), irr: irr.toFixed(1) }));
    }
  }, [form.companyId, form.exitValuation, form.ourOwnershipAtExit, form.exitYear, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/scenarios");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">New Scenario</h1>
      <p className="text-gray-500 text-sm mb-8">Model an exit scenario for a portfolio company</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Name</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}>
              {["Base Case","Bull Case","Bear Case","Custom"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exit Year</label>
            <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.exitYear} onChange={e => setForm(f => ({ ...f, exitYear: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exit Multiple (x Revenue)</label>
            <input type="number" step="0.1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.exitMultiple} onChange={e => setForm(f => ({ ...f, exitMultiple: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exit Valuation ($)</label>
            <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.exitValuation} onChange={e => setForm(f => ({ ...f, exitValuation: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Our Ownership at Exit (%)</label>
            <input type="number" step="0.1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.ourOwnershipAtExit} onChange={e => setForm(f => ({ ...f, ourOwnershipAtExit: e.target.value }))} />
          </div>
        </div>

        {(form.proceeds || form.moic || form.irr) && (
          <div className="bg-indigo-50 rounded-lg p-4 grid grid-cols-3 gap-4">
            <div><p className="text-xs text-indigo-400">Proceeds</p><p className="font-bold text-indigo-700">${(parseFloat(form.proceeds||"0")/1e6).toFixed(2)}M</p></div>
            <div><p className="text-xs text-indigo-400">MOIC</p><p className="font-bold text-indigo-700">{form.moic}x</p></div>
            <div><p className="text-xs text-indigo-400">IRR</p><p className="font-bold text-indigo-700">{form.irr}%</p></div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">{loading ? "Saving..." : "Save Scenario"}</button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
        </div>
      </form>
    </div>
  );
}