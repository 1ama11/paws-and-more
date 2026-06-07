async function loadFact() {
  try {
    const response = await fetch('https://catfact.ninja/fact');
    const data = await response.json();
    document.getElementById('pet-fact-text').textContent = data.fact;
  } catch (error) {
    document.getElementById('pet-fact-text').textContent = 'Cats sleep 12-16 hours a day! 😺';
  }
}

let products = [];

loadFact();

async function loadProducts() {
  try {
    const response = await fetch('/shop/api');
    products = await response.json();
    renderProducts(products);
    updateCartBadge();
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    // BUG 1: handle hash on initial load when already on /shop
    const hash = window.location.hash;
    if (hash === '#cart')         showView('cart-view');
    else if (hash === '#checkout') showView('checkout-view');
});

// BUG 1: handle hash changes from nav-cart click while already on /shop
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash === '#cart')         showView('cart-view');
    else if (hash === '#checkout') showView('checkout-view');
    else if (!hash)               showView('shop-view');
});

function renderProducts(productsToRender) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (productsToRender.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:var(--muted-text);padding:40px;width:100%;">No products found in this category.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const imgSrc = product.image ? `/uploads/${product.image}` : '/images/default.jpg';
        card.innerHTML = `
            <img src="${imgSrc}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn" id="btn-${product._id}" onclick="addToCart('${product._id}')">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

function filterProducts(filterType, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let filtered = [];
    if (filterType === 'all') {
        filtered = products;
    } else if (filterType === 'best-selling') {
        filtered = products.filter(p => p.isBestSeller === true);
    } else {
        const categoryMap = { dogs: 'dog', cats: 'cat', other: 'other' };
        filtered = products.filter(p => p.category === (categoryMap[filterType] || filterType));
    }
    renderProducts(filtered);
}
function addToCart(productId) {
    const product = products.find(p => p._id === productId);
    const cart = JSON.parse(localStorage.getItem('pawsCart') || '[]');

    const existing = cart.find(i => i._id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('pawsCart', JSON.stringify(cart));
    updateCartBadge();

    const btn = document.getElementById(`btn-${productId}`);
    if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Added!';
        btn.style.backgroundColor = '#c4a265';
        btn.style.color = 'white';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 1500);
    }
}

// BUG 2: updateCartBadge lives in main.js so it runs on every page.
// All calls below resolve to that global definition.

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('pawsCart') || '[]');
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem('pawsCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    const cart = JSON.parse(localStorage.getItem('pawsCart') || '[]');
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center;color:var(--muted-text);padding:40px;">Your cart is empty. 🐾</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span style="flex:1;font-weight:600;">${item.name} ${item.qty > 1 ? `<span style="color:var(--muted-text);font-weight:400;">x${item.qty}</span>` : ''}</span>
                <span style="font-weight:700;color:var(--accent-color);margin-right:16px;">$${(item.price * item.qty).toFixed(2)}</span>
                <button onclick="removeFromCart('${item._id}')"
                    style="background:none;border:1px solid #e74c3c;color:#e74c3c;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:0.82rem;"
                    onmouseover="this.style.background='#e74c3c';this.style.color='#fff';"
                    onmouseout="this.style.background='none';this.style.color='#e74c3c';"
                >Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    document.getElementById('cart-total').innerText = total.toFixed(2);
}

async function processCheckout(event) {
    event.preventDefault();

    // BUG 3: redirect to login if not authenticated
    if (!window.IS_LOGGED_IN) {
        alert('Please log in to place an order.');
        window.location.href = '/user/login';
        return;
    }

    const form     = event.target;
    const inputs   = form.querySelectorAll('input[type="text"]');
    const fullName = inputs[0].value.trim();
    const address  = inputs[1].value.trim();
    const cart     = JSON.parse(localStorage.getItem('pawsCart') || '[]');

    if (fullName.length < 2) { alert('Please enter your full name'); return; }
    if (address.length  < 5) { alert('Please enter a valid address'); return; }
    if (cart.length === 0)   { alert('Your cart is empty!'); return; }

    // BUG 5: validate card number is exactly 16 digits
    const cardInput = form.querySelector('input[name="cardNumber"]');
    if (cardInput) {
        const digits = cardInput.value.replace(/\D/g, '');
        if (digits.length !== 16) {
            alert('Card number must be exactly 16 digits.');
            cardInput.focus();
            return;
        }
    }

    const donated = document.getElementById('donate').checked;
    const total   = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + (donated ? 1 : 0);
    const btn     = event.submitter || form.querySelector('button[type="submit"]');

    try {
        const response = await fetch('/orders', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ fullName, address, items: cart, total, donated })
        });

        // BUG 3: defensive — handle session expiry during checkout
        if (response.status === 401) {
            alert('Your session expired. Please log in again.');
            window.location.href = '/user/login';
            return;
        }

        const data = await response.json();

       if (response.ok) {
    localStorage.removeItem('pawsCart');
    updateCartBadge();
    form.reset();
    showOrderPopup();
}
        else {
            alert('Failed to place order: ' + data.message);
        }

    } catch (error) {
        alert('Something went wrong. Please try again.');
    }
}

function showOrderPopup() {
    const popup = document.getElementById('order-popup');
    popup.style.display = 'flex';
}

function closeOrderPopup() {
    const popup = document.getElementById('order-popup');
    popup.style.display = 'none';
    showView('shop-view');
}