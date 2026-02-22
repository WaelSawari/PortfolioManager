import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const scenario = await prisma.scenario.create({
    data: {
      companyId: body.companyId,
      name: body.name,
      exitYear: parseInt(body.exitYear),
      exitMultiple: parseFloat(body.exitMultiple) || 0,
      exitValuation: parseFloat(body.exitValuation),
      ourOwnershipAtExit: parseFloat(body.ourOwnershipAtExit),
      proceeds: parseFloat(body.proceeds),
      irr: body.irr ? parseFloat(body.irr) : null,
      moic: body.moic ? parseFloat(body.moic) : null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(scenario);
}