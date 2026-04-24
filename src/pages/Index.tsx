import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { RequestRecord } from "@/components/RequestRecord";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ChatWidget } from "@/components/ChatWidget";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartOpen={() => setCartOpen(true)} onSearch={setQuery} />
      <main className="flex-1">
        <Hero />
        <ProductGrid query={query} />
        <RequestRecord />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <ChatWidget />
    </div>
  );
};

export default Index;
