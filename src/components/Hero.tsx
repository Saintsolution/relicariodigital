import heroImage from "@/assets/hero-records.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[hsl(var(--hairline))]">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Coleção de CDs e vinis raros"
          className="w-full h-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      <div className="relative container-editorial py-28 md:py-40">
        <p className="text-eyebrow mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
          Catálogo · Edição contínua
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Discos que sobreviveram <em className="italic text-muted-foreground">ao tempo.</em>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground font-light leading-relaxed animate-in fade-in duration-1000 delay-200">
          Curadoria de CDs recuperados, restaurados e catalogados um a um.
          Para colecionadores que escutam com atenção.
        </p>
        <div className="mt-10 flex items-center gap-6">
          <a href="#catalogo" className="text-eyebrow link-underline">
            Ver catálogo →
          </a>
          <a href="#procuro" className="text-eyebrow link-underline text-muted-foreground">
            Procuro um disco
          </a>
        </div>
      </div>
    </section>
  );
}
