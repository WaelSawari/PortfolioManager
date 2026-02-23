import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; companyId: string }> }) {
  const { id: fundId, companyId } = await params;
  const body = await req.json();
  const position = await prisma.fundCompany.update({
    where: { fundId_companyId: { fundId, companyId } },
    data: {
      investedAmount: parseFloat(body.investedAmount) || 0,
      ownershipPct: parseFloat(body.ownershipPct) || 0,
      currentFV: body.currentFV ? parseFloat(body.currentFV) : null,
      realizedProceeds: body.realizedProceeds ? parseFloat(body.realizedProceeds) : null,
      status: body.status || "Active",
      notes: body.notes || null,
    },
  });
  return NextResponse.json(position);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; companyId: string }> }) {
  const { id: fundId, companyId } = await params;
  await prisma.fundCompany.delete({ where: { fundId_companyId: { fundId, companyId } } });
  return NextResponse.json({ ok: true });
}