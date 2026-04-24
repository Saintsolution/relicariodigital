import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WEBHOOKS } from "@/config/webhooks";
import curatorAvatar from "@/assets/curator-avatar.png";

interface Msg { role: "user" | "bot"; text: string }

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState<Msg[]>([
    { role: "bot", text: "Olá. Procura algum disco em particular, uma recomendação por estilo ou quer conversar sobre música?" },
  ]);
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, thinking]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = msg.trim();
    if (!text || thinking) return;
    const nextHistory = [...history, { role: "user" as const, text }];
    setHistory(nextHistory);
    setMsg("");
    setThinking(true);

    try {
      // O n8n deve responder com JSON: { "reply": "texto da IA" }
      const res = await fetch(WEBHOOKS.chatIA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      if (!res.ok) throw new Error("network");
      const data = await res.json().catch(() => ({} as any));
      const reply =
        data.reply ?? data.message ?? data.text ??
        "Recebi sua mensagem, mas não consegui formular uma resposta agora.";
      setHistory((h) => [...h, { role: "bot", text: String(reply) }]);
    } catch {
      setHistory((h) => [...h, {
        role: "bot",
        text: "Não consegui me conectar ao curador agora. Tente novamente em instantes.",
      }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-background border border-[hsl(var(--hairline))] hover:border-foreground/60 pr-5 pl-2 py-2 shadow-2xl transition-all hover:translate-y-[-2px]"
          aria-label="Abrir chat com o curador"
        >
          <span className="relative">
            <img
              src={curatorAvatar}
              alt="Curador"
              className="h-12 w-12 rounded-full object-cover bg-secondary"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
          </span>
          <span className="text-left">
            <span className="block text-eyebrow">Curador online</span>
            <span className="block font-serif text-base leading-tight">Fale comigo →</span>
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[26rem] h-[32rem] bg-background border border-[hsl(var(--hairline))] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--hairline))]">
            <div className="flex items-center gap-3">
              <span className="relative">
                <img src={curatorAvatar} alt="Curador" className="h-10 w-10 rounded-full object-cover bg-secondary" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
              </span>
              <div>
                <p className="text-eyebrow">Curador · online</p>
                <h3 className="font-serif text-lg leading-tight">Atendimento musical</h3>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {history.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 ${m.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground"} font-light leading-relaxed`}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 bg-secondary text-muted-foreground font-light italic text-xs">
                  digitando…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t border-[hsl(var(--hairline))] flex gap-2">
            <Input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Pergunte sobre um álbum, gênero…"
              className="bg-transparent border-[hsl(var(--hairline))] rounded-none"
              maxLength={300}
            />
            <Button type="submit" size="icon" className="rounded-none bg-foreground text-background hover:bg-foreground/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
