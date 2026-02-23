export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";

export default async function MandatesPage() {
  const mandates = await prisma.mandate.findMany({
    include: { funds: { include: { investments: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Mandates & Funds</h1>
          <p className="text-gray-500 text-sm">Manage fund mandates and their underlying vehicles</p>
        </div>
        <Link href="/mandates/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Add Mandate
        </Link>
      </div>

      {mandates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No mandates yet</p>
          <Link href="/mandates/new" className="mt-3 inline-block text-indigo-600 hover:underline text-sm">Create your first mandate →</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {mandates.map((mandate) => {
            const totalUSD = mandate.funds.filter(f => f.currency === "USD").reduce((s, f) => s + f.committedCapital, 0);
            const totalEGP = mandate.funds.filter(f => f.currency === "EGP").reduce((s, f) => s + f.committedCapital, 0);
            const totalCompanies = new Set(mandate.funds.flatMap(f => f.investments.map(i => i.companyId))).size;

            return (
              <div key={mandate.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">{mandate.name}</h2>
                    {mandate.description && <p className="text-sm text-gray-500 mt-1">{mandate.description}</p>}
                  </div>
                  <Link href={`/mandates/${mandate.id}/funds/new`} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
                    <Plus size={14} /> Add Fund
                  </Link>
                </div>
                <div className="flex gap-6 text-sm text-gray-500 mb-5">
                  <span>{mandate.funds.length} fund{mandate.funds.length !== 1 ? "s" : ""}</span>
                  <span>{totalCompanies} portfolio companies</span>
                  {totalUSD > 0 && <span>${(totalUSD / 1e6).toFixed(1)}M committed (USD)</span>}
                  {totalEGP > 0 && <span>EGP {(totalEGP / 1e6).toFixed(0)}M committed (EGP)</span>}
                </div>
                {mandate.funds.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {mandate.funds.map((fund) => (
                      <Link key={fund.id} href={`/funds/${fund.id}`} className="flex items-center justify-between bg-gray-50 hover:bg-indigo-50 rounded-lg px-4 py-3 transition-colors group">
                        <div>
                          <p className="font-semibold text-sm group-hover:text-indigo-600 transition-colors">{fund.name}</p>
                          {fund.fullName && <p className="text-xs text-gray-400">{fund.fullName}</p>}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${fund.currency === "USD" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-700"}`}>
                            {fund.currency}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{fund.investments.length} cos</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <Link href={`/mandates/${mandate.id}`} className="text-sm text-indigo-600 hover:underline">View mandate details →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}