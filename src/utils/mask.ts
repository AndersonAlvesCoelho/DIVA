export function maskAircraftPrefix(value: string) {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (clean.length <= 2) return clean;

  return `${clean.slice(0, 2)}-${clean.slice(2, 5)}`;
}
