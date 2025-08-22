// Premium Catalog JavaScript

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

// Load products
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        if (products.length === 0) {
            displaySampleProducts(grid);
        } else {
            displayProducts(products, grid);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displaySampleProducts(grid);
    }
}

// Display products
function displayProducts(products, container) {
    container.innerHTML = products.map(product => `
        <div class="product-card hover-lift">
            <div class="product-image">
                <img src="${product.image || '/static/images/product-placeholder.jpg'}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <div class="product-strain">${product.strain_type || 'Hybrid'}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-details">
                    <div class="thc-content">
                        <span class="thc-label">THC</span>
                        <span class="thc-value">${product.thc_content || '20.0'}%</span>
                    </div>
                    <div class="product-price">
                        <div class="price-label">per oz</div>
                        <div class="price-value">$${product.price || '250'}</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                    <button class="btn-view-details" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display sample products
function displaySampleProducts(container) {
    const sampleProducts = [
        { id: 1, name: 'Purple Haze', strain_type: 'Sativa Dominant', thc_content: 22.5, price: 280, badge: 'Premium' },
        { id: 2, name: 'OG Kush', strain_type: 'Indica', thc_content: 24.0, price: 300, badge: 'Top Shelf' },
        { id: 3, name: 'Blue Dream', strain_type: 'Hybrid', thc_content: 21.0, price: 260, badge: 'Best Seller' },
        { id: 4, name: 'Girl Scout Cookies', strain_type: 'Hybrid', thc_content: 23.0, price: 290, badge: 'Popular' },
        { id: 5, name: 'Sour Diesel', strain_type: 'Sativa', thc_content: 22.0, price: 270, badge: 'Classic' },
        { id: 6, name: 'Gorilla Glue #4', strain_type: 'Hybrid', thc_content: 25.0, price: 320, badge: 'Potent' },
        { id: 7, name: 'Wedding Cake', strain_type: 'Indica Dominant', thc_content: 24.5, price: 310, badge: 'Premium' },
        { id: 8, name: 'Jack Herer', strain_type: 'Sativa', thc_content: 20.5, price: 250, badge: 'Award Winner' },
        { id: 9, name: 'Gelato', strain_type: 'Hybrid', thc_content: 23.5, price: 295, badge: 'Exotic' }
    ];

    container.innerHTML = sampleProducts.map(product => `
        <div class="product-card hover-lift">
            <div class="product-image">
                <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <i class="fas fa-cannabis text-6xl text-gray-700"></i>
                </div>
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-content">
                <div class="product-strain">${product.strain_type}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-details">
                    <div class="thc-content">
                        <span class="thc-label">THC</span>
                        <span class="thc-value">${product.thc_content}%</span>
                    </div>
                    <div class="product-price">
                        <div class="price-label">per oz</div>
                        <div class="price-value">$${product.price}</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                    <button class="btn-view-details" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${productName} added to cart`);
}

// Show product details
function showProductDetails(productId) {
    // Placeholder for product details modal
    showToast('Product details coming soon');
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-yellow-500 mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Search functionality
document.getElementById('search-input')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const name = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const strain = product.querySelector('.product-strain')?.textContent.toLowerCase() || '';
        
        if (name.includes(searchTerm) || strain.includes(searchTerm)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
});

// Sort functionality
document.getElementById('sort-select')?.addEventListener('change', function(e) {
    const sortBy = e.target.value;
    const grid = document.getElementById('products-grid');
    const products = Array.from(grid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return parseFloat(a.querySelector('.price-value').textContent.replace('$', '')) - 
                       parseFloat(b.querySelector('.price-value').textContent.replace('$', ''));
            case 'price-high':
                return parseFloat(b.querySelector('.price-value').textContent.replace('$', '')) - 
                       parseFloat(a.querySelector('.price-value').textContent.replace('$', ''));
            case 'thc-high':
                return parseFloat(b.querySelector('.thc-value').textContent.replace('%', '')) - 
                       parseFloat(a.querySelector('.thc-value').textContent.replace('%', ''));
            case 'name':
                return a.querySelector('.product-name').textContent.localeCompare(
                       b.querySelector('.product-name').textContent);
            default:
                return 0;
        }
    });
    
    grid.innerHTML = '';
    products.forEach(product => grid.appendChild(product));
});

// Initialize on load
document.addEventListener('DOMContentLoaded', loadProducts);