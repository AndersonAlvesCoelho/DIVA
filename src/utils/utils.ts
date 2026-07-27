export function calcTempo(inicio: string, fim: string): { hhmm: string; dec: string } {
  if (!inicio || !fim) return { hhmm: "--:--", dec: "0,00" };
  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fim.split(":").map(Number);
  if ([hi, mi, hf, mf].some((n) => Number.isNaN(n))) return { hhmm: "--:--", dec: "0,00" };
  let diff = hf * 60 + mf - (hi * 60 + mi);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return {
    hhmm: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    dec: (diff / 60).toFixed(2).replace(".", ","),
  };
}