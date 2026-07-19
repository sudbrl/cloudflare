import { CATEGORY_MAP, type CategoryId } from "@/types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getCategoryColor(id: CategoryId): string {
  return CATEGORY_MAP[id]?.color ?? "#64748b";
}

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORY_MAP[id]?.label ?? "Other";
}