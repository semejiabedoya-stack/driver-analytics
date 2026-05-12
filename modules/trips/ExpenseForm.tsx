"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, SelectField } from "@/components/ui/Field";
import { useAppStore } from "@/store/appStore";
import { EXPENSE_CATEGORIES } from "@/utils/constants";
import type { ExpenseCategory } from "@/types/domain";

const schema = z.object({
  value: z.coerce.number().positive(),
  category: z.enum(EXPENSE_CATEGORIES),
  description: z.string().max(160).optional()
});

type ExpenseValues = z.infer<typeof schema>;

type ExpenseFormProps = {
  accent: string;
};

export function ExpenseForm({ accent }: ExpenseFormProps) {
  const addExpense = useAppStore((state) => state.addExpense);
  const form = useForm<ExpenseValues>({ resolver: zodResolver(schema), defaultValues: { value: 0, category: "gasolina", description: "" } });

  function onSubmit(values: ExpenseValues) {
    addExpense({ id: crypto.randomUUID(), value: values.value, category: values.category as ExpenseCategory, description: values.description, createdAt: new Date().toISOString() });
    form.reset({ value: 0, category: "gasolina", description: "" });
  }

  return (
    <Card>
      <h2 className="text-xl font-black">Registrar gasto</h2>
      <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]" onSubmit={form.handleSubmit(onSubmit)}>
        <Field label="Valor" type="number" inputMode="decimal" min="0" step="100" {...form.register("value")} />
        <SelectField label="Categoria" {...form.register("category")}>
          {EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </SelectField>
        <Field label="Descripcion" placeholder="Opcional" {...form.register("description")} />
        <Button type="submit" accent={accent} className="self-end">
          <Plus size={18} /> Guardar
        </Button>
      </form>
    </Card>
  );
}
