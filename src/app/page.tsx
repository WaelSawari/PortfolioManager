import { prisma } from "@/lib/prisma";
import { DollarSign, Building2, TrendingUp, Users } from "lucide-react";

export default async function DashboardPage() {
  const companies = await prisma.company.findMany({ include: { kpis: { orderBy: { date: "desc" }, take: 1 } } });
  const totalInvested = companies.reduce((s, c) => s + c.totalInvestedAmount, 0);
  const totalValue = companies.reduce((s, c) => s + (c.currentValuation ?? 0) * (c.ownershipPct / 100), 0);
  const active = companies.filter((c) => c.status === "Active").length;

  const stats = [
    { label: "Total Invested", value: `$${(totalInvested / 1e6).toFixed(1)}M`, icon: DollarSign, color: "text-indigo-600 bg-indigo-50" },
    { label: "Portfolio Companies", value: companies.length, icon: Building2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Companies", value: active, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Portfolio Value", value: `$${(totalValue / 1e6).toFixed(1)}M`, icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8 text-sm">Overview of your portfolio</p>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold">Portfolio Companies</h2>
        </div>
        {companies.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No companies yet. <a href="/portfolio/new" className="text-indigo-600 hover:underline">Add your first company →</a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Sector</th>
                <th className="px-5 py-3 font-medium">Stage</th>
                <th className="px-5 py-3 font-medium">Invested</th>
                <th className="px-5 py-3 font-medium">Ownership</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <a href={`/portfolio/${c.id}`} className="font-medium text-indigo-600 hover:underline">{c.name}</a>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.sector}</td>
                  <td className="px-5 py-3 text-gray-600">{c.stage}</td>
                  <td className="px-5 py-3 text-gray-600">${(c.totalInvestedAmount / 1e6).toFixed(2)}M</td>
                  <td className="px-5 py-3 text-gray-600">{c.ownershipPct}%</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-emerald-50 text-emerald-600" : c.status === "Exited" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}>
                      {c.status}
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