import { useRef, useState } from "react";
import type { Product, Store } from "../types/product";
import { loadProducts, saveProducts } from "../data/productStore";
import "./Admin.css";

function Admin() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem("achei-brasil-stores");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // usa a lista padrão abaixo
      }
    }

    return [
      "TikTok Shop",
      "Mercado Livre",
      "Shopee",
      "SHEIN",
      "Magazine Luiza",
      "Boticário",
    ];
  });

  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    store: "Mercado Livre",
    category: "Tecnologia",
    price: "",
    oldPrice: "",
    image: "",
    affiliateLink: "",
    featured: true,
    active: true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: String(reader.result || ""),
      }));
    };

    reader.readAsDataURL(file);
  };

  const addStore = () => {
    const name = window.prompt("Nome da nova loja:");

    if (!name?.trim()) return;

    const storeName = name.trim();

    if (stores.some((store) => store.toLowerCase() === storeName.toLowerCase())) {
      alert("Esta loja já está cadastrada.");
      return;
    }

    const nextStores = [...stores, storeName];
    setStores(nextStores);
    localStorage.setItem("achei-brasil-stores", JSON.stringify(nextStores));

    setForm((current) => ({
      ...current,
      store: storeName as Store,
    }));
  };

  const updateProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    saveProducts(nextProducts);
  };

  const saveProduct = () => {
    if (!form.name.trim() || !form.image.trim()) {
      alert("Preencha pelo menos o nome e a imagem do produto.");
      return;
    }

    if (editingId) {
      updateProducts(
        products.map((product) =>
          product.id === editingId ? { ...form, id: editingId } : product
        )
      );

      setEditingId(null);
    } else {
      updateProducts([
        ...products,
        {
          ...form,
          id: `produto-${Date.now()}`,
        },
      ]);
    }

    setForm({
      id: "",
      name: "",
      store: "Mercado Livre",
      category: "Tecnologia",
      price: "",
      oldPrice: "",
      image: "",
      affiliateLink: "",
      featured: true,
      active: true,
    });
  };

  const editProduct = (product: Product) => {
    setForm(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Deseja realmente remover este produto?")) return;

    updateProducts(
      products.filter((product) => product.id !== id)
    );
  };

  const toggleActive = (id: string) => {
    updateProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, active: !product.active }
          : product
      )
    );
  };

  return (
    <div className="admin">
      <header className="admin-header">
        <div>
          <span>ACHEI BRASIL</span>
          <h1>Painel Administrativo</h1>
        </div>

        <div className="admin-status">
          ● Administração
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-card">
          <div className="admin-title">
            <div>
              <span>CATÁLOGO</span>
              <h2>{editingId ? "Editar produto" : "Adicionar produto"}</h2>
            </div>
          </div>

          <div className="admin-form">
            <label>
              Nome do produto
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Ex.: Fone Bluetooth"
              />
            </label>

            <div className="store-field">
              <label>
                Loja
                <select
                  value={form.store}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      store: e.target.value as Store,
                    })
                  }
                >
                  {stores.map((store) => (
                    <option key={store}>{store}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="new-store-button"
                onClick={addStore}
              >
                ＋ NOVA LOJA
              </button>
            </div>

            <label>
              Categoria
              <input
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="Tecnologia"
              />
            </label>

            <div className="form-row">
              <label>
                Preço
                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="R$ 79,90"
                />
              </label>

              <label>
                Preço anterior
                <input
                  value={form.oldPrice}
                  onChange={(e) =>
                    setForm({ ...form, oldPrice: e.target.value })
                  }
                  placeholder="R$ 129,90"
                />
              </label>
            </div>

            <div className="image-upload">
              <span>Imagem do produto</span>

              <div className="image-upload-buttons">
                <button
                  type="button"
                  className="image-upload-button"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  🖼️ GALERIA
                </button>

                <button
                  type="button"
                  className="image-upload-button"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  📷 CÂMERA
                </button>
              </div>

              <input
                ref={galleryInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageFile(e.target.files?.[0]);
                  e.currentTarget.value = "";
                }}
              />

              <input
                ref={cameraInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  handleImageFile(e.target.files?.[0]);
                  e.currentTarget.value = "";
                }}
              />

              {form.image && (
                <div className="image-preview">
                  <img src={form.image} alt="Prévia do produto" />

                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => setForm({ ...form, image: "" })}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <label>
              Link de afiliado
              <input
                value={form.affiliateLink}
                onChange={(e) =>
                  setForm({
                    ...form,
                    affiliateLink: e.target.value,
                  })
                }
                placeholder="https://..."
              />
            </label>

            <div className="checks">
              <label className="check">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                />
                Destaque
              </label>

              <label className="check">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked,
                    })
                  }
                />
                Produto ativo
              </label>
            </div>

            <button className="save-button" onClick={saveProduct}>
              {editingId ? "SALVAR ALTERAÇÕES" : "＋ ADICIONAR PRODUTO"}
            </button>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-list-header">
            <div>
              <span>GERENCIAMENTO</span>
              <h2>Produtos cadastrados</h2>
            </div>

            <strong>{products.length}</strong>
          </div>

          <div className="admin-products">
            {products.map((product) => (
              <article className="admin-product" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="admin-product-info">
                  <small>{product.store}</small>
                  <h3>{product.name}</h3>
                  <p>
                    {product.price} · {product.category}
                  </p>

                  <span
                    className={
                      product.active
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {product.active ? "ATIVO" : "INATIVO"}
                  </span>
                </div>

                <div className="admin-actions">
                  <button onClick={() => editProduct(product)}>
                    ✏️
                  </button>

                  <button onClick={() => toggleActive(product.id)}>
                    {product.active ? "⏸️" : "▶️"}
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    🗑️
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
