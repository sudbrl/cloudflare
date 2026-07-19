import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Expense } from "@/types";
import { formatCurrency, formatShortDate, getCategoryColor, getCategoryLabel } from "@/utils";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onDelete }: Props) {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg text-slate-900">
          Transaction Ledger
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-slate-400">
            No transactions this month. Click "Add Expense" to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Note
                  </th>
                  <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>
                  <th className="pb-2 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e) => {
                  const color = getCategoryColor(e.category);
                  return (
                    <tr
                      key={e.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="py-3 pr-4 text-slate-600">
                        {formatShortDate(e.date)}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-slate-700">
                            {getCategoryLabel(e.category)}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{e.note}</td>
                      <td className="py-3 pr-4 text-right font-mono font-medium text-slate-900">
                        {formatCurrency(e.amount)}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => onDelete(e.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Running Total
                  </td>
                  <td className="pt-3 pr-4 text-right font-mono text-base font-bold text-teal-800">
                    {formatCurrency(sorted.reduce((s, e) => s + e.amount, 0))}
                  </td>
                  <td className="pt-3 pl-4">&nbsp;</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}