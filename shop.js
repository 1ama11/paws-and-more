// Updated Product Database with Categories and Tags
const products = [
    { id: 1, name: "Premium Dog Kibble", price: 45.99, category: "dogs", isBestSeller: true, isEssential: true, img: "Premiumdogkibble.avif" },
    { id: 2, name: "Squeaky Bone Toy", price: 8.50, category: "dogs", isBestSeller: false, isEssential: false, img: "dogtoy.jpg" },
    { id: 3, name: "Luxury Cat Tree", price: 120.00, category: "cats", isBestSeller: true, isEssential: false, img: "cattree.jpg" },
    { id: 4, name: "Organic Catnip", price: 12.99, category: "cats", isBestSeller: false, isEssential: false, img: "catnip.jpg" },
    { id: 5, name: "Hamster Wheel", price: 15.00, category: "other", isBestSeller: false, isEssential: true, img: "hamsterwheel.jpeg" },
    { id: 6, name: "Bird Seed Mix", price: 10.50, category: "other", isBestSeller: true, isEssential: true, img: "birdseed.jpeg" },
    { id: 7, name: "Cat Litter Box", price: 25.00, category: "cats", isBestSeller: true, isEssential: true, img: "catlitter.jpeg" },
    { id: 8, name: "Dog Leash & Collar", price: 18.99, category: "dogs", isBestSeller: false, isEssential: true, img: "dogleash.jpeg" }
];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartBadge();
});

// Function to render the given list of products
function renderProducts(productsToRender) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    if (productsToRender.length === 0) {
        grid.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:var(--space-xl);width:100%;">No products found in this category.</p>`;
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="primary-btn" id="btn-${product.id}" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

// Filter products when a category button is clicked
function filterProducts(filterType) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    let filtered = [];

    if (filterType === 'all') {
        filtered = products;
    } else if (filterType === 'best-selling') {
        filtered = products.filter(p => p.isBestSeller === true);
    } else if (filterType === 'essentials') {
        filtered = products.filter(p => p.isEssential === true);
    } else {
        filtered = products.filter(p => p.category === filterType);
    }

    renderProducts(filtered);
}

// Switch between Shop, Cart, and Checkout views
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    const activeView = document.getElementById(viewId);
    activeView.classList.remove('hidden');
    activeView.classList.add('active');

    if (viewId === 'cart-view') {
        renderCart();
    }
}

// Add item to cart using localStorage
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('pawsCart') || '[]');

    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('pawsCart', JSON.stringify(cart));
    updateCartBadge();

    // Inline button feedback
    const btn = document.getElementById(`btn-${productId}`);
    if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Added!';
        btn.style.backgroundColor = 'var(--success)';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 1500);
    }
}

// Update the cart badge
function updateCartBadge() {
    const cart  = JSON.parse(localStorage.getItem('pawsCart') || '[]');
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('nav-cart-count');
    if (badge) {
        badge.textContent   = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Remove a single item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('pawsCart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('pawsCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// Display items in the cart view
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    const cart = JSON.parse(localStorage.getItem('pawsCart') || '[]');
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:var(--space-xl);">Your cart is empty. 🐾</p>`;
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <span style="flex:1;font-weight:600;">${item.name} ${item.qty > 1 ? `<span style="color:var(--text-muted);font-weight:400;">x${item.qty}</span>` : ''}</span>
                <span style="font-weight:700;color:var(--accent);margin-right:16px;">$${(item.price * item.qty).toFixed(2)}</span>
                <button 
                    onclick="removeFromCart(${item.id})"
                    style="background:none;border:1px solid #e74c3c;color:#e74c3c;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:0.82rem;transition:all 0.2s;"
                    onmouseover="this.style.background='#e74c3c';this.style.color='#fff';"
                    onmouseout="this.style.background='none';this.style.color='#e74c3c';"
                >Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    document.getElementById("cart-total").innerText = total.toFixed(2);
}

// Handle final checkout submission
function processCheckout(event) {
    event.preventDefault();

    const donate = document.getElementById('donate').checked;
    const btn    = event.submitter || event.target.querySelector('button[type="submit"]');

    localStorage.removeItem('pawsCart');
    updateCartBadge();
    event.target.reset();

    if (btn) {
        btn.textContent = donate
            ? '✓ Order placed! Thanks for your donation 🐾'
            : '✓ Order placed! Thank you!';
        btn.style.backgroundColor = 'var(--success)';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Place Order';
            btn.style.backgroundColor = '';
            btn.disabled = false;
            showView('shop-view');
        }, 2500);
    } else {
        showView('shop-view');
    }
}