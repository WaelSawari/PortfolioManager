import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mandates = await prisma.mandate.findMany({
    include: { funds: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(mandates);
}

export async function POST(req: Request) {
  const body = await req.json();
  const mandate = await prisma.mandate.create({
    data: { name: body.name, description: body.description || null },
  });
  return NextResponse.json(mandate);
}