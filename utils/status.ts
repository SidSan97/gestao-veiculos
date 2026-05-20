export function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "pago" || s === "paga") return "text-bg-success";
  if (s === "pendente") return "text-bg-warning";
  if (s === "cancelada" || s === "cancelado") return "text-bg-secondary";
  return "text-bg-info";
}
