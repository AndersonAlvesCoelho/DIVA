//  calcula tempo de voo
export function calcFlightTime(
  start: string,
  end: string,
): { hhmm: string; decimal: string } {
  if (!start || !end) return { hhmm: "--:--", decimal: "0,00" };
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return {
    hhmm: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    decimal: (diff / 60).toFixed(2).replace(".", ","),
  };
}
