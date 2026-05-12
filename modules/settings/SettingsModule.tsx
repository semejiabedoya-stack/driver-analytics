"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { useAppStore } from "@/store/appStore";

const schema = z.object({
  name: z.string().min(2),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  commissionRate: z.coerce.number().min(0).max(100),
  taxRate: z.coerce.number().min(0).max(100)
});

type PlatformValues = z.infer<typeof schema>;

type SettingsModuleProps = {
  accent: string;
};

export function SettingsModule({ accent }: SettingsModuleProps) {
  const platforms = useAppStore((state) => state.platforms);
  const upsertPlatform = useAppStore((state) => state.upsertPlatform);
  const deletePlatform = useAppStore((state) => state.deletePlatform);
  const form = useForm<PlatformValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", color: "#22c55e", commissionRate: 10, taxRate: 4 }
  });

  function onSubmit(values: PlatformValues) {
    upsertPlatform({
      id: values.name.toLowerCase().replace(/\s+/g, "-"),
      name: values.name,
      color: values.color as `#${string}`,
      commissionRate: values.commissionRate / 100,
      taxRate: values.taxRate / 100,
      createdAt: new Date().toISOString()
    });
    form.reset({ name: "", color: "#22c55e", commissionRate: 10, taxRate: 4 });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="text-xl font-black">Crear plataforma</h2>
        <form className="mt-4 grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Nombre" {...form.register("name")} />
          <Field label="Color" type="color" {...form.register("color")} />
          <Field label="Comision %" type="number" min="0" max="100" step="0.1" {...form.register("commissionRate")} />
          <Field label="Impuestos %" type="number" min="0" max="100" step="0.1" {...form.register("taxRate")} />
          <Button type="submit" accent={accent}>Guardar plataforma</Button>
        </form>
      </Card>
      <div className="grid gap-3">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <div className="flex items-center gap-4">
              <span className="h-12 w-12 rounded-2xl" style={{ backgroundColor: platform.color }} />
              <div className="mr-auto">
                <h3 className="text-lg font-black">{platform.name}</h3>
                <p className="text-sm text-slate-400">Comision {Math.round(platform.commissionRate * 100)}% · Impuestos {Math.round(platform.taxRate * 100)}%</p>
              </div>
              <Button variant="ghost" onClick={() => deletePlatform(platform.id)} aria-label={`Eliminar ${platform.name}`}>
                <Trash2 size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
