const products = [
  {
    id: "chain-star-tee",
    name: "\"BLIN BLIN\" V1",
    category: "tee",
    price: 28990,
    tagline: "front + back print / fit amplio",
    description:
      "Remera blanca de peso medio con grafica chain-star al frente y branding ACRUXS en espalda.",
    images: [
      "assets/producto1acru1.webp",
      "assets/prducto1acru2.webp"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "script-tank",
    name: "Tank tops ACRUXS",
    category: "tee",
    price: 21990,
    tagline: "tank fit / color black-pink",
    description:
      "Musculosa Script en dos variantes. Pieza liviana para layering street con identidad de marca.",
    images: [
      "assets/producto2acru1.webp",
      "assets/producto2acru2.webp"
    ],
    sizes: ["S", "M", "L"]
  },
  {
    id: "pink-hoodie",
    name: "PIXEL NOVA",
    category: "hoodie",
    price: 54990,
    tagline: "oversized / graphic back",
    description:
      "Hoodie rosa oversized con logo frontal minimal y grafica ACRUXS en espalda.",
    images: [
      "assets/producto3acru1.webp"
    ],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "nothuman-zip",
    name: "SHOOTING STAR",
    category: "outerwear",
    price: 59990,
    tagline: "zip hoodie / bold typography",
    description:
      "Zip hoodie NotHuman en rojo con tipografia frontal de alto impacto y look editorial.",
    images: [
      "assets/producto4acru1.webp",
      "assets/producto4acru2.webp"
    ],
    sizes: ["M", "L"]
  },
  {
    id: "script-tote",
    name: "NotHuman",
    category: "accessory",
    price: 16990,
    tagline: "canvas bag / logo script",
    description:
      "Tote roja con logo script para completar el fit o usar como pieza de marca.",
    images: [
      "assets/Producto5acru1.webp",
      "assets/producto5acru2.webp"
    ],
    sizes: ["U"]
  }
];

const productsGrid = document.getElementById("productsGrid");
const chips = [...document.querySelectorAll(".chip")];
const productModal = document.getElementById("productModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalMainImage = document.getElementById("modalMainImage");
const modalThumbs = document.getElementById("modalThumbs");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalSizes = document.getElementById("modalSizes");
const addCartBtn = document.getElementById("addCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");
const headerCart = document.getElementById("headerCart");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
const cartDrawerClose = document.getElementById("cartDrawerClose");
const cartDrawerItems = document.getElementById("cartDrawerItems");
const cartDrawerTotal = document.getElementById("cartDrawerTotal");

const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDotsWrap = document.getElementById("heroDots");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
const heroCarousel = document.getElementById("heroCarousel");

let selectedFilter = "all";
let activeProduct = null;
let activeSize = null;
let cartItems = 0;
let cartEntries = [];
let activeHeroIndex = 0;
let heroInterval = null;

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value);
}

function renderProducts(filter = "all") {
  selectedFilter = filter;
  const filtered = filter === "all" ? products : products.filter((product) => product.category === filter);

  if (!filtered.length) {
    productsGrid.innerHTML = "<p>No hay productos en este filtro.</p>";
    return;
  }

  productsGrid.innerHTML = filtered
    .map((product) => {
      const thumbs = product.images
        .map(
          (src, index) => `
            <span class="card-thumb" aria-hidden="true">
              <img src="${src}" alt="Miniatura ${product.name} ${index + 1}" loading="lazy" />
            </span>
          `
        )
        .join("");

      return `
        <article class="product-card" data-product-id="${product.id}" role="button" tabindex="0" aria-label="Abrir detalle de ${product.name}">
          <div class="product-media">
            <img class="product-main-image" src="${product.images[0]}" alt="${product.name}" loading="lazy" data-selected="${product.images[0]}" data-hover="${product.images[1] || product.images[0]}" />
            <span class="gallery-hint">${product.images.length} fotos</span>
          </div>
          <div class="product-body">
            <p class="product-title">${product.name}</p>
            <p class="product-meta">${product.tagline}</p>
            <p class="product-price">${formatCLP(product.price)}</p>
            <div class="card-thumbs">${thumbs}</div>
            <p class="card-cta">Agregar al carrito</p>
          </div>
        </article>
      `;
    })
    .join("");

  attachCardInteractions();
}

function attachCardInteractions() {
  const cards = [...productsGrid.querySelectorAll(".product-card")];

  cards.forEach((card) => {
    const image = card.querySelector(".product-main-image");
    const productId = card.dataset.productId;

    card.addEventListener("mouseenter", () => {
      const selected = image.dataset.selected;
      const hover = image.dataset.hover;
      if (hover && hover !== selected) image.src = hover;
    });

    card.addEventListener("mouseleave", () => {
      image.src = image.dataset.selected;
    });

    card.addEventListener("click", () => {
      openProduct(productId);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProduct(productId);
      }
    });
  });
}

