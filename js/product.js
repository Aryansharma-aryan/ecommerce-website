(async function () {
  const products = await fetchProducts();
  const q = (name) => new URLSearchParams(location.search).get(name);
  const id = Number(q("id"));
  const product = products.find((x) => x.id === id);
  const el = document.getElementById("productDetail");

  if (!product) {
    el.innerHTML = `<p>⚠️ Product not found.</p>`;
    return;
  }

  // Render product details
  el.innerHTML = `
    <div class="card product-detail">
      <div class="product-image" style="background:#fff;border-radius:10px;padding:1rem;">
        <img src="${product.image}" alt="${product.name}" class="detail-img" style="width:100%;max-width:350px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </div>

      <div class="product-info">
        <h2>${product.name}</h2>
        <div class="meta">${product.category}</div>
        <p class="desc">${product.desc}</p>

        <h3 class="price">₹${product.price.toLocaleString()}</h3>
        <p class="stock">Stock left: ${product.stock}</p>

        <div class="qty-row" style="margin-top:0.8rem">
          <label>Quantity:</label>
          <input id="qty" type="number" min="1" value="1"
            style="width:80px;padding:0.4rem;border-radius:8px;border:1px solid #ccc;text-align:center;">
        </div>

        <p id="totalPrice" style="margin-top:0.5rem;font-weight:600;">
          Total: ₹${product.price.toLocaleString()}
        </p>

        <div class="btn-row" style="margin-top:1rem;display:flex;gap:10px;flex-wrap:wrap;">
          <button id="addBtn" class="primary">🛒 Add to Cart</button>
          <button id="wishBtn" class="btn">♡ Wishlist</button>
          <button id="buyBtn" class="success">⚡ Buy Now</button>
        </div>
      </div>
    </div>
  `;

  // Handle total price change dynamically
  const qtyInput = document.getElementById("qty");
  const totalPrice = document.getElementById("totalPrice");

  qtyInput.addEventListener("input", () => {
    const qv = Math.min(Number(qtyInput.value) || 1, product.stock);
    qtyInput.value = qv;
    totalPrice.innerText = `Total: ₹${(product.price * qv).toLocaleString()}`;
  });

  // Add to Cart
  document.getElementById("addBtn").onclick = () => {
    const qv = Number(qtyInput.value) || 1;
    if (qv > product.stock) {
      showAlert("❌ Only " + product.stock + " items available.", "error");
      return;
    }

    const cart = Store.getCart();
    if (!cart[product.id]) cart[product.id] = { id: product.id, qty: 0 };
    cart[product.id].qty += qv;
    Store.saveCart(cart);
    updateGlobalCounts();
    showAlert("✅ Added to cart!", "success");
  };

  // Add to Wishlist
  document.getElementById("wishBtn").onclick = () => {
    const w = Store.getWish();
    if (!w.includes(product.id)) {
      w.push(product.id);
      Store.saveWish(w);
      updateGlobalCounts();
      showAlert("💖 Added to wishlist!", "success");
    } else {
      showAlert("Already in wishlist!", "info");
    }
  };

  // Buy Now → goes directly to checkout
  document.getElementById("buyBtn").onclick = () => {
    const qv = Number(qtyInput.value) || 1;
    if (qv > product.stock) {
      showAlert("❌ Only " + product.stock + " items available.", "error");
      return;
    }
    const tempOrder = [{ id: product.id, qty: qv }];
    localStorage.setItem("checkoutItems", JSON.stringify(tempOrder));
    location.href = "checkout.html";
  };
})();
