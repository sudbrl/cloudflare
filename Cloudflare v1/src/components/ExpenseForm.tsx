import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type CategoryId, type Expense } from "@/types";

interface Props {
  onSubmit: (expense: Omit<Expense, "id">) => void;
}

export function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    onSubmit({
      amount: parsed,
      category,
      note: note.trim() || "Untitled",
      date,
    });
    setAmount("");
    setNote("");
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg text-slate-900">New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs uppercase tracking-wider text-slate-500">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-slate-300"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-slate-500">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as CategoryId)}>
              <SelectTrigger className="border-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs uppercase tracking-wider text-slate-500">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-slate-300"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-xs uppercase tracking-wider text-slate-500">
              Note
            </Label>
            <Input
              id="note"
              placeholder="What was it for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-slate-300"
            />
          </div>
          <div className="sm:col-span-4 flex justify-end">
            <Button type="submit" className="bg-teal-700 hover:bg-teal-800">
              Log Expense
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}