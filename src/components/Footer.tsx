export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--hairline))] mt-0">
      <div className="container-editorial py-16 grid md:grid-cols-3 gap-12">
        <div>
          <p className="font-serif text-2xl">Relicário Digital</p>
          <p className="text-eyebrow mt-2">Discos para escutar com tempo.</p>
        </div>
        <div>
          <p className="text-eyebrow mb-3">Navegar</p>
          <ul className="space-y-2 text-sm font-light text-muted-foreground">
            <li><a href="#catalogo" className="link-underline">Catálogo</a></li>
            <li><a href="#procuro" className="link-underline">Procuro um disco</a></li>
            <li><a href="/admin" className="link-underline">Área restrita</a></li>
          </ul>
        </div>
        <div>
          <p className="text-eyebrow mb-3">Contato</p>
          <p className="text-sm font-light text-muted-foreground leading-relaxed">
            atendimento@relicariodigital.com.br<br />
            Brasil — envios para todo território nacional.
          </p>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--hairline))]">
        <div className="container-editorial py-6 text-[11px] text-muted-foreground/70 font-light leading-relaxed text-center">
          As imagens de capas são referências históricas para identificação dos produtos físicos originais.
          Direitos reservados aos detentores das obras. © {new Date().getFullYear()} Relicário Digital.
        </div>
      </div>
    </footer>
  );
}
