// Substitua estas URLs pelas do seu n8n / Asaas em produção
export const WEBHOOKS = {
  catalogarIA: "https://seu-n8n.com/webhook/catalogar-cd",
  finalizarCompra: "https://seu-n8n.com/webhook/checkout-asaas",
  procuroDisco: "https://seu-n8n.com/webhook/procuro-disco",
  chatIA: "https://seu-n8n.com/webhook/chat-musical",
} as const;
