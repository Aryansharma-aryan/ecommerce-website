
ShopNest — Modular static e-commerce site
---------------------------------------
Files & pages:
- index.html (product listing, filters, search, sort)
- product.html?id= (product detail page)
- cart.html (manage cart, update qty, remove, checkout)
- wishlist.html (wishlist)
- checkout.html (checkout form, order placement)
- invoice.html?order=ORDERID (shows printable invoice)
- data/products.json (product data)
- css/styles.css (styling)
- js/*.js (modular javascript files: store, products, product, cart, wishlist, checkout)

Features implemented:
- Separate pages linking to each other (not everything in one file)
- Alerts and success/error messages
- Cart with quantity update, remove, clear, persisted in localStorage
- Wishlist persisted in localStorage
- Filters: category, max price, search, sort
- Checkout with validation and order persistence
- Invoice generation & printable invoice (order id based)
- Shipping rules and subtotal calculations
- Clean responsive modern CSS
