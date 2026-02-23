export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function FundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fund = await prisma.fund.findUnique({
    where: { id },
    include: {
      mandate: true,
      investments: {
        include: { company: true },
        orderBy: { investedAmount: "desc" },
      },
    },
  });
  if (!fund) notFound();

  const sym = fund.currency === "USD" ? "$" : "EGP ";
  const div = 1e6;
  const suffix = "M";
  const fmt = (v: number) => `${sym}${(v / div).toFixed(2)}${suffix}`;

  const totalInvested = fund.investments.reduce((s, i) => s + i.investedAmount, 0);
  const totalFV = fund.investments.reduce((s, i) => s + (i.currentFV ?? 0), 0);
  const totalRealized = fund.investments.reduce((s, i) => s + (i.realizedProceeds ?? 0), 0);
  const active = fund.investments.filter(i => i.status === "Active").length;

  const stats = [
    { label: "Committed Capital", value: fmt(fund.committedCapital) },
    { label: "Total Invested", value: fmt(totalInvested) },
    { label: "Fair Value", value: fmt(totalFV) },
    { label: "Realized Proceeds", value: fmt(totalRealized) },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/mandates" className="hover:text-gray-600">Mandates</Link>
        <span>/</span>
        <Link href={`/mandates/${fund.mandate.id}`} className="hover:text-gray-600">{fund.mandate.name}</Link>
        <span>/</span>
        <span className="text-gray-600">{fund.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{fund.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${fund.currency === "USD" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-700"}`}>
              {fund.currency}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${fund.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
              {fund.status}
            </span>
          </div>
          {fund.fullName && <p className="text-gray-500 text-sm">{fund.fullName}</p>}
          <p className="text-xs text-gray-400 mt-1">
            Vintage {fund.vintageYear ?? "—"} · {fund.managementFeePct ?? "—"}% Mgmt Fee · {fund.carryPct ?? "—"}% Carry
          </p>
        </div>
        <Link href={`/funds/${id}/add-company`} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus size={16} /> Add Company
        </Link>
      </div>

      {fund.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-sm text-amber-800 mb-6">
          {fund.notes}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">Portfolio ({fund.investments.length} companies · {active} active)</h2>
        </div>
        {fund.investments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No companies yet. <Link href={`/funds/${id}/add-company`} className="text-indigo-600 hover:underline">Add a company →</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                {["Company", "Sector", "Stage", `Invested (${fund.currency})`, "Ownership %", `FV (${fund.currency})`, "Status"].map(h => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fund.investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/portfolio/${inv.companyId}`} className="font-medium text-indigo-600 hover:underline">
                      {inv.company.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{inv.company.sector}</td>
                  <td className="px-5 py-3 text-gray-600">{inv.company.stage}</td>
                  <td className="px-5 py-3 text-gray-600">{fmt(inv.investedAmount)}</td>
                  <td className="px-5 py-3 text-gray-600">{inv.ownershipPct > 0 ? `${inv.ownershipPct.toFixed(2)}%` : "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{inv.currentFV != null ? fmt(inv.currentFV) : "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inv.status === "Active" ? "bg-emerald-50 text-emerald-600" : inv.status === "Exited" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}