import type { Product } from "../types/product";
import { initialProducts } from "./products";

const STORAGE_KEY = "achei-brasil-products";

export function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialProducts;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return initialProducts;
    }

    return parsed;
  } catch {
    return initialProducts;
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
