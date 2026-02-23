import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = await prisma.mandate.findUnique({
    where: { id },
    include: { funds: { include: { investments: { include: { company: true } } }, orderBy: { name: "asc" } } },
  });
  if (!mandate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mandate);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const mandate = await prisma.mandate.update({
    where: { id },
    data: { name: body.name, description: body.description || null },
  });
  return NextResponse.json(mandate);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.mandate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}