import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, formatBRL } from "@/context/CartContext";
import { WEBHOOKS } from "@/config/webhooks";
import { toast } from "sonner";
import { X } from "lucide-react";

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { items, total, remove, clear } = useCart();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    const payload = {
      ids: items.map((i) => i.id),
      total,
      origem: "relicario-digital",
    };
    try {
      // Webhook placeholder — substitua pela URL real do n8n / Asaas
      await fetch(WEBHOOKS.finalizarCompra, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
      toast.success("Pedido enviado", { description: "Você será redirecionado para o pagamento." });
      console.log("[checkout] payload →", payload);
    } catch {
      toast.error("Não foi possível enviar o pedido agora.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-[hsl(var(--hairline))] w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-[hsl(var(--hairline))] pb-4">
          <SheetTitle className="font-serif text-2xl text-left">Sua sacola</SheetTitle>
          <p className="text-eyebrow text-left">{items.length} {items.length === 1 ? "item" : "itens"}</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {items.length === 0 && (
            <p className="text-muted-foreground text-sm font-light italic text-center py-12">
              Sua sacola está vazia.
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <img src={item.url_imagem} alt={item.titulo} className="w-20 h-20 object-cover bg-secondary" />
              <div className="flex-1 min-w-0">
                <p className="text-eyebrow">{item.artista}</p>
                <h4 className="font-serif text-lg leading-tight truncate">{item.titulo}</h4>
                <p className="text-sm mt-1">{formatBRL(item.preco)}</p>
              </div>
              <button
                onClick={() => remove(item.id)}
                className="text-muted-foreground hover:text-foreground self-start"
                aria-label="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[hsl(var(--hairline))] pt-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-eyebrow">Total</span>
              <span className="font-serif text-2xl">{formatBRL(total)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full rounded-none h-12 bg-foreground text-background hover:bg-foreground/90">
              Finalizar compra
            </Button>
            <button onClick={clear} className="w-full text-eyebrow text-muted-foreground hover:text-foreground link-underline mx-auto block">
              Esvaziar sacola
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
