// store.js — shared helpers: fetch products, manage cart & wishlist, alerts, order storage
async function fetchProducts(){ const res = await fetch('data/products.json'); return res.json(); }

const Store = {
  cartKey: 'shop_cart_v1',
  wishKey: 'shop_wish_v1',
  ordersKey: 'shop_orders_v1',
  getCart(){ return JSON.parse(localStorage.getItem(this.cartKey)||'{}'); },
  saveCart(c){ localStorage.setItem(this.cartKey, JSON.stringify(c)); },
  getWish(){ return JSON.parse(localStorage.getItem(this.wishKey)||'[]'); },
  saveWish(w){ localStorage.setItem(this.wishKey, JSON.stringify(w)); },
  saveOrder(o){ const arr = JSON.parse(localStorage.getItem(this.ordersKey)||'[]'); arr.push(o); localStorage.setItem(this.ordersKey, JSON.stringify(arr)); },
  getOrders(){ return JSON.parse(localStorage.getItem(this.ordersKey)||'[]'); }
};

function showAlert(msg, type='success', timeout=2500){
  const a = document.getElementById('alert');
  if(!a) return;
  a.className = 'alert';
  if(type==='error') a.classList.add('error');
  a.textContent = msg;
  a.classList.remove('hidden');
  setTimeout(()=> a.classList.add('hidden'), timeout);
}

function formatMoney(n){ return '₹' + Number(n).toFixed(0); }

function getCartCount(){ const c = Store.getCart(); return Object.values(c).reduce((s,i)=>s+i.qty,0); }
function updateGlobalCounts(){ const el = document.getElementById('cartCount'); if(el) el.textContent = getCartCount(); const w = document.getElementById('wishCount'); if(w) w.textContent = Store.getWish().length; }
window.addEventListener('load', ()=> updateGlobalCounts());
