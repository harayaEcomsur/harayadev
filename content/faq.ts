export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "¿De verdad no pago nada hasta ver la demo?",
    answer:
      "Exacto. Me cuentas de tu negocio, armo una demo con tu marca en 24 horas y te la muestro funcionando. Solo si te convence pagas el plan. Si no, quedamos como amigos.",
  },
  {
    question: "¿Qué incluye exactamente el precio cerrado?",
    answer:
      "Todo lo necesario para partir: diseño, desarrollo, asistente IA entrenado con tu información, dominio .cl el primer año, hosting inicial, puesta en marcha y una ronda de ajustes. El precio incluye IVA — el monto que ves es el monto que pagas.",
  },
  {
    question: "¿Cómo se paga?",
    answer:
      "Por transferencia bancaria, con dos alternativas: 100% al aprobar la demo, o 50% para partir y 50% contra entrega. Al contratar se genera un contrato simple donde queda todo por escrito — plan, precio, plazo y forma de pago — para que lo revises antes de transferir. Emitimos factura o boleta.",
  },
  {
    question: "¿Cómo se entrena el asistente IA con mi negocio?",
    answer:
      "Me entregas la información clave — servicios, precios, horarios, políticas de despacho, preguntas típicas de tus clientes — y configuro el asistente para responder con eso. Puedes actualizar la información cuando cambie.",
  },
  {
    question: "¿Qué pasa si necesito cambios después de la entrega?",
    answer:
      "La entrega incluye una ronda de ajustes. Después, los cambios menores (textos, precios, fotos) tienen un valor fijo por solicitud, o puedes contratar la mantención mensual de $29.990 (IVA incluido), que además cubre hosting, dominio y la actualización del asistente IA.",
  },
  {
    question: "¿La tienda funciona con Webpay de verdad?",
    answer:
      "Sí, integro Webpay Plus de Transbank: tus clientes pagan con débito, crédito o prepago y la plata llega directo a tu cuenta. Te acompaño en el trámite de afiliación a Transbank si aún no lo tienes.",
  },
  {
    question: "¿Y si mi rubro es muy específico?",
    answer:
      "El asistente se entrena con la información de TU negocio, así que funciona igual para una barbería, una ferretería o un estudio contable. En la demo gratis lo ves respondiendo preguntas reales de tu rubro antes de decidir.",
  },
];
