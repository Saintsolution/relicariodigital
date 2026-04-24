import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WEBHOOKS } from "@/config/webhooks";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(80),
  email: z.string().trim().email("E-mail inválido").max(120),
  pedido: z.string().trim().min(5, "Descreva o disco").max(500),
});

export function RequestRecord() {
  const [form, setForm] = useState({ nome: "", email: "", pedido: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await fetch(WEBHOOKS.procuroDisco, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      }).catch(() => {});
      toast.success("Pedido recebido", { description: "Entraremos em contato assim que localizarmos." });
      setForm({ nome: "", email: "", pedido: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="procuro" className="border-t border-[hsl(var(--hairline))] bg-secondary/30">
      <div className="container-editorial py-20 md:py-28 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-eyebrow mb-4">Encomenda</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            Procura um disco <em className="italic text-muted-foreground">específico</em>?
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed max-w-md">
            Conte-nos qual álbum você caça há tempos. Nossa rede de fornecedores e
            colecionadores cobre o Brasil inteiro — e parte do exterior.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-eyebrow block mb-2">Nome</label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground px-0"
              maxLength={80}
            />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">E-mail</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground px-0"
              maxLength={120}
            />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Qual disco você procura?</label>
            <Textarea
              value={form.pedido}
              onChange={(e) => setForm({ ...form, pedido: e.target.value })}
              rows={4}
              className="bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground px-0 resize-none"
              maxLength={500}
            />
          </div>
          <Button type="submit" disabled={loading} className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-foreground/90">
            {loading ? "Enviando…" : "Enviar pedido"}
          </Button>
        </form>
      </div>
    </section>
  );
}
