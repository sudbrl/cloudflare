import { useMemo, useState } from "react";
import { Plus, TrendingDown, Wallet, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseTable } from "@/components/ExpenseTable";
import { CategoryPill } from "@/components/CategoryPill";
import { CATEGORIES, type CategoryId, type Expense } from "@/types";
import { formatCurrency } from "@/utils";

const seedExpenses: Expense[] = [
  { id: "s1", amount: 42.5, category: "food", note: "Corner deli lunch", date: "2025-03-02" },
  { id: "s2", amount: 18.0, category: "transport", note: "Metro card refill", date: "2025-03-03" },
  { id: "s3", amount: 64.2, category: "food", note: "Sunday groceries", date: "2025-03-05" },
  { id: "s4", amount: 32.0, category: "entertainment", note: "Indie film screening", date: "2025-03-07" },
  { id: "s5", amount: 12.75, category: "food", note: "Coffee + pastry", date: "2025-03-08" },
  { id: "s6", amount: 55.0, category: "transport", note: "Ride home", date: "2025-03-09" },
  { id: "s7", amount: 28.4, category: "food", note: "Diner breakfast", date: "2025-03-10" },
  { id: "s8", amount: 14.99, category: "entertainment", note: "Album download", date: "2025-03-11" },
  { id: "s9", amount: 47.3, category: "food", note: "Weeknight takeout", date: "2025-03-12" },
  { id: "s10", amount: 9.5, category: "transport", note: "Bus fare", date: "2025-03-13" },
];

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
  const [month, setMonth] = useState("2025-03");
  const [showForm, setShowForm] = useState(false);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(month)),
    [expenses, month]
  );

  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = useMemo(() => {
    const map = new Map<CategoryId, number>();
    for (const e of monthExpenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    return CATEGORIES.map((c) => ({
      name: c.label,
      value: map.get(c.id) ?? 0,
      color: c.color,
      id: c.id,
    })).filter((c) => c.value > 0);
  }, [monthExpenses]);

  const byDay = useMemo(() => {
    const days = new Map<string, number>();
    for (const e of monthExpenses) {
      const day = e.date.slice(8, 10);
      days.set(day, (days.get(day) ?? 0) + e.amount);
    }
    return Array.from(days.entries())
      .map(([day, value]) => ({ day: `D${parseInt(day, 10)}`, value }))
      .sort((a, b) => parseInt(a.day.slice(1)) - parseInt(b.day.slice(1)));
  }, [monthExpenses]);

  const avgDaily = monthExpenses.length > 0 ? total / 31 : 0;
  const topCategory = byCategory.length > 0 ? [...byCategory].sort((a, b) => b.value - a.value)[0] : null;

  const addExpense = (expense: Omit<Expense, "id">) => {
    setExpenses((prev) => [{ ...expense, id: crypto.randomUUID() }, ...prev]);
    setShowForm(false);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const monthOptions = [
    { value: "2025-03", label: "March 2025" },
    { value: "2025-02", label: "February 2025" },
    { value: "2025-01", label: "January 2025" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-300 bg-slate-50/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-700">
                Ledger
              </p>
              <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Personal Expenses
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-44 border-slate-300 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowForm((s) => !s)}
                className="bg-teal-700 hover:bg-teal-800"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                {showForm ? "Close" : "Add Expense"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Wallet className="h-4 w-4" />}
            label="Total Spent"
            value={formatCurrency(total)}
            accent="teal"
          />
          <StatCard
            icon={<Receipt className="h-4 w-4" />}
            label="Transactions"
            value={String(monthExpenses.length)}
            accent="slate"
          />
          <StatCard
            icon={<TrendingDown className="h-4 w-4" />}
            label="Daily Average"
            value={formatCurrency(avgDaily)}
            accent="slate"
          />
          <StatCard
            icon={<span className="text-sm font-bold">▲</span>}
            label="Top Category"
            value={topCategory ? topCategory.name : "—"}
            accent="slate"
          />
        </div>

        {showForm && (
          <div className="mt-6">
            <ExpenseForm onSubmit={addExpense} />
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-lg text-slate-900">
                Category Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              {byCategory.length > 0 ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={byCategory}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          stroke="none"
                        >
                        {byCategory.map((entry) => (
                          <Cell key={entry.id} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip
  				formatter={(value) => formatCurrency(Number(value ?? 0))}
                          contentStyle={{
                            borderRadius: "0.5rem",
                            border: "1px solid #e2e8f0",
                            fontSize: "0.875rem",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2">
                    {byCategory.map((c) => (
                      <CategoryPill key={c.id} color={c.color} label={c.name} value={c.value} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                  No expenses recorded this month.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-lg text-slate-900">
                Daily Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byDay} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
  formatter={(value: unknown) => [
    formatCurrency(Number(value ?? 0)),
    "Amount",
  ]}
  cursor={{ fill: "#f1f5f9" }}
  contentStyle={{
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    fontSize: "0.875rem",
  }}
/>
                    <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <ExpenseTable expenses={monthExpenses} onDelete={removeExpense} />
        </div>

        <Separator className="my-8 bg-slate-200" />
        <p className="text-center text-xs text-slate-400">
          Personal Expense Ledger · Data stored locally in your browser session
        </p>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "teal" | "slate";
}) {
  const isTeal = accent === "teal";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isTeal ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      <p className="mt-3 font-serif text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
