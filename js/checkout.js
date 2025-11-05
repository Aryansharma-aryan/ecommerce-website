(async function(){
  const products = await fetchProducts();
  const cart = Store.getCart();
  const items = Object.values(cart).map(ci=>{ const p=products.find(x=>x.id===ci.id); return {id:p.id,name:p.name,price:p.price,qty:ci.qty}; });
  const subtotal = items.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = subtotal>2000?0:99;
  const total = subtotal + shipping;
  document.getElementById('checkoutSummary').innerHTML = `<div class="card"><h3>Summary</h3><div>Items: ${items.length}</div><div>Subtotal: ${formatMoney(subtotal)}</div><div>Shipping: ${formatMoney(shipping)}</div><div><strong>Total: ${formatMoney(total)}</strong></div></div>`;
  const form = document.getElementById('checkoutForm');
  form.onsubmit = function(ev){
    ev.preventDefault();
    if(items.length===0){ showAlert('Cart is empty', 'error'); return; }
    const fd = new FormData(form);
    const order = {
      id: 'ORD' + Math.random().toString(36).substring(2,9).toUpperCase(),
      date: new Date().toISOString(),
      name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), address: fd.get('address'),
      payment: fd.get('payment'),
      items: items,
      subtotal: subtotal, shipping: shipping, total: total
    };
    Store.saveOrder(order);
    // clear cart
    Store.saveCart({});
    updateGlobalCounts();
    showAlert('Order placed successfully');
    // redirect to invoice
    setTimeout(()=> location.href = 'invoice.html?order=' + encodeURIComponent(order.id), 900);
  };
})();