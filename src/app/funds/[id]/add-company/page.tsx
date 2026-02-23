export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddCompanyForm from "./AddCompanyForm";

export default async function AddCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fund = await prisma.fund.findUnique({
    where: { id },
    include: { investments: true, mandate: true },
  });
  if (!fund) notFound();

  const existingIds = fund.investments.map(i => i.companyId);
  const available = await prisma.company.findMany({
    where: { id: { notIn: existingIds.length > 0 ? existingIds : ["__none__"] } },
    orderBy: { name: "asc" },
  });

  return <AddCompanyForm fund={fund} availableCompanies={available} />;
}