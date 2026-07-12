import { z } from "zod";
import { site } from "@/lib/site";
import { allContractablePlans, type Plan } from "@/content/plans";

export const contractRequestSchema = z.object({
  planId: z.string().refine((id) => allContractablePlans.some((p) => p.id === id), {
    message: "Plan desconocido",
  }),
  paymentPlan: z.enum(["full", "split", "monthly"]),
  client: z.object({
    name: z.string().min(2).max(120),
    rut: z.string().min(7).max(15),
    company: z.string().max(160).optional(),
    email: z.string().email(),
    phone: z.string().min(6).max(20),
    address: z.string().min(4).max(200),
    businessName: z.string().min(2).max(120),
    brief: z.string().min(4).max(1500),
  }),
  existingSiteUrl: z.string().max(300).optional(),
  // Monto ya acordado (planes cotizados/verticales), en CLP, ej. "120000".
  agreedAmount: z.string().max(20).optional(),
  // Modificaciones acordadas tras probar la demo, cada una con su valor (vacío =
  // incluida sin costo). El valor final del contrato = plan base + suma de estas.
  modifications: z
    .array(
      z.object({
        description: z.string().min(3).max(300),
        amount: z.string().max(20).optional(),
      })
    )
    .max(20)
    .optional(),
});

export type ContractRequest = z.infer<typeof contractRequestSchema>;

// --- Pre-contrato de demo: el D0 iniciado por el cliente ---
export const demoRequestSchema = z.object({
  planId: z.string().refine((id) => allContractablePlans.some((p) => p.id === id), {
    message: "Plan desconocido",
  }),
  applicant: z.object({
    name: z.string().min(2).max(120),
    businessName: z.string().min(2).max(120),
    rubro: z.string().min(2).max(120),
    phone: z.string().min(6).max(20),
    email: z.string().email(),
    brief: z.string().min(10).max(1500),
  }),
  currentSiteUrl: z.string().max(300).optional(),
});

export type DemoRequest = z.infer<typeof demoRequestSchema>;

export interface PreContract {
  number: string;
  date: string;
  provider: Contract["provider"];
  applicant: DemoRequest["applicant"] & { currentSiteUrl?: string };
  plan: { name: string; priceLabel: string; delivery: string };
  terms: string[];
}

