// Catalog JavaScript

let allProducts = [];
let isAuthenticated = false;
let filters = {
    category: null,
    strainTypes: [],
    thcRanges: [],
    search: ''
};

// Initialize catalog
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    await loadCategories();
    await loadProducts();
    setupEventListeners();
    updateCartCount();
});

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        isAuthenticated = data.authenticated;
        
        // Update UI based on auth status
        if (isAuthenticated) {
            document.getElementById('login-notice').classList.add('hidden');
            document.getElementById('user-menu').innerHTML = `
                <div class="flex items-center space-x-4">
                    <a href="/orders" class="text-gray-700 hover:text-green-600 font-medium">My Orders</a>
                    <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            `;
        } else {
            document.getElementById('login-notice').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/products/categories/all');
        const categories = await response.json();
        
        const container = document.getElementById('categories-filter');
        container.innerHTML = `
            <label class="flex items-center">
                <input type="radio" name="category" value="" checked class="category-filter mr-2">
                <span>All Categories</span>
            </label>
        `;
        
        categories.forEach(category => {
            container.innerHTML += `
                <label class="flex items-center">
                    <input type="radio" name="category" value="${category.slug}" class="category-filter mr-2">
                    <span>${category.name}</span>
                </label>
            `;
        });
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function loadProducts() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('products-grid').innerHTML = '';
    document.getElementById('no-products').classList.add('hidden');
    
    try {
        let url = '/api/products?';
        if (filters.category) url += `category=${filters.category}&`;
        if (filters.search) url += `search=${encodeURIComponent(filters.search)}&`;
        
        const response = await fetch(url, {
            credentials: 'include'
        });
        const data = await response.json();
        
        allProducts = data.products || [];
        isAuthenticated = data.authenticated;
        
        applyFilters();
    } catch (error) {
        console.error('Failed to load products:', error);
        document.getElementById('products-grid').innerHTML = '<p class="text-red-500">Failed to load products</p>';
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

function applyFilters() {
    let filteredProducts = [...allProducts];
    
    // Apply strain type filter
    if (filters.strainTypes.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
            filters.strainTypes.includes(p.strain_type)
        );
    }
    
    // Apply THC range filter
    if (filters.thcRanges.length > 0) {
        filteredProducts = filteredProducts.filter(p => {
            const thc = p.thc_percentage || 0;
            return filters.thcRanges.some(range => {
                if (range === '0-15') return thc >= 0 && thc <= 15;
                if (range === '15-20') return thc > 15 && thc <= 20;
                if (range === '20-25') return thc > 20 && thc <= 25;
                if (range === '25+') return thc > 25;
                return false;
            });
        });
    }
    
    // Apply sorting
    const sortValue = document.getElementById('sort-select').value;
    if (sortValue === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'thc') {
        filteredProducts.sort((a, b) => (b.thc_percentage || 0) - (a.thc_percentage || 0));
    } else if (sortValue === 'price' && isAuthenticated) {
        filteredProducts.sort((a, b) => (a.wholesale_price || a.price || 0) - (b.wholesale_price || b.price || 0));
    }
    
    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const container = document.getElementById('products-grid');
    
    if (products.length === 0) {
        document.getElementById('no-products').classList.remove('hidden');
        container.innerHTML = '';
        return;
    }
    
    document.getElementById('no-products').classList.add('hidden');
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const imageUrl = product.image_url || `/static/images/${product.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const priceDisplay = isAuthenticated && !product.requiresLogin
        ? `<span class="text-xl font-bold text-green-600">$${product.wholesale_price || product.price}/unit</span>`
        : `<button onclick="window.location.href='/login'" class="text-sm text-blue-600 hover:underline">Login for pricing</button>`;
    
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div class="relative">
                <img src="${imageUrl}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='/static/images/logo.png'">
                ${product.featured ? '<span class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs rounded">Featured</span>' : ''}
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <div class="flex gap-2 mb-2">
                    ${product.strain_type ? `<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">${product.strain_type}</span>` : ''}
                    ${product.thc_percentage ? `<span class="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">THC: ${product.thc_percentage}%</span>` : ''}
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${product.description || ''}</p>
                ${product.unit_size ? `<p class="text-sm text-gray-500 mb-2">Size: ${product.unit_size}</p>` : ''}
                <div class="flex justify-between items-center mt-4">
                    ${priceDisplay}
                    <div class="flex gap-2">
                        ${product.pdf_page ? `
                            <button onclick="viewProductInfo(${product.id})" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" title="More Info">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        ` : ''}
                        <button onclick="addToCart(${product.id})" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition" title="Add to Cart">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    // Search input
    document.getElementById('search-input').addEventListener('input', debounce((e) => {
        filters.search = e.target.value;
        loadProducts();
    }, 500));
    
    // Category filters
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('category-filter')) {
            filters.category = e.target.value || null;
            loadProducts();
        }
    });
    
    // Strain type filters
    document.querySelectorAll('.strain-filter').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                filters.strainTypes.push(e.target.value);
            } else {
                filters.strainTypes = filters.strainTypes.filter(t => t !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // THC filters
    document.querySelectorAll('.thc-filter').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                filters.thcRanges.push(e.target.value);
            } else {
                filters.thcRanges = filters.thcRanges.filter(r => r !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Sort select
    document.getElementById('sort-select').addEventListener('change', () => {
        applyFilters();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Product added to cart', 'success');
            updateCartCount();
        } else {
            showNotification(data.error || 'Failed to add to cart', 'error');
        }
    } catch (error) {
        console.error('Failed to add to cart:', error);
        showNotification('Failed to add to cart', 'error');
    }
}

async function updateCartCount() {
    try {
        const response = await fetch('/api/cart', {
            credentials: 'include'
        });
        const data = await response.json();
        
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            if (data.count > 0) {
                cartCount.textContent = data.count;
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Failed to update cart count:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function viewProductInfo(productId) {
    // This would open a PDF viewer or modal with product information
    // For now, just show a message
    showNotification('Product information sheet will open here', 'info');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}