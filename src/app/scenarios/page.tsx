import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, TrendingUp } from "lucide-react";

export default async function ScenariosPage() {
  const scenarios = await prisma.scenario.findMany({
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Scenario Modeling</h1>
          <p className="text-gray-500 text-sm">Model exit scenarios and projected returns</p>
        </div>
        <Link href="/scenarios/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus size={16} /> New Scenario
        </Link>
      </div>

      {scenarios.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No scenarios yet</p>
          <Link href="/scenarios/new" className="mt-3 inline-block text-indigo-600 hover:underline text-sm">Create your first scenario →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                {["Company","Scenario","Exit Year","Exit Val","Proceeds","MOIC","IRR"].map(h => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scenarios.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium">{s.company.name}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.name === "Bull Case" ? "bg-emerald-50 text-emerald-600" : s.name === "Bear Case" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}>
                      {s.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{s.exitYear}</td>
                  <td className="px-5 py-3 text-gray-600">${(s.exitValuation / 1e6).toFixed(0)}M</td>
                  <td className="px-5 py-3 text-gray-600">${(s.proceeds / 1e6).toFixed(1)}M</td>
                  <td className="px-5 py-3 font-semibold">{s.moic?.toFixed(2)}x</td>
                  <td className="px-5 py-3 text-emerald-600 font-medium">{s.irr?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}