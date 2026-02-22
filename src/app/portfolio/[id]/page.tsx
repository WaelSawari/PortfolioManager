export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: { rounds: { orderBy: { date: "desc" } }, kpis: { orderBy: { date: "desc" }, take: 5 }, scenarios: true },
  });
  if (!company) notFound();

  const latestKPI = company.kpis[0];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/portfolio" className="text-gray-400 hover:text-gray-600 text-sm">Portfolio</Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-600">{company.name}</span>
          </div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-gray-500 text-sm">{company.sector} · {company.stage} · {company.country}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${company.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
          {company.status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Invested", value: `$${(company.totalInvestedAmount / 1e6).toFixed(2)}M` },
          { label: "Ownership", value: `${company.ownershipPct}%` },
          { label: "Valuation", value: company.currentValuation ? `$${(company.currentValuation / 1e6).toFixed(1)}M` : "—" },
          { label: "ARR", value: latestKPI?.arr ? `$${(latestKPI.arr / 1e6).toFixed(2)}M` : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {company.description && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-600">{company.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold">Funding Rounds</h2>
            <Link href={`/portfolio/${id}/rounds/new`} className="text-indigo-600 text-sm hover:underline">+ Add Round</Link>
          </div>
          {company.rounds.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No rounds recorded</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {company.rounds.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{r.roundName}</span>
                    <span className="text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>Size: ${(r.roundSize / 1e6).toFixed(1)}M</span>
                    <span>Our check: ${(r.ourInvestment / 1e6).toFixed(2)}M</span>
                    <span>Post-money: ${(r.postMoneyVal / 1e6).toFixed(1)}M</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold">Recent KPIs</h2>
            <Link href={`/kpis/new?companyId=${id}`} className="text-indigo-600 text-sm hover:underline">+ Log KPIs</Link>
          </div>
          {company.kpis.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No KPIs logged yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {company.kpis.map((k) => (
                <div key={k.id} className="p-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{k.period}</span>
                    <span className="text-xs text-gray-400">{new Date(k.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {k.arr && <span>ARR: ${(k.arr / 1e6).toFixed(2)}M</span>}
                    {k.mrr && <span>MRR: ${(k.mrr / 1e3).toFixed(0)}K</span>}
                    {k.headcount && <span>HC: {k.headcount}</span>}
                    {k.runway && <span>Runway: {k.runway}mo</span>}
                    {k.burnRate && <span>Burn: ${(k.burnRate / 1e3).toFixed(0)}K/mo</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}