import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fund = await prisma.fund.findUnique({
    where: { id },
    include: {
      mandate: true,
      investments: { include: { company: true }, orderBy: { investedAmount: "desc" } },
    },
  });
  if (!fund) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fund);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const fund = await prisma.fund.update({
    where: { id },
    data: {
      name: body.name,
      fullName: body.fullName || null,
      currency: body.currency || "USD",
      vintageYear: body.vintageYear ? parseInt(body.vintageYear) : null,
      committedCapital: parseFloat(body.committedCapital) || 0,
      managementFeePct: body.managementFeePct ? parseFloat(body.managementFeePct) : null,
      carryPct: body.carryPct ? parseFloat(body.carryPct) : null,
      status: body.status || "Active",
      notes: body.notes || null,
    },
  });
  return NextResponse.json(fund);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.fund.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}