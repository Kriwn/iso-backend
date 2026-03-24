// prisma/seed.ts
import { Pool } from "pg";
import { control_status, controls_type, iso_status, PrismaClient, userRole } from "../generated/prisma/client";
import { initLogger, loadEnv } from "../src/config";
import { getPrismaClient } from "../src/infrastructures/db/prisma/client";
import { ISO27001_CONTROLS_CATALOG } from "../src/services/controls/iso27001-controls.catalog";
import { PrismaPg } from "@prisma/adapter-pg";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "info", "warn"],
});

function assessmentControlDescription(type: controls_type) {
  switch (type) {
    case controls_type.ORGANIZATION:
      return "Organisational controls: governance, policies, supplier management, incident management and compliance.";
    case controls_type.PEOPLE:
      return "People controls: screening, employment terms, training, remote work and incident reporting.";
    case controls_type.PHYSICAL:
      return "Physical controls: facility security, entry controls, environmental protection and secure disposal.";
    case controls_type.TECHNOLOGICAL:
      return "Technological controls: access control, logging/monitoring, backup, vulnerability management and secure SDLC.";
  }
}

function pickStatus(i: number): control_status {
  if (i % 10 === 0) return control_status.IMPLEMENTED;
  if (i % 3 === 0) return control_status.PARTIALLY;
  return control_status.NOT_IMPLEMENTED;
}

async function createAssessmentControls(isoAssessmentId: number) {
  const types: controls_type[] = [
    controls_type.ORGANIZATION,
    controls_type.PEOPLE,
    controls_type.PHYSICAL,
    controls_type.TECHNOLOGICAL,
  ];

  const created = await prisma.assessmentControl.createMany({
    data: types.map((t) => ({
      isoAssessmentId,
      type: t,
      description: assessmentControlDescription(t),
    })),
  });

  const rows = await prisma.assessmentControl.findMany({
    where: { isoAssessmentId },
    select: { id: true, type: true },
  });

  const map = new Map<controls_type, number>();
  for (const r of rows) map.set(r.type, r.id);

  return map;
}

async function createControlsForIso(
  assessmentControlIdByType: Map<controls_type, number>,
  opts: { full93: boolean }
) {
  const catalog = ISO27001_CONTROLS_CATALOG;

  const partialCount = 30;
  const target = opts.full93 ? catalog : catalog.slice(0, partialCount);

  let idx = 0;
  for (const item of target) {
    idx++;

    const assessmentControlId = assessmentControlIdByType.get(item.type);
    if (!assessmentControlId) throw new Error(`Missing assessmentControlId for type ${item.type}`);

    await prisma.controls.create({
      data: {
        code: item.code,
        name: item.name,
        description: item.description,
        guidance: item.guidance,
        currentPractice: `Seeded practice note for ${item.code}.`,
        userContext: idx % 2 === 0 ? "Company context: SaaS product, small team, cloud-first." : "",
        evidenceDescription: idx % 4 === 0 ? "Evidence: policy doc, screenshots, tickets, logs." : "",
        status: pickStatus(idx),
        assessmentControlId,
      },
    });
  }
}

async function main() {
  await prisma.suggestion.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.controls.deleteMany();
  await prisma.assessmentControl.deleteMany();
  await prisma.isoAssessment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // =========================
  // Create 2 Companies
  // =========================
  const companyA = await prisma.company.create({
    data: {
      code: "CMP-A",
      name: "Alpha Soft Co., Ltd.",
      details: "Seed company A (SaaS / Cloud).",
      image: null,
    },
  });

  const companyB = await prisma.company.create({
    data: {
      code: "CMP-B",
      name: "Beta Manufacturing Co., Ltd.",
      details: "Seed company B (Manufacturing / Hybrid).",
      image: null,
    },
  });

  // =========================
  // Company A: 2 ISO assessments
  // =========================
  const isoA_2025 = await prisma.isoAssessment.create({
    data: {
      companyId: companyA.id,
      name: "ISO 27001:2022 Pre-audit 2025",
      year: 2025,
      status: iso_status.IN_PROGRESS,
    },
  });

  const isoA_2026 = await prisma.isoAssessment.create({
    data: {
      companyId: companyA.id,
      name: "ISO 27001:2022 Pre-audit 2026",
      year: 2026,
      status: iso_status.DRAFT,
    },
  });

  // Create 4 assessment controls per ISO
  const acMapA_2025 = await createAssessmentControls(isoA_2025.id);
  const acMapA_2026 = await createAssessmentControls(isoA_2026.id);

  await createControlsForIso(acMapA_2025, { full93: true });
  await createControlsForIso(acMapA_2026, { full93: false });

  // =========================
  // Company B: 2 ISO assessments
  // =========================
  const isoB_2024 = await prisma.isoAssessment.create({
    data: {
      companyId: companyB.id,
      name: "ISO 27001:2022 Pre-audit 2024",
      year: 2024,
      status: iso_status.COMPLETED,
    },
  });

  const isoB_2025 = await prisma.isoAssessment.create({
    data: {
      companyId: companyB.id,
      name: "ISO 27001:2022 Pre-audit 2025",
      year: 2025,
      status: iso_status.IN_PROGRESS,
    },
  });

  const acMapB_2024 = await createAssessmentControls(isoB_2024.id);
  const acMapB_2025 = await createAssessmentControls(isoB_2025.id);

  await createControlsForIso(acMapB_2024, { full93: true });

  await createControlsForIso(acMapB_2025, { full93: false });

  console.log("✅ Seed completed:");
  console.log(`- Company A (id=${companyA.id}) ISO: ${isoA_2025.year} full93, ${isoA_2026.year} partial`);
  console.log(`- Company B (id=${companyB.id}) ISO: ${isoB_2024.year} full93, ${isoB_2025.year} partial`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
