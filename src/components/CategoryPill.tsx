import { formatCurrency } from "@/utils";

interface Props {
  color: string;
  label: string;
  value: number;
}

export function CategoryPill({ color, label, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-900">
        {formatCurrency(value)}
      </span>
    </div>
  );
}