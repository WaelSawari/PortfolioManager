export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default async function LPUpdatesPage() {
  const updates = await prisma.lPUpdate.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">LP Updates</h1>
          <p className="text-gray-500 text-sm">Generate and manage LP update reports</p>
        </div>
        <Link href="/lp-updates/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus size={16} /> Generate Update
        </Link>
      </div>

      {updates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No LP updates yet</p>
          <Link href="/lp-updates/new" className="mt-3 inline-block text-indigo-600 hover:underline text-sm">Generate your first LP update →</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {updates.map((u) => (
            <Link key={u.id} href={`/lp-updates/${u.id}`} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{u.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{u.period} · Created {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.status === "Final" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                {u.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}