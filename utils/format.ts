export function formatPreco(valor: string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatKm(km: number) {
  return km.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + " km";
}

export function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
