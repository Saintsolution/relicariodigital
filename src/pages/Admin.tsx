import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, ArrowLeft } from "lucide-react";
import { WEBHOOKS } from "@/config/webhooks";
import { toast } from "sonner";

type Slot = "capa" | "verso" | "selo";

export default function Admin() {
  const [imgs, setImgs] = useState<Record<Slot, string | null>>({ capa: null, verso: null, selo: null });
  const [preco, setPreco] = useState("");
  const [estado, setEstado] = useState("");
  const [obs, setObs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = (slot: Slot) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Imagem muito grande (máx 8MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => setImgs((p) => ({ ...p, [slot]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const catalogar = async () => {
    if (!imgs.capa || !imgs.verso || !imgs.selo) {
      toast.error("Envie as três fotos: capa, verso e selo do CD.");
      return;
    }
    if (!preco || !estado) { toast.error("Informe preço e estado."); return; }
    setLoading(true);
    try {
      // Webhook placeholder — n8n irá processar as 3 fotos com IA e gravar no Sheets
      await fetch(WEBHOOKS.catalogarIA, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imgs, preco: parseFloat(preco), estado, obs, ts: Date.now() }),
      }).catch(() => {});
      toast.success("Enviado para catalogação por IA", { description: "O n8n está processando as imagens." });
      setImgs({ capa: null, verso: null, selo: null });
      setPreco(""); setEstado(""); setObs("");
    } finally {
      setLoading(false);
    }
  };

  const slots: { key: Slot; label: string }[] = [
    { key: "capa", label: "Capa frontal" },
    { key: "verso", label: "Verso / contracapa" },
    { key: "selo", label: "CD / selo" },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-[hsl(var(--hairline))]">
        <div className="container-editorial h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-eyebrow link-underline">
            <ArrowLeft className="h-3 w-3" /> Voltar
          </Link>
          <span className="font-serif text-xl">Relicário · Admin</span>
        </div>
      </header>

      <main className="container-editorial py-12 max-w-3xl">
        <p className="text-eyebrow mb-3">Catalogação</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-3">Novo disco</h1>
        <p className="text-muted-foreground font-light mb-12 max-w-xl">
          Envie as três fotos do CD. A IA lerá capa, verso e selo simultaneamente
          e gerará o cadastro completo no Google Sheets via n8n.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {slots.map(({ key, label }) => (
            <div key={key}>
              <Label className="text-eyebrow block mb-3">{label}</Label>
              <label className="aspect-square block border border-dashed border-[hsl(var(--hairline))] hover:border-foreground/50 transition cursor-pointer relative overflow-hidden bg-secondary/30">
                {imgs[key] ? (
                  <img src={imgs[key]!} alt={label} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Upload className="h-5 w-5" />
                    <span className="text-[11px] uppercase tracking-wider">Enviar</span>
                  </div>
                )}
                <input type="file" accept="image/*" capture="environment" onChange={handleUpload(key)} className="hidden" />
              </label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-eyebrow block mb-2">Preço (R$)</Label>
            <Input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)}
              className="bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground px-0" />
          </div>
          <div>
            <Label className="text-eyebrow block mb-2">Estado de conservação</Label>
            <Input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Excelente / Bom / Regular"
              className="bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground px-0" />
          </div>
        </div>

        <div className="mb-10">
          <Label className="text-eyebrow block mb-2">Observações (opcional)</Label>
          <Textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3}
            className="bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground px-0 resize-none" />
        </div>

        <Button onClick={catalogar} disabled={loading} className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-foreground/90 gap-2">
          <Sparkles className="h-4 w-4" />
          {loading ? "Enviando…" : "Catalogar via IA"}
        </Button>
      </main>
    </div>
  );
}
