import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(companies);
}

export async function POST(req: Request) {
  const body = await req.json();
  const company = await prisma.company.create({
    data: {
      name: body.name,
      sector: body.sector,
      stage: body.stage,
      website: body.website || null,
      description: body.description || null,
      foundedYear: body.foundedYear ? parseInt(body.foundedYear) : null,
      country: body.country || null,
      status: body.status || "Active",
      initialInvestmentDate: body.initialInvestmentDate ? new Date(body.initialInvestmentDate) : null,
      totalInvestedAmount: parseFloat(body.totalInvestedAmount) || 0,
      ownershipPct: parseFloat(body.ownershipPct) || 0,
      currentValuation: body.currentValuation ? parseFloat(body.currentValuation) : null,
    },
  });
  return NextResponse.json(company);
}