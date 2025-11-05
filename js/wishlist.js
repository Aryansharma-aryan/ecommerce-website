(async function(){
  const products = await fetchProducts();
  const el = document.getElementById('wishArea');
  function render(){
    const wish = Store.getWish();
    if(wish.length===0){ el.innerHTML = '<p>Wishlist empty. <a href="index.html">Browse products</a></p>'; return; }
    el.innerHTML = wish.map(id=>{ const p=products.find(x=>x.id===id); return `<div class="card cart-row"><div style="width:64px;height:64px;background:${p.color};border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff">${p.name[0]}</div><div style="flex:1"><div>${p.name}</div><div class="meta">${formatMoney(p.price)}</div></div><div><button class="btn add" data-id="${p.id}">Add to cart</button><button class="btn remove" data-id="${p.id}">Remove</button></div></div>`; }).join('');
    document.querySelectorAll('.add').forEach(b=>b.onclick=e=>{ const id = e.target.dataset.id; const c=Store.getCart(); if(!c[id]) c[id]={id:Number(id),qty:0}; c[id].qty+=1; Store.saveCart(c); showAlert('Added to cart'); updateGlobalCounts(); });
    document.querySelectorAll('.remove').forEach(b=>{ b.onclick = e=>{ const id=Number(e.target.dataset.id); const w=Store.getWish(); const i=w.indexOf(id); if(i>-1){ w.splice(i,1); Store.saveWish(w); showAlert('Removed from wishlist'); updateGlobalCounts(); render(); } }; });
  }
  render();
})();