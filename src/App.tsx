import { useEffect, useMemo, useState } from "react";
import "./App.css";
import type { Product, Store } from "./types/product";
import { loadProducts } from "./data/productStore";
import Admin from "./admin/Admin";

const stores: Store[] = [
  "TikTok Shop",
  "Mercado Livre",
  "Shopee",
  "SHEIN",
  "Magazine Luiza",
  "Boticário",
];



const slides = [
  {
    title: "Achadinhos que valem a descoberta",
    text: "Produtos, ofertas e novidades selecionadas para você.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Escolha onde você prefere comprar",
    text: "Encontre ofertas nas lojas que você já conhece.",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Realize seus próximos planos",
    text: "Conheça nossas opções de consórcio.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Serviços de contabilidade",
    text: "Encontre atendimento para suas necessidades.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=85",
  },
];

function App() {
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  const [slide, setSlide] = useState(0);
  const [products] = useState<Product[]>(loadProducts);
  const [selectedStore, setSelectedStore] = useState<Store | "Todas">("Todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return products.filter((product) => {
      const storeOK =
        selectedStore === "Todas" || product.store === selectedStore;

      const searchOK =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.store.toLowerCase().includes(term);

      return storeOK && searchOK;
    });
  }, [selectedStore, search]);

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="top-line">
          <div className="brand">
            <div className="brand-mark">🔎</div>
            <div>
              <strong>ACHEI BRASIL</strong>
              <span>Ofertas • Serviços • Oportunidades</span>
            </div>
          </div>

          <button
            className="header-contact"
            onClick={() => openLink("https://wa.me/")}
          >
            WhatsApp
          </button>
        </div>

        <div className="search-box">
          <span>🔍</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="O que você está procurando?"
          />
        </div>
      </header>

      <main>
        <section className="hero">
          <img src={slides[slide].image} alt={slides[slide].title} />

          <div className="hero-overlay">
            <span className="hero-tag">ACHEI BRASIL</span>
            <h1>{slides[slide].title}</h1>
            <p>{slides[slide].text}</p>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("ofertas")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              VER OFERTAS →
            </button>
          </div>

          <button
            className="carousel-arrow left"
            onClick={() =>
              setSlide((slide - 1 + slides.length) % slides.length)
            }
          >
            ‹
          </button>

          <button
            className="carousel-arrow right"
            onClick={() => setSlide((slide + 1) % slides.length)}
          >
            ›
          </button>

          <div className="dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={index === slide ? "dot active" : "dot"}
                onClick={() => setSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="section">
          <span className="eyebrow">COMPRE DO SEU JEITO</span>
          <h2>Escolha sua loja</h2>

          <div className="stores">
            {stores.map((store) => (
              <button
                key={store}
                className={selectedStore === store ? "store active" : "store"}
                onClick={() => setSelectedStore(store)}
              >
                <span className="store-icon">
                    ? "✨"
                    : store === "TikTok Shop"
                      ? "🎵"
                      : store === "Mercado Livre"
                        ? "🛒"
                        : store === "Shopee"
                          ? "🧡"
                          : store === "SHEIN"
                            ? "👗"
                            : store === "Magazine Luiza"
                              ? "💙"
                              : "🌸"
                </span>
                {store}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <span className="eyebrow">ENCONTRE MAIS RÁPIDO</span>
          <h2>Categorias</h2>

          <div className="categories">
            {[
              "🔥 Achadinhos",
              "🏠 Casa",
              "📱 Tecnologia",
              "👗 Moda",
              "💄 Beleza",
              "🚗 Automotivo",
              "👶 Infantil",
              "🐶 Pet",
            ].map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSearch(category.replace(/^[^ ]+ /, ""))
                }
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="ofertas">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SELEÇÃO ACHEI BRASIL</span>
              <h2>🔥 Ofertas em destaque</h2>
            </div>

            {selectedStore !== "Todas" && (
              <button
                className="clear-filter"
                onClick={() => setSelectedStore("Todas")}
              >
                Ver todas
              </button>
            )}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="offer-badge">OFERTA</span>
                </div>

                <div className="product-content">
                  <small>{product.store}</small>
                  <h3>{product.name}</h3>

                  <div className="prices">
                    <del>{product.oldPrice}</del>
                    <strong>{product.price}</strong>
                  </div>

                  <button
                    className="product-button"
                    onClick={() => openLink(product.affiliateLink || "#")}
                  >
                    VER OFERTA →
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty">
              <span>🔎</span>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente outro termo ou outra loja.</p>
            </div>
          )}
        </section>

        <section className="service-section consorcio">
          <div className="service-content">
            <span className="service-icon">🏠</span>
            <span className="eyebrow">REALIZE SEUS PLANOS</span>
            <h2>Consórcio</h2>
            <p>
              Opções para imóveis, veículos e outros projetos.
              Fale com um consultor e solicite uma simulação.
            </p>

            <button
              className="service-button"
              onClick={() => openLink("https://wa.me/")}
            >
              QUERO UMA SIMULAÇÃO →
            </button>
          </div>
        </section>

        <section className="service-section contabil">
          <div className="service-content">
            <span className="service-icon">📊</span>
            <span className="eyebrow">SERVIÇOS PROFISSIONAIS</span>
            <h2>Contabilidade</h2>
            <p>
              Atendimento para pessoa física, MEI,
              empreendedores e empresas.
            </p>

            <div className="service-list">
              <span>✓ Imposto de Renda</span>
              <span>✓ MEI</span>
              <span>✓ Empresas</span>
              <span>✓ Regularização</span>
            </div>

            <button
              className="service-button"
              onClick={() => openLink("https://wa.me/")}
            >
              SOLICITAR ATENDIMENTO →
            </button>
          </div>
        </section>

        <section className="community">
          <span className="eyebrow">FIQUE POR PERTO</span>
          <h2>📲 Entre para nossa comunidade</h2>
          <p>Receba novidades, ofertas e oportunidades.</p>

          <div className="social-grid">
            <button onClick={() => openLink("https://wa.me/")}>
              💬 WhatsApp
            </button>

            <button onClick={() => openLink("https://t.me/")}>
              ✈️ Telegram
            </button>

            <button
              onClick={() => openLink("https://instagram.com/")}
            >
              📸 Instagram
            </button>

            <button
              onClick={() => openLink("https://www.tiktok.com/")}
            >
              🎵 TikTok
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">🔎 ACHEI BRASIL</div>
        <p>Ofertas • Serviços • Oportunidades</p>
        <small>© 2026 Achei Brasil</small>
      </footer>
    </div>
  );
}

export default App;
