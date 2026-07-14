export function buildWhatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Mensaje wa.me que el negocio envía a la clienta para coordinar abono o confirmar. */
export function buildBookingClientMessage(
  booking: { id: string; name: string; service: string; date: string; time: string; status: string },
  businessName: string
): string {
  const fecha = new Date(booking.date + "T12:00:00").toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return booking.status === "confirmada"
    ? `Hola ${booking.name}! Tu hora en ${businessName} quedó confirmada: ${booking.service}, ${fecha} a las ${booking.time} hrs. ¡Te esperamos! 😊`
    : `Hola ${booking.name}! Te escribimos de ${businessName}. Tu reserva ${booking.id} (${booking.service}, ${fecha} a las ${booking.time} hrs) está pendiente de abono — te enviamos los datos para transferir y dejarla confirmada 😊`;
}

export function buildBookingClientWaLink(
  booking: { id: string; name: string; service: string; date: string; time: string; status: string; phone: string },
  businessName: string
): string {
  return buildWhatsAppLink(booking.phone, buildBookingClientMessage(booking, businessName));
}
