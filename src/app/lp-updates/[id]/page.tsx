export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function LPUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const update = await prisma.lPUpdate.findUnique({ where: { id } });
  if (!update) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/lp-updates" className="hover:text-gray-600">LP Updates</Link>
        <span>/</span>
        <span className="text-gray-600">{update.title}</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{update.title}</h1>
            <p className="text-gray-500 text-sm mt-1">Period: {update.period} · Created: {new Date(update.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${update.status === "Final" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
            {update.status}
          </span>
        </div>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">{update.content}</pre>
        </div>
      </div>
    </div>
  );
}