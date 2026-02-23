import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const { period, title, tone, fundId } = await req.json();

    // If a specific fund is selected, scope companies to that fund's investments
    let companies;
    let fundContext = "";

    if (fundId) {
      const fund = await prisma.fund.findUnique({
        where: { id: fundId },
        include: {
          mandate: true,
          investments: {
            include: {
              company: {
                include: {
                  kpis: { orderBy: { date: "desc" }, take: 2 },
                  rounds: { orderBy: { date: "desc" }, take: 1 },
                  scenarios: true,
                },
              },
            },
          },
        },
      });

      if (!fund) {
        return NextResponse.json({ error: "Fund not found" }, { status: 404 });
      }

      fundContext =
        `Fund: ${fund.name} (${fund.fullName ?? fund.name})\n` +
        `Mandate: ${fund.mandate.name}\n` +
        `Currency: ${fund.currency}\n` +
        `Committed Capital: ${fund.currency === "EGP" ? "EGP " : "$"}${(fund.committedCapital / 1e6).toFixed(1)}M\n\n`;

      companies = fund.investments
        .filter((fi) => fi.company.status === "Active")
        .map((fi) => {
          const c = fi.company;
          const cur = fund.currency;
          const fmt = (v: number) =>
            cur === "EGP"
              ? `EGP ${(v / 1e6).toFixed(2)}M`
              : `$${(v / 1e6).toFixed(2)}M`;

          const latestKPI = c.kpis[0];
          const prevKPI = c.kpis[1];
          const arrGrowth =
            latestKPI?.arr && prevKPI?.arr
              ? ((latestKPI.arr - prevKPI.arr) / prevKPI.arr * 100).toFixed(1) + "% MoM ARR growth"
              : null;

          const kpiLines = latestKPI
            ? [
                "Latest KPIs (" + latestKPI.period + "):",
                latestKPI.arr ? "- ARR: $" + (latestKPI.arr / 1e6).toFixed(2) + "M" + (arrGrowth ? " (" + arrGrowth + ")" : "") : "",
                latestKPI.burnRate ? "- Monthly Burn: $" + (latestKPI.burnRate / 1e3).toFixed(0) + "K" : "",
                latestKPI.runway ? "- Runway: " + latestKPI.runway + " months" : "",
                latestKPI.headcount ? "- Headcount: " + latestKPI.headcount : "",
                latestKPI.notes ? "- Notes: " + latestKPI.notes : "",
              ].filter(Boolean).join("\n")
            : "No KPIs logged yet";

          return [
            "Company: " + c.name,
            "Sector: " + c.sector + " | Stage: " + c.stage,
            `Fund Investment: ${fmt(fi.investedAmount)} | Ownership: ${fi.ownershipPct.toFixed(2)}%`,
            fi.currentFV ? `Current Fair Value: ${fmt(fi.currentFV)}` : "",
            kpiLines,
          ].filter(Boolean).join("\n");
        });
    } else {
      // All active companies (no fund filter)
      const allCompanies = await prisma.company.findMany({
        where: { status: "Active" },
        include: {
          kpis: { orderBy: { date: "desc" }, take: 2 },
          rounds: { orderBy: { date: "desc" }, take: 1 },
          scenarios: true,
        },
      });

      companies = allCompanies.map((c) => {
        const latestKPI = c.kpis[0];
        const prevKPI = c.kpis[1];
        const arrGrowth =
          latestKPI?.arr && prevKPI?.arr
            ? ((latestKPI.arr - prevKPI.arr) / prevKPI.arr * 100).toFixed(1) + "% MoM ARR growth"
            : null;

        const kpiLines = latestKPI
          ? [
              "Latest KPIs (" + latestKPI.period + "):",
              latestKPI.arr ? "- ARR: $" + (latestKPI.arr / 1e6).toFixed(2) + "M" + (arrGrowth ? " (" + arrGrowth + ")" : "") : "",
              latestKPI.burnRate ? "- Monthly Burn: $" + (latestKPI.burnRate / 1e3).toFixed(0) + "K" : "",
              latestKPI.runway ? "- Runway: " + latestKPI.runway + " months" : "",
              latestKPI.headcount ? "- Headcount: " + latestKPI.headcount : "",
              latestKPI.notes ? "- Notes: " + latestKPI.notes : "",
            ].filter(Boolean).join("\n")
          : "No KPIs logged yet";

        return [
          "Company: " + c.name,
          "Sector: " + c.sector + " | Stage: " + c.stage,
          "Invested: $" + (c.totalInvestedAmount / 1e6).toFixed(2) + "M | Ownership: " + c.ownershipPct + "%",
          c.currentValuation ? "Current Valuation: $" + (c.currentValuation / 1e6).toFixed(1) + "M" : "",
          kpiLines,
        ].filter(Boolean).join("\n");
      });
    }

    const portfolioSummary = companies.join("\n---\n");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt =
      "You are a VC fund manager writing an LP update for " + period + ".\n\n" +
      (fundContext ? "Fund context:\n" + fundContext : "") +
      "Tone: " + tone + "\n\n" +
      "Portfolio data:\n" + portfolioSummary + "\n\n" +
      "Write a professional LP update that includes:\n" +
      "1. Executive Summary / Fund Overview\n" +
      "2. Portfolio Highlights (key wins, milestones)\n" +
      "3. Company-by-Company Updates (brief summaries)\n" +
      "4. Key Risks and Challenges\n" +
      "5. Outlook and Next Steps\n\n" +
      "Keep it concise, factual, and appropriate for Limited Partners. Format it clearly with sections.";

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "";

    const update = await prisma.lPUpdate.create({
      data: {
        title,
        period,
        content,
        status: "Draft",
        ...(fundId ? { fundId } : {}),
      },
    });

    return NextResponse.json(update);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