export function buildPreContract(request: DemoRequest): PreContract {
  const plan = allContractablePlans.find((p) => p.id === request.planId)!;
  const now = new Date();
  const number = `PRE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return {
    number,
    date: now.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }),
    provider: {
      legalName: site.legalName,
      rut: process.env.COMPANY_RUT ?? "[RUT por completar]",
      representative: site.personName,
      email: site.email,
      phone: site.whatsapp ? `+${site.whatsapp}` : "[teléfono]",
    },
    applicant: { ...request.applicant, currentSiteUrl: request.currentSiteUrl },
    plan: {
      name: plan.name,
      priceLabel: plan.price ? `${plan.price} IVA incluido` : "según cotización",
      delivery: plan.delivery,
    },
    terms: [
      `${site.name} construirá una demo funcional del sitio de ${request.applicant.businessName}, con su marca y datos públicos, dentro de 24 a 48 horas hábiles, sin costo ni compromiso para el solicitante.`,
      "La demo es un borrador con contenido de referencia: los datos definitivos (fotos, textos, precios, catálogo) se completan junto al cliente si decide avanzar.",
      `El plan de referencia es "${plan.name}" (${plan.price ? `${plan.price} IVA incluido` : "según cotización"}). Este valor es referencial: tras probar la demo, las modificaciones que el cliente requiera se valorizan una a una y el precio final queda estipulado en el contrato final.`,
      "Probada la demo y acordadas las modificaciones, se genera el contrato final con el detalle de cada modificación, su valor y el valor total — nada se paga antes de ese contrato.",
      "Si el solicitante no responde, la demo se despublica a los 30 días y sus datos se eliminan.",
    ],
  };
}

export interface BankInfo {
  bankName: string;
  accountType: string;
  accountNumber: string;
  holder: string;
  rut: string;
  email: string;
}

export interface Contract {
  number: string;
  date: string;
  provider: {
    legalName: string;
    rut: string;
    representative: string;
    email: string;
    phone: string;
  };
  client: ContractRequest["client"] & { existingSiteUrl?: string };
  service: {
    name: string;
    description: string;
    includes: string[];
    delivery: string;
  };
  priceLabel: string;
  paymentTerms: string[];
  clauses: { title: string; body: string }[];
  bank: BankInfo | null;
}

function parseClp(price: string): number {
  return Number(price.replace(/[^\d]/g, ""));
}

function formatClp(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}

function getBankInfo(): BankInfo | null {
  const { BANK_NAME, BANK_ACCOUNT_TYPE, BANK_ACCOUNT_NUMBER, BANK_HOLDER, BANK_RUT, BANK_EMAIL } = process.env;
  if (!BANK_NAME || !BANK_ACCOUNT_NUMBER) return null;
  return {
    bankName: BANK_NAME,
    accountType: BANK_ACCOUNT_TYPE ?? "Cuenta corriente",
    accountNumber: BANK_ACCOUNT_NUMBER,
    holder: BANK_HOLDER ?? site.legalName,
    rut: BANK_RUT ?? process.env.COMPANY_RUT ?? "[RUT por completar]",
    email: BANK_EMAIL ?? site.email,
  };
}

function modsTotal(request: ContractRequest): number {
  return (request.modifications ?? []).reduce((sum, m) => sum + (m.amount ? parseClp(m.amount) : 0), 0);
}

function buildPaymentTerms(plan: Plan, request: ContractRequest): { priceLabel: string; terms: string[] } {
  const extra = modsTotal(request);
  const agreedBase = request.agreedAmount ? parseClp(request.agreedAmount) : null;
  const agreed = agreedBase != null ? agreedBase + extra : null;

  if (plan.quoted) {
    const amountLabel = agreed
      ? `${formatClp(agreed)} (IVA incluido)`
      : "el monto de la cotización aceptada por escrito por ambas partes";

    if (request.paymentPlan === "monthly") {
      return {
        priceLabel: agreed ? `${formatClp(agreed)} mensuales, IVA incluido` : "Según cotización aceptada (mensual)",
        terms: [
          `Pago mensual por transferencia bancaria, por ${amountLabel}, dentro de los primeros 5 días de cada mes.`,
          "El servicio puede terminarse por cualquiera de las partes avisando con 30 días de anticipación, sin multas.",
        ],
      };
    }

    const base = agreed ?? null;
    if (request.paymentPlan === "split") {
      return {
        priceLabel: agreed ? `${formatClp(agreed)} IVA incluido` : "Según cotización aceptada",
        terms: [
          base
            ? `50% al aceptar este contrato (${formatClp(Math.ceil(base / 2))}) por transferencia bancaria.`
            : "50% del monto cotizado al aceptar este contrato, por transferencia bancaria.",
          base
            ? `50% contra entrega conforme (${formatClp(Math.floor(base / 2))}) por transferencia bancaria.`
            : "50% restante contra entrega conforme, por transferencia bancaria.",
        ],
      };
    }
    return {
      priceLabel: agreed ? `${formatClp(agreed)} IVA incluido` : "Según cotización aceptada",
      terms: [`Pago único de ${amountLabel} por transferencia bancaria al aceptar este contrato.`],
    };
  }

  // Planes con precio cerrado publicado: total = plan base + modificaciones.
  const total = parseClp(plan.price!) + extra;
  const baseLabel =
    extra > 0 ? `${formatClp(total)} (plan ${plan.price} + modificaciones ${formatClp(extra)})` : `${plan.price}`;
  if (request.paymentPlan === "monthly") {
    return {
      priceLabel: `${baseLabel} IVA incluido`,
      terms: [
        `Pago mensual por transferencia bancaria, por ${formatClp(parseClp(plan.price!))} (IVA incluido), dentro de los primeros 5 días de cada mes.`,
        ...(extra > 0 ? [`Modificaciones acordadas por ${formatClp(extra)} (IVA incluido), como pago único junto al primer mes.`] : []),
        "El servicio puede terminarse por cualquiera de las partes avisando con 30 días de anticipación, sin multas.",
      ],
    };
  }
  if (request.paymentPlan === "split") {
    return {
      priceLabel: `${baseLabel} IVA incluido`,
      terms: [
        `50% al aprobar la demo y aceptar este contrato: ${formatClp(Math.ceil(total / 2))}, por transferencia bancaria.`,
        `50% contra entrega conforme del sitio publicado: ${formatClp(Math.floor(total / 2))}, por transferencia bancaria.`,
      ],
    };
  }
  return {
    priceLabel: `${baseLabel} IVA incluido`,
    terms: [
      `Pago único de ${formatClp(total)} (IVA incluido) por transferencia bancaria, al aprobar la demo gratuita y aceptar este contrato.`,
    ],
  };
}

export function buildContract(request: ContractRequest): Contract {
  const plan = allContractablePlans.find((p) => p.id === request.planId)!;
  const now = new Date();
  const number = `HDV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const date = now.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

  const { priceLabel, terms } = buildPaymentTerms(plan, request);

  const clauses: Contract["clauses"] = [
    {
      title: "Objeto",
      body: `${site.legalName} ("el Prestador") se obliga a prestar a ${
        request.client.company || request.client.name
      } ("el Cliente") el servicio "${plan.name}": ${plan.longDescription} Incluye: ${plan.includes.join(", ")}.${
        request.existingSiteUrl ? ` El servicio se prestará sobre el sitio existente: ${request.existingSiteUrl}.` : ""
      }`,
    },
    ...(request.modifications?.length
      ? [
          {
            title: "Modificaciones acordadas a la demo",
            body: `Tras la revisión de la demo, las partes acuerdan las siguientes modificaciones, cuyos valores forman parte del precio final: ${request.modifications
              .map((m) => `${m.description} (${m.amount ? `${formatClp(parseClp(m.amount))} IVA incluido` : "incluida sin costo adicional"})`)
              .join("; ")}.`,
          },
        ]
      : []),
    {
      title: "Precio",
      body: `El precio del servicio es ${priceLabel}. Los montos indicados incluyen IVA. El Prestador emitirá factura o boleta según corresponda.`,
    },
    {
      title: "Forma de pago",
      body: `El pago se realiza por transferencia bancaria según los siguientes hitos: ${terms.join(" ")}`,
    },
    {
      title: "Plazo",
      body: plan.quoted
        ? `El plazo de ejecución se define en la cotización aceptada (referencia: ${plan.delivery.toLowerCase()}).`
        : `El plazo de entrega es de ${plan.delivery.toLowerCase()} contado desde el pago inicial, salvo que el Cliente demore la entrega de información o materiales necesarios.`,
    },
    {
      title: "Demo previa y ajustes",
      body: plan.quoted
        ? "El trabajo incluye una ronda de ajustes menores sobre lo entregado. Cambios adicionales se cotizan por separado, siempre con precio acordado antes."
        : "El Cliente cuenta con una demo gratuita previa al pago. La entrega incluye una ronda de ajustes menores; cambios adicionales se cotizan por separado, siempre con precio acordado antes.",
    },
    {
      title: "Revisión del contrato",
      body: "Este documento es un borrador para revisión de ambas partes y no produce obligaciones hasta su aceptación por escrito. Cualquier modificación — incluida otra alternativa de forma de pago — se acuerda entre las partes antes de la firma.",
    },
  ];

  return {
    number,
    date,
    provider: {
      legalName: site.legalName,
      rut: process.env.COMPANY_RUT ?? "[RUT por completar]",
      representative: site.personName,
      email: site.email,
      phone: site.whatsapp ? `+${site.whatsapp}` : "[teléfono]",
    },
    client: { ...request.client, existingSiteUrl: request.existingSiteUrl },
    service: {
      name: plan.name,
      description: plan.longDescription,
      includes: plan.includes,
      delivery: plan.delivery,
    },
    priceLabel,
    paymentTerms: terms,
    clauses,
    bank: getBankInfo(),
  };
}
