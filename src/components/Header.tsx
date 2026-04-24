import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onCartOpen: () => void;
  onSearch: (q: string) => void;
}

export function Header({ onCartOpen, onSearch }: HeaderProps) {
  const { count } = useCart();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-[hsl(var(--hairline))]">
      <div className="container-editorial flex items-center justify-between h-20 gap-6">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-2xl tracking-tight">Relicário</span>
          <span className="text-eyebrow hidden sm:inline">Digital</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }}
              placeholder="buscar artista, álbum, gênero…"
              className="pl-10 bg-transparent border-0 border-b border-[hsl(var(--hairline))] rounded-none focus-visible:ring-0 focus-visible:border-foreground placeholder:text-muted-foreground/60 placeholder:font-light"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/admin")} className="text-eyebrow link-underline hidden sm:inline">
            Admin
          </button>
          <Button variant="ghost" size="icon" onClick={onCartOpen} className="relative" aria-label="Sacola">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
