import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const funds = await prisma.fund.findMany({
    include: { mandate: true, investments: { include: { company: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(funds);
}

export async function POST(req: Request) {
  const body = await req.json();
  const fund = await prisma.fund.create({
    data: {
      mandateId: body.mandateId,
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