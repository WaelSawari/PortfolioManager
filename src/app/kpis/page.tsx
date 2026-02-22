export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function KPIsPage() {
  const companies = await prisma.company.findMany({
    include: { kpis: { orderBy: { date: "desc" }, take: 3 } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">KPI Dashboard</h1>
          <p className="text-gray-500 text-sm">Track performance metrics across portfolio</p>
        </div>
        <Link href="/kpis/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          + Log KPIs
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-400">
          Add companies first to start logging KPIs.
        </div>
      ) : (
        <div className="space-y-6">
          {companies.map((company) => {
            const latest = company.kpis[0];
            const prev = company.kpis[1];
            const arrGrowth = latest?.arr && prev?.arr ? ((latest.arr - prev.arr) / prev.arr * 100).toFixed(1) : null;
            return (
              <div key={company.id} className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-xs text-gray-400">{company.sector} · {company.stage}</p>
                  </div>
                  <Link href={`/kpis/new?companyId=${company.id}`} className="text-indigo-600 text-sm hover:underline">+ Log</Link>
                </div>
                {!latest ? (
                  <p className="p-5 text-sm text-gray-400">No KPIs logged yet</p>
                ) : (
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-3">Latest: {latest.period}</p>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        { label: "ARR", value: latest.arr ? `$${(latest.arr/1e6).toFixed(2)}M` : "—" },
                        { label: "MRR", value: latest.mrr ? `$${(latest.mrr/1e3).toFixed(0)}K` : "—" },
                        { label: "Burn/mo", value: latest.burnRate ? `$${(latest.burnRate/1e3).toFixed(0)}K` : "—" },
                        { label: "Cash", value: latest.cashBalance ? `$${(latest.cashBalance/1e6).toFixed(1)}M` : "—" },
                        { label: "Runway", value: latest.runway ? `${latest.runway}mo` : "—" },
                        { label: "Headcount", value: latest.headcount ?? "—" },
                      ].map((m) => (
                        <div key={m.label}>
                          <p className="text-xs text-gray-400">{m.label}</p>
                          <p className="font-semibold text-sm">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    {arrGrowth && (
                      <p className="mt-3 text-xs text-emerald-600">ARR growth MoM: +{arrGrowth}%</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}