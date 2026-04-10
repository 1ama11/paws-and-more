// Updated Product Database with Categories and Tags
const products = [
    { id: 1, name: "Premium Dog Kibble", price: 45.99, category: "dogs", isBestSeller: true, isEssential: true, img: "[Premiumdogkibble.avif]" },
    { id: 2, name: "Squeaky Bone Toy", price: 8.50, category: "dogs", isBestSeller: false, isEssential: false, img: "[dogtoy.jpg]" },
    { id: 3, name: "Luxury Cat Tree", price: 120.00, category: "cats", isBestSeller: true, isEssential: false, img: "cattree.jpg" },
    { id: 4, name: "Organic Catnip", price: 12.99, category: "cats", isBestSeller: false, isEssential: false, img: "catnip.jpg" },
    { id: 5, name: "Hamster Wheel", price: 15.00, category: "other", isBestSeller: false, isEssential: true, img: "https://via.placeholder.com/150/beb692/070706?text=Hamster+Wheel" },
    { id: 6, name: "Bird Seed Mix", price: 10.50, category: "other", isBestSeller: true, isEssential: true, img: "whatsApp image 2026-04-09 at 3.19.17 PM.jpeg" },
    { id: 7, name: "Cat Litter Box", price: 25.00, category: "cats", isBestSeller: true, isEssential: true, img: "https://via.placeholder.com/150/d8cfb0/070706?text=Litter+Box" },
    { id: 8, name: "Dog Leash & Collar", price: 18.99, category: "dogs", isBestSeller: false, isEssential: true, img: "https://via.placeholder.com/150/f8f5e8/070706?text=Dog+Leash" }
];

// State variables
let cart = [];

// Initialize Page: Render ALL products when the page first loads
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products); 
});

// Function to render the given list of products
function renderProducts(productsToRender) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = ""; // Clear existing

    if (productsToRender.length === 0) {
        grid.innerHTML = "<p>No products found in this category.</p>";
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="primary-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

// NEW FUNCTION: Filter products when a category button is clicked
function filterProducts(filterType) {
    // 1. Highlight the button that was clicked
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 2. Filter the array based on what the user wants
    let filtered = [];

    if (filterType === 'all') {
        filtered = products;
    } else if (filterType === 'best-selling') {
        filtered = products.filter(p => p.isBestSeller === true);
    } else if (filterType === 'essentials') {
        filtered = products.filter(p => p.isEssential === true);
    } else {
        // This handles 'cats', 'dogs', and 'other'
        filtered = products.filter(p => p.category === filterType);
    }

    // 3. Render the newly filtered list
    renderProducts(filtered);
}

// Function to switch between Shop, Cart, and Checkout
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

// Function to add items to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    
    document.getElementById("cart-count").innerText = cart.length;
    alert(`${product.name} added to cart!`);
}

// Function to display items in the cart view
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = ""; 
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    document.getElementById("cart-total").innerText = total.toFixed(2);
}

// Function to handle the final checkout submission
function processCheckout(event) {
    event.preventDefault(); 
    
    const donate = document.getElementById('donate').checked;
    let finalMessage = "Thank you for your order!";
    
    if (donate) {
        finalMessage += " And thank you so much for your $1 donation to our adoption center! 🐾";
    }

    alert(finalMessage);
    
    cart = [];
    document.getElementById("cart-count").innerText = 0;
    event.target.reset(); 
    showView('shop-view');
}