function renderModalThumbs(images) {
  modalThumbs.innerHTML = images
    .map(
      (src, index) => `
      <button class="modal-thumb ${index === 0 ? "active" : ""}" type="button" data-index="${index}">
        <img src="${src}" alt="Vista ${index + 1}" />
      </button>
    `
    )
    .join("");

  [...modalThumbs.querySelectorAll(".modal-thumb")].forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = Number(thumb.dataset.index);
      modalMainImage.src = images[index];
      [...modalThumbs.querySelectorAll(".modal-thumb")].forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

function renderModalSizes(sizes) {
  activeSize = null;
  addCartBtn.textContent = "Agregar al carrito";
  buyNowBtn.textContent = "Comprar ahora";

  modalSizes.innerHTML = sizes
    .map((size) => `<button class="size-btn" type="button" data-size="${size}">${size}</button>`)
    .join("");

  [...modalSizes.querySelectorAll(".size-btn")].forEach((button) => {
    button.addEventListener("click", () => {
      activeSize = button.dataset.size;
      [...modalSizes.querySelectorAll(".size-btn")].forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      addCartBtn.textContent = `Agregar al carrito - talle ${activeSize}`;
      buyNowBtn.textContent = `Comprar ahora - talle ${activeSize}`;
    });
  });
}

function openProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  activeProduct = product;
  modalName.textContent = product.name;
  modalPrice.textContent = formatCLP(product.price);
  modalDescription.textContent = product.description;
  modalMainImage.src = product.images[0];

  renderModalThumbs(product.images);
  renderModalSizes(product.sizes);

  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProduct() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderCartDrawer() {
  if (!cartEntries.length) {
    cartDrawerItems.innerHTML = '<p class="cart-empty">Tu carrito esta vacio.</p>';
    cartDrawerTotal.textContent = formatCLP(0);
    return;
  }

  cartDrawerItems.innerHTML = cartEntries
    .map(
      (item) => `
      <article class="cart-row">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <p class="name">${item.name}</p>
          <p class="meta">Talle ${item.size}</p>
        </div>
        <p class="price">${formatCLP(item.price)}</p>
      </article>
    `
    )
    .join("");

  const total = cartEntries.reduce((sum, item) => sum + item.price, 0);
  cartDrawerTotal.textContent = formatCLP(total);
}

function openCartDrawer() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawerOverlay.hidden = false;
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawerOverlay.hidden = true;
}

function addToCart(product, size) {
  cartEntries.push({
    id: product.id,
    name: product.name,
    size,
    price: product.price,
    image: product.images[0]
  });

  cartItems += 1;
  cartCount.textContent = String(cartItems);
  renderCartDrawer();
}

function renderHeroDots() {
  heroDotsWrap.innerHTML = heroSlides
    .map((_, index) => `<button class="hero-dot ${index === 0 ? "active" : ""}" type="button" data-index="${index}" aria-label="Ir a slide ${index + 1}"></button>`)
    .join("");

  [...heroDotsWrap.querySelectorAll(".hero-dot")].forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);
      setHeroSlide(index);
      restartHeroAuto();
    });
  });
}

function setHeroSlide(index) {
  activeHeroIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeHeroIndex);
  });

  [...heroDotsWrap.querySelectorAll(".hero-dot")].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeHeroIndex);
  });
}

function restartHeroAuto() {
  if (heroInterval) clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    setHeroSlide(activeHeroIndex + 1);
  }, 4800);
}

function initHeroCarousel() {
  renderHeroDots();

  heroPrev.addEventListener("click", () => {
    setHeroSlide(activeHeroIndex - 1);
    restartHeroAuto();
  });

  heroNext.addEventListener("click", () => {
    setHeroSlide(activeHeroIndex + 1);
    restartHeroAuto();
  });

  heroCarousel.addEventListener("mouseenter", () => {
    if (heroInterval) clearInterval(heroInterval);
  });

  heroCarousel.addEventListener("mouseleave", restartHeroAuto);
  restartHeroAuto();
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    renderProducts(chip.dataset.filter);
  });
});

buyNowBtn.addEventListener("click", () => {
  if (!activeProduct) return;

  if (!activeSize) {
    buyNowBtn.textContent = "Elegi talle para continuar";
    return;
  }

  addToCart(activeProduct, activeSize);
  buyNowBtn.textContent = "Agregado al carrito";
  addCartBtn.textContent = "Agregado al carrito";

  setTimeout(() => {
    closeProduct();
  }, 560);
});

addCartBtn.addEventListener("click", () => {
  if (!activeProduct) return;

  if (!activeSize) {
    addCartBtn.textContent = "Elegi talle para agregar";
    return;
  }

  addToCart(activeProduct, activeSize);
  addCartBtn.textContent = "Agregado al carrito";
});

headerCart.addEventListener("click", () => {
  openCartDrawer();
});

cartDrawerClose.addEventListener("click", () => {
  closeCartDrawer();
});

cartDrawerOverlay.addEventListener("click", () => {
  closeCartDrawer();
});

modalOverlay.addEventListener("click", closeProduct);
modalClose.addEventListener("click", closeProduct);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProduct();
    closeCartDrawer();
  }
});

renderProducts(selectedFilter);
initHeroCarousel();
renderCartDrawer();
