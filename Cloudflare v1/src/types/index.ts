export type CategoryId = "food" | "transport" | "entertainment" | "utilities" | "other";

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  note: string;
  date: string; // YYYY-MM-DD
}

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "food", label: "Food", color: "#0f766e" },
  { id: "transport", label: "Transport", color: "#0891b2" },
  { id: "entertainment", label: "Entertainment", color: "#7c3aed" },
  { id: "utilities", label: "Utilities", color: "#ca8a04" },
  { id: "other", label: "Other", color: "#64748b" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, Category>
);