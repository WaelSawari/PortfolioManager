export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MandateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = await prisma.mandate.findUnique({
    where: { id },
    include: { funds: { include: { investments: true }, orderBy: { name: "asc" } } },
  });
  if (!mandate) notFound();

  const totalCompanies = new Set(mandate.funds.flatMap(f => f.investments.map(i => i.companyId))).size;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/mandates" className="hover:text-gray-600">Mandates</Link>
        <span>/</span>
        <span className="text-gray-600">{mandate.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{mandate.name}</h1>
          {mandate.description && <p className="text-gray-500 text-sm mt-1">{mandate.description}</p>}
          <p className="text-xs text-gray-400 mt-2">{mandate.funds.length} funds · {totalCompanies} portfolio companies</p>
        </div>
        <Link href={`/mandates/${id}/funds/new`} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus size={16} /> Add Fund
        </Link>
      </div>

      {mandate.funds.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          No funds yet. <Link href={`/mandates/${id}/funds/new`} className="text-indigo-600 hover:underline">Add a fund →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {mandate.funds.map((fund) => {
            const invested = fund.investments.reduce((s, i) => s + i.investedAmount, 0);
            const fv = fund.investments.reduce((s, i) => s + (i.currentFV ?? 0), 0);
            const active = fund.investments.filter(i => i.status === "Active").length;
            const sym = fund.currency === "USD" ? "$" : "EGP ";
            const div = fund.currency === "USD" ? 1e6 : 1e6;
            const suffix = "M";

            return (
              <Link key={fund.id} href={`/funds/${fund.id}`} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{fund.name}</h3>
                    {fund.fullName && <p className="text-xs text-gray-400">{fund.fullName}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${fund.currency === "USD" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-700"}`}>
                    {fund.currency}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Committed</p>
                    <p className="font-semibold">{sym}{(fund.committedCapital / div).toFixed(1)}{suffix}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Invested</p>
                    <p className="font-semibold">{sym}{(invested / div).toFixed(1)}{suffix}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fair Value</p>
                    <p className="font-semibold">{sym}{(fv / div).toFixed(1)}{suffix}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Companies</p>
                    <p className="font-semibold">{fund.investments.length} ({active} active)</p>
                  </div>
                </div>
                {fund.vintageYear && <p className="text-xs text-gray-400">Vintage {fund.vintageYear}</p>}
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${fund.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    {fund.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}