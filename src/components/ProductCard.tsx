import type { Product } from "@/types/product";
import { useCart, formatBRL } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { add, has } = useCart();
  const sold = product.status === "vendido";
  const inCart = has(product.id);

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden bg-secondary aspect-square">
        <img
          src={product.url_imagem}
          alt={`${product.artista} — ${product.titulo}`}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${sold ? "grayscale opacity-50" : ""}`}
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-eyebrow border border-foreground/40 px-4 py-2 bg-background/60 backdrop-blur-sm">
              Vendido
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 flex flex-col gap-1">
        <p className="text-eyebrow">{product.estilo} · {product.ano}</p>
        <h3 className="font-serif text-xl leading-tight">{product.titulo}</h3>
        <p className="text-sm text-muted-foreground font-light">{product.artista}</p>
        <p className="text-[11px] text-muted-foreground/70 font-light italic">{product.gravadora}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-serif text-lg">{formatBRL(product.preco)}</span>
          <Button
            size="sm"
            variant="ghost"
            disabled={sold || inCart}
            onClick={() => add(product)}
            className="text-eyebrow hover:bg-transparent hover:text-foreground link-underline rounded-none px-0"
          >
            {sold ? "Indisponível" : inCart ? "Na sacola ✓" : "Adicionar →"}
          </Button>
        </div>
      </div>
    </article>
  );
}
