"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";

const schema = z.object({
  email: z.string().email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres")
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Sesion iniciada correctamente.");
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-black">Driver Analytics</h1>
        <p className="mt-2 text-sm text-slate-400">Ingresa con Supabase Auth para sincronizar tus viajes.</p>
        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Correo" type="email" autoComplete="email" {...form.register("email")} />
          <Field label="Contrasena" type="password" autoComplete="current-password" {...form.register("password")} />
          <Button type="submit" accent="#22c55e">Entrar</Button>
          {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        </form>
      </Card>
    </main>
  );
}
