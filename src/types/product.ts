export type Store = string;

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
