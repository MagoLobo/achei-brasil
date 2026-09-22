export type Store =
  | "TikTok Shop"
  | "Mercado Livre"
  | "Shopee"
  | "SHEIN"
  | "Magazine Luiza"
  | "Boticário";

export type Product = {
  id: string;
  name: string;
  store: Store;
  category: string;
  price: string;
  oldPrice: string;
  image: string;
  affiliateLink: string;
  featured: boolean;
  active: boolean;
};
