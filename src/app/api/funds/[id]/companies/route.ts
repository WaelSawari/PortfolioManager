import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fundId } = await params;
  const positions = await prisma.fundCompany.findMany({
    where: { fundId },
    include: { company: true },
    orderBy: { investedAmount: "desc" },
  });
  return NextResponse.json(positions);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fundId } = await params;
  const body = await req.json();
  const position = await prisma.fundCompany.create({
    data: {
      fundId,
      companyId: body.companyId,
      investedAmount: parseFloat(body.investedAmount) || 0,
      ownershipPct: parseFloat(body.ownershipPct) || 0,
      currentFV: body.currentFV ? parseFloat(body.currentFV) : null,
      investmentDate: body.investmentDate ? new Date(body.investmentDate) : null,
      realizedProceeds: body.realizedProceeds ? parseFloat(body.realizedProceeds) : null,
      status: body.status || "Active",
      notes: body.notes || null,
    },
  });
  return NextResponse.json(position);
}