import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const kpi = await prisma.kPI.create({
    data: {
      companyId: body.companyId,
      period: body.period,
      date: new Date(body.date),
      arr: body.arr ? parseFloat(body.arr) : null,
      mrr: body.mrr ? parseFloat(body.mrr) : null,
      revenue: body.revenue ? parseFloat(body.revenue) : null,
      grossMargin: body.grossMargin ? parseFloat(body.grossMargin) : null,
      burnRate: body.burnRate ? parseFloat(body.burnRate) : null,
      cashBalance: body.cashBalance ? parseFloat(body.cashBalance) : null,
      runway: body.runway ? parseInt(body.runway) : null,
      headcount: body.headcount ? parseInt(body.headcount) : null,
      customers: body.customers ? parseInt(body.customers) : null,
      growthMoM: body.growthMoM ? parseFloat(body.growthMoM) : null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(kpi);
}