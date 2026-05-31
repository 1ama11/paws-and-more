// Runs on every page that includes this file via the footer partial.

function updateCartBadge() {
    const cart  = JSON.parse(localStorage.getItem('pawsCart') || '[]');
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('nav-cart-count');
    if (badge) {
        badge.textContent   = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
