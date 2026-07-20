// Almacén de leads calificados del módulo inmobiliario.
//
// DEMO/MVP: en memoria (globalThis), mismo patrón que booking-store — suficiente
// para mostrar el flujo completo (conversación → lead calificado → aviso al dueño).
// Los leads viven mientras viva el isolate del servidor; en producción este
// módulo se respalda en Postgres (Neon) sin cambiar nada del resto del código:
// solo se reemplazan estas funciones. Sin datos sembrados: un lead solo existe
// si alguien realmente conversó con el asistente.

export interface Lead {
  id: string; // 6 caracteres en mayúsculas, mismo formato que las reservas
  nombre: string;
  telefono: string;
  operacion: "compra" | "arriendo" | "no_sabe";
  comunas: string[];
  presupuesto?: string;
  plazo?: string;
  propiedadInteres?: string; // slug de una propiedad publicada (config.properties)
  notas?: string;
  createdAt: string;
}

interface Store {
  leads: Lead[];
}

const g = globalThis as unknown as { __leadStore?: Store };

function store(): Store {
  if (!g.__leadStore) {
    g.__leadStore = { leads: [] };
  }
  return g.__leadStore;
}

export function createLead(data: Omit<Lead, "id" | "createdAt">): Lead {
  const lead: Lead = {
    ...data,
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  store().leads.push(lead);
  return lead;
}

export function listLeads(): Lead[] {
  // Más recientes primero: el dueño quiere ver el último lead arriba.
  return [...store().leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
