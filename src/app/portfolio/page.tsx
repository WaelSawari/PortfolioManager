import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PortfolioPage() {
  const companies = await prisma.company.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Portfolio</h1>
          <p className="text-gray-500 text-sm">Manage your portfolio companies</p>
        </div>
        <Link href="/portfolio/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Add Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Building2Icon />
          <p className="text-gray-500 mt-4">No companies yet</p>
          <Link href="/portfolio/new" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">Add your first portfolio company →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {companies.map((c) => (
            <Link key={c.id} href={`/portfolio/${c.id}`} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.sector} · {c.stage}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {c.status}
                </span>
              </div>
              {c.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description}</p>}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Invested</p>
                  <p className="font-medium">${(c.totalInvestedAmount / 1e6).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Ownership</p>
                  <p className="font-medium">{c.ownershipPct}%</p>
                </div>
                {c.currentValuation && (
                  <div>
                    <p className="text-gray-400 text-xs">Valuation</p>
                    <p className="font-medium">${(c.currentValuation / 1e6).toFixed(1)}M</p>
                  </div>
                )}
                {c.country && (
                  <div>
                    <p className="text-gray-400 text-xs">Country</p>
                    <p className="font-medium">{c.country}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Building2Icon() {
  return (
    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}