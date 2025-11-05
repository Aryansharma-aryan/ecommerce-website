// products.js - renders product grid and handles filters/sort/search
(async function () {
  const products = await fetchProducts();
  let state = {
    items: products.slice(),
    q: "",
    category: "all",
    maxPrice: Infinity,
    sort: "default",
  };

  const el = document.getElementById("products");
  const catSel = document.getElementById("categoryFilter");
  const search = document.getElementById("search");
  const sort = document.getElementById("sortSelect");
  const priceMax = document.getElementById("priceMax");

  // Initialize categories
  const cats = [...new Set(products.map((p) => p.category))];
  catSel.innerHTML =
    '<option value="all">All categories</option>' +
    cats.map((c) => `<option>${c}</option>`).join("");

  function render() {
    let list = products.filter((p) => {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (p.price > state.maxPrice) return false;
      if (state.q && !p.name.toLowerCase().includes(state.q.toLowerCase()))
        return false;
      return true;
    });

    // Sorting
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (state.sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    // Render cards
    el.innerHTML = list
      .map(
        (p) => `
        <article class="card product-card" data-id="${p.id}">
          <div class="thumb" style="background:#fff;position:relative;overflow:hidden;border-radius:10px;">
            <img src="${p.image}" alt="${p.name}" 
              style="width:100%;height:180px;object-fit:cover;border-radius:10px;transition:transform 0.3s;">
            ${
              p.stock <= 0
                ? '<span class="badge" style="position:absolute;top:8px;left:8px;background:#ef4444;color:#fff;padding:2px 6px;border-radius:4px;font-size:12px;">Out of Stock</span>'
                : ""
            }
          </div>
          <div style="margin-top:0.5rem">
            <strong>${p.name}</strong>
            <div class="meta">${p.category}</div>
            <div class="price" style="font-weight:600;color:#16a34a;">₹${p.price.toLocaleString()}</div>
          </div>
          <div class="row" style="margin-top:0.6rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn add" data-id="${p.id}" ${
              p.stock <= 0 ? "disabled" : ""
            }>🛒 Add</button>
            <a class="btn" href="product.html?id=${p.id}">Details</a>
            <button class="btn wish" data-id="${p.id}">♡</button>
          </div>
        </article>
      `
      )
      .join("");

    // Add hover zoom
    document.querySelectorAll(".thumb img").forEach((img) => {
      img.addEventListener("mouseover", () => (img.style.transform = "scale(1.05)"));
      img.addEventListener("mouseout", () => (img.style.transform = "scale(1)"));
    });

    // Attach events
    document.querySelectorAll(".add").forEach(
      (b) => (b.onclick = (e) => addToCart(Number(e.target.dataset.id)))
    );
    document.querySelectorAll(".wish").forEach(
      (b) => (b.onclick = (e) => toggleWish(Number(e.target.dataset.id)))
    );
  }

  // Add to cart
  function addToCart(id) {
    const p = products.find((x) => x.id === id);
    if (p.stock <= 0) {
      showAlert("❌ Product is out of stock", "error");
      return;
    }
    const c = Store.getCart();
    if (!c[id]) c[id] = { id: id, qty: 0 };
    c[id].qty += 1;
    Store.saveCart(c);
    updateGlobalCounts();
    showAlert("✅ Added to cart!", "success");
  }

  // Add/remove wishlist
  function toggleWish(id) {
    const w = Store.getWish();
    const i = w.indexOf(id);
    if (i === -1) {
      w.push(id);
      showAlert("💖 Added to wishlist!", "success");
    } else {
      w.splice(i, 1);
      showAlert("💔 Removed from wishlist", "info");
    }
    Store.saveWish(w);
    updateGlobalCounts();
  }

  // Event bindings
  search.oninput = (e) => {
    state.q = e.target.value;
    render();
  };
  catSel.onchange = (e) => {
    state.category = e.target.value;
    render();
  };
  sort.onchange = (e) => {
    state.sort = e.target.value;
    render();
  };
  priceMax.oninput = (e) => {
    state.maxPrice = e.target.value ? Number(e.target.value) : Infinity;
    render();
  };

  render();
})();
