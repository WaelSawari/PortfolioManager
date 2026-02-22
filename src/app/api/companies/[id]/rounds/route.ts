import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = await params;
  const body = await req.json();
  const round = await prisma.fundingRound.create({
    data: {
      companyId,
      roundName: body.roundName,
      date: new Date(body.date),
      preMoneyVal: parseFloat(body.preMoneyVal),
      postMoneyVal: parseFloat(body.postMoneyVal),
      roundSize: parseFloat(body.roundSize),
      ourInvestment: parseFloat(body.ourInvestment),
      leadInvestor: body.leadInvestor || null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(round);
}