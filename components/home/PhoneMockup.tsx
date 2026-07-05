export function PhoneMockup() {
  return (
    <div className="w-[340px] shrink-0 rounded-[48px] border-2 border-[#1E2836] bg-[#0B1220] p-[11px] shadow-[0_40px_90px_rgba(0,0,0,0.6)]">
      <div className="relative flex h-[668px] flex-col overflow-hidden rounded-[38px] bg-white">
        <div className="flex items-center justify-between px-5 pb-[5px] pt-[10px] font-mono text-xs text-[#0C1626]">
          <span>9:41</span>
          <span className="flex items-center gap-[5px]">
            <span className="h-2 w-[15px] rounded-[2px] bg-[#0C1626]" />
            <span className="h-2 w-2 rounded-full bg-[#0C1626]" />
          </span>
        </div>
        <div className="flex items-center justify-between px-[18px] py-[10px]">
          <span className="text-sm font-extrabold text-[#0C1626]">EL MAESTRO</span>
          <span className="flex flex-col gap-[3.5px]">
            <span className="h-[2px] w-[18px] bg-[#0C1626]" />
            <span className="h-[2px] w-[18px] bg-[#0C1626]" />
            <span className="h-[2px] w-[18px] bg-[#0C1626]" />
          </span>
        </div>
        <div className="mx-3 flex h-[190px] flex-col justify-center gap-[9px] rounded-[14px] bg-gradient-to-br from-[#0C1626] to-[#16283F] px-5">
          <span className="text-[22px] font-black leading-[1.1] text-white">
            Barbería
            <br />
            El Maestro
          </span>
          <span className="text-xs text-soft">Reserva online en 30 segundos</span>
          <span className="self-start whitespace-nowrap rounded-[7px] bg-primary px-4 py-2 text-xs font-bold text-white">
            Reservar hora
          </span>
        </div>
        <div className="flex gap-[9px] p-3">
          {[
            { name: "Corte clásico", price: "$12.000" },
            { name: "Corte + barba", price: "$18.000" },
          ].map((item) => (
            <div key={item.name} className="flex flex-1 flex-col gap-[6px] rounded-[11px] border border-[#E4E8EE] p-[9px]">
              <span
                className="h-[54px] rounded-[7px]"
                style={{
                  background: "repeating-linear-gradient(45deg, #EEF1F5, #EEF1F5 8px, #E4E8EE 8px, #E4E8EE 16px)",
                }}
              />
              <span className="text-[11px] font-bold text-[#0C1626]">{item.name}</span>
              <span className="text-[11px] text-[#5A6675]">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-3 bottom-3 flex flex-col gap-[9px] rounded-2xl border border-[#E4E8EE] bg-white p-3 shadow-[0_12px_40px_rgba(12,22,38,0.25)]">
          <div className="flex items-center gap-[9px]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-bold text-white">
              IA
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-bold text-[#0C1626]">Asistente El Maestro</span>
              <span className="text-[10px] text-[#1DAB61]">● en línea</span>
            </span>
          </div>
          <div className="rounded-[11px] rounded-bl-[4px] bg-[#F1F3F7] px-[11px] py-[9px] text-xs leading-[1.4] text-[#0C1626]">
            Hola, ¿te agendo una hora para hoy? Queda un cupo a las 18:30.
          </div>
        </div>
      </div>
    </div>
  );
}
