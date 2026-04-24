import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import catalog from "@/data/catalog.json";
import type { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 9;

export function ProductGrid({ query }: { query: string }) {
  const items = useMemo(() => {
    const all = catalog as Product[];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter((p) =>
      [p.artista, p.titulo, p.estilo, p.gravadora].some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));

  // Reset para página 1 quando a busca mudar
  useEffect(() => { setPage(1); }, [query]);
  // Garante que a página atual existe se a lista encolher
  useEffect(() => { if (page > totalPages) setPage(1); }, [page, totalPages]);

  const start = (page - 1) * PER_PAGE;
  const visible = items.slice(start, start + PER_PAGE);

  // Gera os números visíveis com elipses: 1 … (p-1) p (p+1) … fim
  const pageNumbers = useMemo(() => {
    const range: (number | "…")[] = [];
    const push = (n: number | "…") => range.push(n);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
    } else {
      push(1);
      if (page > 3) push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) push(i);
      if (page < totalPages - 2) push("…");
      push(totalPages);
    }
    return range;
  }, [page, totalPages]);

  const goTo = (n: number) => {
    setPage(n);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="catalogo" className="container-editorial py-20 md:py-28">
      <div className="flex items-end justify-between mb-12 border-b border-[hsl(var(--hairline))] pb-6">
        <div>
          <p className="text-eyebrow mb-2">Catálogo</p>
          <h2 className="font-serif text-4xl md:text-5xl">Acervo disponível</h2>
        </div>
        <p className="text-sm text-muted-foreground hidden md:block">
          {items.length} {items.length === 1 ? "título" : "títulos"}
          {totalPages > 1 && <> · página {page} de {totalPages}</>}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-20 font-light italic">
          Nenhum disco encontrado para esta busca.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Paginação do catálogo"
              className="mt-16 pt-8 border-t border-[hsl(var(--hairline))] flex items-center justify-center gap-1 sm:gap-2 flex-wrap"
            >
              <button
                onClick={() => goTo(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-9 px-3 flex items-center gap-1 text-eyebrow text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-3 w-3" /> Anterior
              </button>

              {pageNumbers.map((n, i) =>
                n === "…" ? (
                  <span key={`e${i}`} className="h-9 w-9 flex items-center justify-center text-muted-foreground">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => goTo(n)}
                    aria-current={n === page ? "page" : undefined}
                    className={`h-9 min-w-9 px-3 flex items-center justify-center font-serif text-base transition ${
                      n === page
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

              <button
                onClick={() => goTo(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="h-9 px-3 flex items-center gap-1 text-eyebrow text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition"
                aria-label="Próxima página"
              >
                Próxima <ChevronRight className="h-3 w-3" />
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
