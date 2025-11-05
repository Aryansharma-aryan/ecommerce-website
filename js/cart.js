(async function(){
  const products = await fetchProducts();
  const cartArea = document.getElementById('cartArea');
  const cartSummary = document.getElementById('cartSummary');

  function render(){
    const cart = Store.getCart();
    const items = Object.values(cart).map(ci => {
      const p = products.find(x => x.id === ci.id);
      return {...p, qty: ci.qty};
    });

    if(items.length === 0){
      cartArea.innerHTML = `
        <p>Your cart is empty. 
        <a href="index.html" class="primary">Continue shopping</a></p>`;
      cartSummary.classList.add('hidden');
      return;
    }

    cartArea.innerHTML = items.map(it => `
      <div class="cart-row card">

        <div class="cart-img-box">
          <img src="${it.image}" alt="${it.name}" class="cart-img"/>
        </div>

        <div style="flex:1">
          <div><strong>${it.name}</strong></div>

          <div class="row" style="margin-top:0.4rem">
            <div class="qty">
              <button class="dec" data-id="${it.id}">-</button>
              <div>${it.qty}</div>
              <button class="inc" data-id="${it.id}">+</button>
            </div>

            <div style="margin-left:1rem">
              <button class="btn remove" data-id="${it.id}">Remove</button>
            </div>
          </div>
        </div>

        <div style="min-width:120px;text-align:right">
          ${formatMoney(it.price)}
          <div class="meta">${formatMoney(it.price * it.qty)}</div>
        </div>

      </div>
    `).join('');

    document.querySelectorAll('.inc').forEach(b => b.onclick = e => changeQty(e.target.dataset.id, 1));
    document.querySelectorAll('.dec').forEach(b => b.onclick = e => changeQty(e.target.dataset.id, -1));
    document.querySelectorAll('.remove').forEach(b => b.onclick = e => removeItem(e.target.dataset.id));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 2000 ? 0 : 99;
    const total = subtotal + shipping;

    cartSummary.classList.remove('hidden');
    cartSummary.innerHTML = `
      <div class="card">
        <h3>Order Summary</h3>
        <div>Items: ${items.length}</div>
        <div>Subtotal: ${formatMoney(subtotal)}</div>
        <div>Shipping: ${formatMoney(shipping)}</div>
        <div><strong>Total: ${formatMoney(total)}</strong></div>
        <div style="margin-top:0.6rem">
          <a class="primary" href="checkout.html">Proceed to checkout</a>
          <button id="clearCart" class="btn">Clear cart</button>
        </div>
      </div>
    `;

    document.getElementById('clearCart').onclick = () => {
      Store.saveCart({});
      render(); updateGlobalCounts();
      showAlert('Cart cleared');
    };
  }

  function changeQty(id, delta){
    const c = Store.getCart();
    if(!c[id]) return;
    c[id].qty += delta;
    if(c[id].qty <= 0) delete c[id];
    Store.saveCart(c);
    render(); updateGlobalCounts();
  }

  function removeItem(id){
    const c = Store.getCart();
    delete c[id];
    Store.saveCart(c);
    render(); updateGlobalCounts();
    showAlert('Item removed');
  }

  render();
})();
