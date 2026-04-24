export interface Product {
  id: string;
  artista: string;
  titulo: string;
  ano: number;
  estilo: string;
  gravadora: string;
  preco: number;
  status: "disponivel" | "vendido";
  url_imagem: string;
  descricao: string;
}

export interface CartItem extends Product {
  quantidade: number;
}
