const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding portfolio database...");

  // Clear existing data (FK-safe order)
  await prisma.fundCompany.deleteMany();
  await prisma.lPUpdate.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.kPI.deleteMany();
  await prisma.fundingRound.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.mandate.deleteMany();
  await prisma.company.deleteMany();

  const companies = [
    {
      name: "SWVL",
      sector: "Transport / Mobility",
      stage: "Late Stage",
      website: "https://swvl.com",
      description: "Mass transit technology company listed on NASDAQ offering bus-hailing and ride-sharing services across emerging markets.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2019-02-01"),
      totalInvestedAmount: 2812113.50,
      ownershipPct: 1.03,
      currentValuation: 133462.61 / 0.0103,
    },
    {
      name: "Almentor",
      sector: "EdTech",
      stage: "Growth",
      website: "https://almentor.net",
      description: "Leading Arabic e-learning platform offering video-based online courses across MENA.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2019-11-01"),
      totalInvestedAmount: 2178444.56,
      ownershipPct: 9.89,
      currentValuation: 60000000,
    },
    {
      name: "MoneyFellows",
      sector: "FinTech",
      stage: "Series B",
      website: "https://moneyfellows.com",
      description: "Digital money circles (ROSCAs) platform enabling group savings and credit in Egypt.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2020-02-01"),
      totalInvestedAmount: 3843410.37,
      ownershipPct: 8.64,
      currentValuation: 11232000 / 0.0864,
    },
    {
      name: "Elves",
      sector: "Consumer / Concierge Tech",
      stage: "Seed",
      website: "https://elves.com",
      description: "On-demand virtual assistant and concierge platform. Written off.",
      country: "Egypt",
      status: "Written Off",
      initialInvestmentDate: new Date("2020-02-01"),
      totalInvestedAmount: 921504.75,
      ownershipPct: 4.81,
      currentValuation: 0,
    },
    {
      name: "GoodsMart",
      sector: "E-Commerce / B2B",
      stage: "Series A",
      website: "https://goodsmart.com",
      description: "B2B e-commerce marketplace connecting FMCG suppliers with retailers in Egypt.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2020-04-01"),
      totalInvestedAmount: 4432998,
      ownershipPct: 33.54,
      currentValuation: 4432998 / 0.3354,
    },
    {
      name: "Brantu",
      sector: "E-Commerce / Fashion",
      stage: "Seed",
      website: null,
      description: "Fashion e-commerce platform. Written off.",
      country: "Egypt",
      status: "Written Off",
      initialInvestmentDate: new Date("2020-06-01"),
      totalInvestedAmount: 2460390,
      ownershipPct: 21.5,
      currentValuation: 0,
    },
    {
      name: "Expandcart",
      sector: "SaaS / E-Commerce Enablement",
      stage: "Series A",
      website: "https://expandcart.com",
      description: "Arabic-first e-commerce platform enabling SMEs to build online stores across MENA.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2020-08-01"),
      totalInvestedAmount: 1319761,
      ownershipPct: 0,
      currentValuation: 1319761,
    },
    {
      name: "SiWare / Neospectra",
      sector: "Deep Tech / Semiconductors",
      stage: "Series B",
      website: "https://neospectra.com",
      description: "Fabless semiconductor company developing miniaturized NIR spectral sensing chips for industrial and consumer applications.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2020-08-15"),
      totalInvestedAmount: 4885395,
      ownershipPct: 7.06,
      currentValuation: 13061000 / 0.0706,
    },
    {
      name: "Fatura",
      sector: "FinTech / Payments",
      stage: "Exited",
      website: null,
      description: "B2B payments and invoicing platform. Successfully exited in 2022.",
      country: "Egypt",
      status: "Exited",
      initialInvestmentDate: new Date("2020-10-01"),
      totalInvestedAmount: 892393.95,
      ownershipPct: 0,
      currentValuation: 0,
    },
    {
      name: "Flat6Labs Cairo",
      sector: "Venture / Accelerator",
      stage: "Growth",
      website: "https://flat6labs.com",
      description: "Leading MENA startup accelerator and seed-stage venture fund based in Cairo.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2020-10-15"),
      totalInvestedAmount: 2558348,
      ownershipPct: 21.7,
      currentValuation: 14421196.42,
    },
    {
      name: "Flat6Labs Tunis (Anava)",
      sector: "Venture / Accelerator",
      stage: "Growth",
      website: "https://flat6labs.com/tunis",
      description: "Tunisian startup accelerator and seed-stage venture fund.",
      country: "Tunisia",
      status: "Active",
      initialInvestmentDate: new Date("2021-02-01"),
      totalInvestedAmount: 1479438.21,
      ownershipPct: 15,
      currentValuation: 1447722.92,
    },
    {
      name: "Empoweromics",
      sector: "EdTech / Workforce",
      stage: "Seed",
      website: null,
      description: "Workforce empowerment platform. Written off.",
      country: "Egypt",
      status: "Written Off",
      initialInvestmentDate: new Date("2021-01-01"),
      totalInvestedAmount: 293334.30,
      ownershipPct: 0,
      currentValuation: 0,
    },
    {
      name: "Pearl Semiconductors",
      sector: "Deep Tech / Semiconductors",
      stage: "Series A",
      website: null,
      description: "Fabless semiconductor company developing power management ICs for IoT and industrial applications.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2021-05-01"),
      totalInvestedAmount: 893747,
      ownershipPct: 8.47,
      currentValuation: 3388000 / 0.0847,
    },
    {
      name: "Axis",
      sector: "FinTech / Payments",
      stage: "Series A",
      website: null,
      description: "Digital payments and financial services platform in Egypt. Post-EBRD round diluted ownership.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2021-07-01"),
      totalInvestedAmount: 1175284,
      ownershipPct: 4.24,
      currentValuation: 4240041.03 / 0.0424,
    },
    {
      name: "Kashier",
      sector: "FinTech / Payments",
      stage: "Series A",
      website: "https://kashier.io",
      description: "Egyptian payment gateway enabling online merchants to accept digital payments.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2021-11-01"),
      totalInvestedAmount: 1749207.60,
      ownershipPct: 6.13,
      currentValuation: 2387807.40 / 0.0613,
    },
    {
      name: "Fulfillment Bridge",
      sector: "Logistics / E-Commerce",
      stage: "Series A",
      website: "https://fulfillmentbridge.com",
      description: "Cross-border e-commerce fulfillment and logistics platform.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2021-12-01"),
      totalInvestedAmount: 1500000,
      ownershipPct: 10.7,
      currentValuation: 1500000 / 0.107,
    },
    {
      name: "Blnk",
      sector: "FinTech / BNPL",
      stage: "Series A",
      website: "https://blnk.finance",
      description: "Egyptian Buy-Now-Pay-Later (BNPL) and consumer finance platform.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2022-04-01"),
      totalInvestedAmount: 1650776,
      ownershipPct: 3.547945,
      currentValuation: 2590000 / 0.03547945,
    },
    {
      name: "Proteinea",
      sector: "FoodTech / AgriTech",
      stage: "Seed",
      website: null,
      description: "Alternative protein company producing insect-based animal feed and organic fertilizer.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2022-05-01"),
      totalInvestedAmount: 220120,
      ownershipPct: 0,
      currentValuation: 1693230.77,
    },
    {
      name: "First Systems (ADVA)",
      sector: "FinTech / Payments",
      stage: "Exited",
      website: null,
      description: "Payments technology company. Exited in April 2025.",
      country: "Egypt",
      status: "Exited",
      initialInvestmentDate: new Date("2022-05-15"),
      totalInvestedAmount: 591021,
      ownershipPct: 0,
      currentValuation: 0,
    },
    {
      name: "Docspert",
      sector: "HealthTech",
      stage: "Seed",
      website: "https://docspert.com",
      description: "Telemedicine platform connecting patients in emerging markets with specialist doctors.",
      country: "Egypt",
      status: "Active",
      initialInvestmentDate: new Date("2022-11-01"),
      totalInvestedAmount: 257924,
      ownershipPct: 0,
      currentValuation: 257924,
    },
  ];

  const createdCompanies = {};
  for (const company of companies) {
    const created = await prisma.company.create({ data: company });
    createdCompanies[company.name] = created.id;
    console.log(`✅ Created: ${company.name}`);
  }

  // ─── Funding Rounds ───────────────────────────────────────────────────────

  const rounds = [
    { company: "SWVL", roundName: "Series B+", date: new Date("2019-02-01"), preMoneyVal: 72387886.50, postMoneyVal: 75200000, roundSize: 2812113.50, ourInvestment: 2812113.50, leadInvestor: "SVNFI / SVEFI" },
    { company: "Almentor", roundName: "Series A", date: new Date("2019-11-01"), preMoneyVal: 10821555.44, postMoneyVal: 13000000, roundSize: 2178444.56, ourInvestment: 2178444.56, leadInvestor: "SVNFI / SVEFI" },
    { company: "MoneyFellows", roundName: "Series A", date: new Date("2020-02-01"), preMoneyVal: 6500000, postMoneyVal: 6950000, roundSize: 3843410.37, ourInvestment: 3843410.37, leadInvestor: "SVNFI / SVEFI", notes: "Co-investors: 500 Startups, Dubai Angel Investors, Phoenician Funds" },
    { company: "Elves", roundName: "Series A", date: new Date("2020-02-01"), preMoneyVal: 12000000, postMoneyVal: 12921504.75, roundSize: 921504.75, ourInvestment: 921504.75, leadInvestor: "SVNFI / SVEFI", notes: "Written off" },
    { company: "GoodsMart", roundName: "Series A", date: new Date("2020-04-01"), preMoneyVal: 8778008, postMoneyVal: 13210986, roundSize: 4432998, ourInvestment: 4432998, leadInvestor: "SVNFI / SVEFI" },
    { company: "Brantu", roundName: "Seed", date: new Date("2020-06-01"), preMoneyVal: 9000000, postMoneyVal: 11460390, roundSize: 2460390, ourInvestment: 2460390, leadInvestor: "SVNFI / SVEFI", notes: "Written off" },
    { company: "Expandcart", roundName: "Series A", date: new Date("2020-08-01"), preMoneyVal: 0, postMoneyVal: 1319761, roundSize: 1319761, ourInvestment: 1319761, leadInvestor: "SVNFI / SVEFI" },
    { company: "SiWare / Neospectra", roundName: "Series B", date: new Date("2020-08-15"), preMoneyVal: 64114605, postMoneyVal: 69000000, roundSize: 4885395, ourInvestment: 4885395, leadInvestor: "SVNFI / SVEFI" },
    { company: "Fatura", roundName: "Series A", date: new Date("2020-10-01"), preMoneyVal: 0, postMoneyVal: 892393.95, roundSize: 892393.95, ourInvestment: 892393.95, leadInvestor: "SVNFI / SVEFI", notes: "Exited 2022 — realized $3,107,395 (3.482x, IRR 170.44%)" },
    { company: "Flat6Labs Cairo", roundName: "Fund II", date: new Date("2020-10-15"), preMoneyVal: 0, postMoneyVal: 11786861.85, roundSize: 2558348, ourInvestment: 2558348, leadInvestor: "SVNFI / SVEFI" },
    { company: "Flat6Labs Tunis (Anava)", roundName: "Fund II", date: new Date("2021-02-01"), preMoneyVal: 0, postMoneyVal: 9862921.39, roundSize: 1479438.21, ourInvestment: 1479438.21, leadInvestor: "SVNFI" },
    { company: "Empoweromics", roundName: "Seed", date: new Date("2021-01-01"), preMoneyVal: 0, postMoneyVal: 293334.30, roundSize: 293334.30, ourInvestment: 293334.30, leadInvestor: "SVNFI / SVEFI", notes: "Written off" },
    { company: "Pearl Semiconductors", roundName: "Series A", date: new Date("2021-05-01"), preMoneyVal: 9652301, postMoneyVal: 10546048, roundSize: 893747, ourInvestment: 893747, leadInvestor: "SVNFI / SVEFI" },
    { company: "Axis", roundName: "Series A", date: new Date("2021-07-01"), preMoneyVal: 26561017.37, postMoneyVal: 27736301.37, roundSize: 1175284, ourInvestment: 1175284, leadInvestor: "SVNFI / SVEFI", notes: "Post-EBRD round diluted ownership to 4.24%" },
    { company: "Kashier", roundName: "Series A", date: new Date("2021-11-01"), preMoneyVal: 26793680.07, postMoneyVal: 28542887.67, roundSize: 1749207.60, ourInvestment: 1749207.60, leadInvestor: "SVNFI / SVEFI" },
    { company: "Fulfillment Bridge", roundName: "Series A", date: new Date("2021-12-01"), preMoneyVal: 12523364.49, postMoneyVal: 14023364.49, roundSize: 1500000, ourInvestment: 1500000, leadInvestor: "SVNFI" },
    { company: "Blnk", roundName: "Series A", date: new Date("2022-04-01"), preMoneyVal: 44859588.38, postMoneyVal: 46510364.38, roundSize: 1650776, ourInvestment: 1650776, leadInvestor: "SVNFI / SVEFI" },
    { company: "Proteinea", roundName: "Seed", date: new Date("2022-05-01"), preMoneyVal: 0, postMoneyVal: 220120, roundSize: 220120, ourInvestment: 220120, leadInvestor: "SVNFI / SVEFI" },
    { company: "First Systems (ADVA)", roundName: "Series A", date: new Date("2022-05-15"), preMoneyVal: 0, postMoneyVal: 591021, roundSize: 591021, ourInvestment: 591021, leadInvestor: "SVNFI", notes: "Exited Apr-2025 — realized $738,776.25 (1.25x, IRR 8.01%)" },
    { company: "Docspert", roundName: "Seed", date: new Date("2022-11-01"), preMoneyVal: 0, postMoneyVal: 257924, roundSize: 257924, ourInvestment: 257924, leadInvestor: "SVNFI" },
  ];

  for (const round of rounds) {
    const companyId = createdCompanies[round.company];
    if (!companyId) { console.warn(`⚠️  Company not found: ${round.company}`); continue; }
    await prisma.fundingRound.create({
      data: { companyId, roundName: round.roundName, date: round.date, preMoneyVal: round.preMoneyVal, postMoneyVal: round.postMoneyVal, roundSize: round.roundSize, ourInvestment: round.ourInvestment, leadInvestor: round.leadInvestor || null, notes: round.notes || null },
    });
    console.log(`  📋 Round: ${round.company} — ${round.roundName}`);
  }

  // ─── KPIs ─────────────────────────────────────────────────────────────────

  const kpis = [
    { company: "SWVL", notes: "NASDAQ listed. Share price $1.90, 70,243 shares owned. FV: $133,462. IRR: -36.98%, MOIC: 0.047x" },
    { company: "Almentor", notes: "FV: $5,934,000. Company valued at $60M. IRR: 22.40%, MOIC: 2.724x" },
    { company: "MoneyFellows", notes: "FV: $11,232,000. IRR: 25.61% (diluted), MOIC: 2.922x. BII co-investor (1.43%)" },
    { company: "SiWare / Neospectra", notes: "FV: $13,061,000. IRR: 24.27%, MOIC: 2.673x" },
    { company: "Flat6Labs Cairo", notes: "USD NAV: $14,421,196. EGP NAV: 687,553,613. FV: $3,129,399. IRR: 4.93%, MOIC: 1.223x. Ownership: 21.7%" },
    { company: "Flat6Labs Tunis (Anava)", notes: "Portfolio FV TND 24.79M. FV USD: $1,447,723. IRR: -0.49%, MOIC: 0.979x. TVPI: 0.948x" },
    { company: "Pearl Semiconductors", notes: "FV: $3,388,000. IRR: 34.88%, MOIC: 3.791x" },
    { company: "Axis", notes: "FV: $4,240,041. IRR: 35.89%, MOIC: 3.608x. Diluted post-EBRD round. Ownership: 4.24%" },
    { company: "Kashier", notes: "FV: $2,387,807. IRR: 9.28%, MOIC: 1.365x. Ownership: 6.13%" },
    { company: "Fulfillment Bridge", notes: "FV: $1,500,000 (at cost). Ownership: 10.7%" },
    { company: "Blnk", notes: "FV: $2,590,000. IRR: 12.44%, MOIC: 1.569x. Apr-2025 round accounted for." },
    { company: "Proteinea", notes: "FV: $1,693,231. IRR: 73.04%, MOIC: 7.692x. Strong performer." },
    { company: "GoodsMart", notes: "FV at cost: $4,432,998. MOIC: 1.0x. Ownership: 33.54%" },
    { company: "Expandcart", notes: "FV at cost: $1,319,761. MOIC: 1.0x" },
    { company: "Docspert", notes: "FV at cost: $257,924. MOIC: 1.0x" },
  ];

  for (const kpi of kpis) {
    const companyId = createdCompanies[kpi.company];
    if (!companyId) continue;
    await prisma.kPI.create({ data: { companyId, period: "Q4 2025", date: new Date("2025-12-31"), notes: kpi.notes } });
    console.log(`  📊 KPI: ${kpi.company} — Q4 2025`);
  }

  // ─── Scenarios ────────────────────────────────────────────────────────────

  const scenarios = [
    { company: "MoneyFellows", name: "Base Case", exitYear: 2027, exitMultiple: 5, exitValuation: 64800000, ourOwnershipAtExit: 8.64, proceeds: 5598720, irr: 25.61, moic: 2.922 },
    { company: "SiWare / Neospectra", name: "Base Case", exitYear: 2027, exitMultiple: 5, exitValuation: 185000000, ourOwnershipAtExit: 7.06, proceeds: 13061000, irr: 24.27, moic: 2.673 },
    { company: "Pearl Semiconductors", name: "Base Case", exitYear: 2027, exitMultiple: 6, exitValuation: 40000000, ourOwnershipAtExit: 8.47, proceeds: 3388000, irr: 34.88, moic: 3.791 },
    { company: "Axis", name: "Base Case", exitYear: 2027, exitMultiple: 6, exitValuation: 100000000, ourOwnershipAtExit: 4.24, proceeds: 4240041, irr: 35.89, moic: 3.608 },
    { company: "Proteinea", name: "Bull Case", exitYear: 2027, exitMultiple: 10, exitValuation: 20000000, ourOwnershipAtExit: 8, proceeds: 1600000, irr: 73.04, moic: 7.692 },
    { company: "Almentor", name: "Base Case", exitYear: 2028, exitMultiple: 4, exitValuation: 60000000, ourOwnershipAtExit: 9.89, proceeds: 5934000, irr: 22.40, moic: 2.724 },
    { company: "Blnk", name: "Base Case", exitYear: 2028, exitMultiple: 4, exitValuation: 73000000, ourOwnershipAtExit: 3.55, proceeds: 2590000, irr: 12.44, moic: 1.569 },
    { company: "Kashier", name: "Base Case", exitYear: 2028, exitMultiple: 3, exitValuation: 38900000, ourOwnershipAtExit: 6.13, proceeds: 2387807, irr: 9.28, moic: 1.365 },
    { company: "Elves", name: "Bear Case", exitYear: 2025, exitMultiple: 0, exitValuation: 0, ourOwnershipAtExit: 4.81, proceeds: 0, irr: -100, moic: 0, notes: "Written off" },
    { company: "Brantu", name: "Bear Case", exitYear: 2025, exitMultiple: 0, exitValuation: 0, ourOwnershipAtExit: 21.5, proceeds: 0, irr: -100, moic: 0, notes: "Written off" },
    { company: "Empoweromics", name: "Bear Case", exitYear: 2025, exitMultiple: 0, exitValuation: 0, ourOwnershipAtExit: 0, proceeds: 0, irr: -100, moic: 0, notes: "Written off" },
  ];

  for (const s of scenarios) {
    const companyId = createdCompanies[s.company];
    if (!companyId) continue;
    await prisma.scenario.create({ data: { companyId, name: s.name, exitYear: s.exitYear, exitMultiple: s.exitMultiple, exitValuation: s.exitValuation, ourOwnershipAtExit: s.ourOwnershipAtExit, proceeds: s.proceeds, irr: s.irr, moic: s.moic, notes: s.notes || null } });
    console.log(`  📈 Scenario: ${s.company} — ${s.name}`);
  }

  // ─── Mandate ──────────────────────────────────────────────────────────────

  const mandate = await prisma.mandate.create({
    data: {
      name: "Silverstone Ventures",
      description: "Silverstone Ventures Management — umbrella mandate covering MENA and Egypt-focused funds.",
    },
  });
  console.log(`\n🏛️  Created mandate: ${mandate.name}`);

  // ─── Funds ────────────────────────────────────────────────────────────────

  const svnfi = await prisma.fund.create({
    data: {
      mandateId: mandate.id,
      name: "SVNFI",
      fullName: "Silverstone Ventures MENA Fund I",
      currency: "USD",
      vintageYear: 2019,
      committedCapital: 41804520.30,
      managementFeePct: 2.0,
      carryPct: 20.0,
      status: "Active",
      notes: "Gross IRR: 12.64% | Net IRR: 7.51% | TVPI: 1.4571x | MOIC: 1.678x | DPI: 9.24%",
    },
  });

  const svefi = await prisma.fund.create({
    data: {
      mandateId: mandate.id,
      name: "SVEFI",
      fullName: "Silverstone Ventures Egypt Fund I",
      currency: "EGP",
      vintageYear: 2019,
      committedCapital: 444000000,
      managementFeePct: 2.0,
      carryPct: 20.0,
      status: "Active",
      notes: "IRR: 37.11% (EGP) | TVPI: 3.934x | DPI: 8.72% | Gross IRR: 14.637%",
    },
  });
  console.log(`💰 Created fund: ${svnfi.name} (USD) and ${svefi.name} (EGP)`);

  // ─── FundCompany positions ─────────────────────────────────────────────────
  // svnfiInvested = USD amount from SVNFI sheet (BV)
  // svefiInvested = EGP amount from SVEFI sheet (BV × 1000, since sheet values are in EGP thousands)
  // svnfiFV / svefiFV = fair values in respective currencies

  const fundPositions = [
    // Both SVNFI + SVEFI
    { company: "SWVL",              svnfiInvested: 2812113.50, svnfiOwn: 1.03,       svnfiFV: 133462.61,    svefiInvested: 1688230,    svefiOwn: 0.62,       svefiFV: 80120,       status: "Active" },
    { company: "Almentor",          svnfiInvested: 2178444.56, svnfiOwn: 9.89,       svnfiFV: 5934000,      svefiInvested: 1425260,    svefiOwn: 6.47,       svefiFV: 3882360,     status: "Active" },
    { company: "MoneyFellows",      svnfiInvested: 3843410.37, svnfiOwn: 8.64,       svnfiFV: 11232000,     svefiInvested: 2606560,    svefiOwn: 5.86,       svefiFV: 7617410,     status: "Active" },
    { company: "Elves",             svnfiInvested: 921504.75,  svnfiOwn: 4.81,       svnfiFV: 0,            svefiInvested: 628490,     svefiOwn: 3.28,       svefiFV: 0,           status: "Written Off" },
    { company: "GoodsMart",         svnfiInvested: 4432998,    svnfiOwn: 33.54,      svnfiFV: 4432998,      svefiInvested: 3064627,    svefiOwn: 22.69,      svefiFV: 3064627,     status: "Active" },
    { company: "Brantu",            svnfiInvested: 2460390,    svnfiOwn: 21.5,       svnfiFV: 0,            svefiInvested: 1619610,    svefiOwn: 14.15,      svefiFV: 0,           status: "Written Off" },
    { company: "Expandcart",        svnfiInvested: 1319761,    svnfiOwn: 0,          svnfiFV: 1319761,      svefiInvested: 885885,     svefiOwn: 0,          svefiFV: 885885,      status: "Active" },
    { company: "SiWare / Neospectra", svnfiInvested: 4885395,  svnfiOwn: 7.06,      svnfiFV: 13061000,     svefiInvested: 3302132,    svefiOwn: 4.775,      svefiFV: 8828180,     status: "Active" },
    { company: "Fatura",            svnfiInvested: 892393.95,  svnfiOwn: 0,          svnfiFV: 0,            svefiInvested: 607606,     svefiOwn: 0,          svefiFV: 0,           realizedSvnfi: 3107395,  realizedSvefi: 2161474, status: "Exited" },
    { company: "Flat6Labs Cairo",   svnfiInvested: 2558348,    svnfiOwn: 21.7,       svnfiFV: 3129399.62,   svefiInvested: 1036431,    svefiOwn: 8.791,      svefiFV: 1267772.67,  status: "Active" },
    { company: "Empoweromics",      svnfiInvested: 293334.30,  svnfiOwn: 0,          svnfiFV: 0,            svefiInvested: 206666,     svefiOwn: 0,          svefiFV: 0,           status: "Written Off" },
    { company: "Pearl Semiconductors", svnfiInvested: 893747,  svnfiOwn: 8.47,      svnfiFV: 3388000,      svefiInvested: 604101,     svefiOwn: 5.73,       svefiFV: 2290020,     status: "Active" },
    { company: "Axis",              svnfiInvested: 1175284,    svnfiOwn: 4.24,       svnfiFV: 4240041.03,   svefiInvested: 834716,     svefiOwn: 3.01,       svefiFV: 3011380,     status: "Active" },
    { company: "Kashier",           svnfiInvested: 1749207.60, svnfiOwn: 6.13172,    svnfiFV: 2387807.40,   svefiInvested: 1400792,    svefiOwn: 4.91038,    svefiFV: 1912190,     status: "Active" },
    { company: "Blnk",              svnfiInvested: 1650776,    svnfiOwn: 3.547945,   svnfiFV: 2590000,      svefiInvested: 1349223,    svefiOwn: 2.89589,    svefiFV: 2116880,     status: "Active" },
    { company: "Proteinea",         svnfiInvested: 220120,     svnfiOwn: 0,          svnfiFV: 1693230.77,   svefiInvested: 179880,     svefiOwn: 0,          svefiFV: 1383690,     status: "Active" },
    // SVNFI-only
    { company: "Flat6Labs Tunis (Anava)", svnfiInvested: 1479438.21, svnfiOwn: 15,  svnfiFV: 1447722.92,   svefiInvested: 0,          svefiOwn: 0,          svefiFV: null,        status: "Active" },
    { company: "Fulfillment Bridge",svnfiInvested: 1500000,    svnfiOwn: 10.7,       svnfiFV: 1500000,      svefiInvested: 0,          svefiOwn: 0,          svefiFV: null,        status: "Active" },
    { company: "First Systems (ADVA)", svnfiInvested: 591021,  svnfiOwn: 0,          svnfiFV: 0,            svefiInvested: 0,          svefiOwn: 0,          svefiFV: null,        realizedSvnfi: 738776.25, status: "Exited" },
    { company: "Docspert",          svnfiInvested: 257924,     svnfiOwn: 0,          svnfiFV: 257924,       svefiInvested: 0,          svefiOwn: 0,          svefiFV: null,        status: "Active" },
  ];

  let fcCount = 0;
  for (const fc of fundPositions) {
    const companyId = createdCompanies[fc.company];
    if (!companyId) { console.warn(`⚠️  Company not found for fund position: ${fc.company}`); continue; }

    // SVNFI position (USD)
    if (fc.svnfiInvested > 0 || fc.svnfiOwn > 0) {
      await prisma.fundCompany.create({
        data: {
          fundId: svnfi.id,
          companyId,
          investedAmount: fc.svnfiInvested,
          ownershipPct: fc.svnfiOwn,
          currentFV: fc.svnfiFV ?? null,
          realizedProceeds: fc.realizedSvnfi ?? null,
          status: fc.status,
        },
      });
      fcCount++;
    }

    // SVEFI position (EGP) — only if invested
    if (fc.svefiInvested > 0) {
      await prisma.fundCompany.create({
        data: {
          fundId: svefi.id,
          companyId,
          investedAmount: fc.svefiInvested,
          ownershipPct: fc.svefiOwn,
          currentFV: fc.svefiFV ?? null,
          realizedProceeds: fc.realizedSvefi ?? null,
          status: fc.status,
        },
      });
      fcCount++;
    }
    console.log(`  🔗 Positions: ${fc.company}`);
  }

  console.log(`\n✅ Database seeded successfully!`);
  console.log(`   ${companies.length} companies`);
  console.log(`   ${rounds.length} funding rounds`);
  console.log(`   ${kpis.length} KPI entries`);
  console.log(`   ${scenarios.length} scenarios`);
  console.log(`   1 mandate (Silverstone Ventures)`);
  console.log(`   2 funds (SVNFI, SVEFI)`);
  console.log(`   ${fcCount} fund-company positions`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
