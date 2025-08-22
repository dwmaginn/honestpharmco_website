// Main JavaScript file for Honest Pharm Co

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

// Update cart count
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

// Load featured products
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    try {
        const response = await fetch('/api/products?featured=true', {
            credentials: 'include'
        });
        const data = await response.json();
        
        container.innerHTML = '';
        
        if (data.products && data.products.length > 0) {
            data.products.slice(0, 3).forEach(product => {
                const productCard = createProductCard(product, data.authenticated);
                container.innerHTML += productCard;
            });
        } else {
            container.innerHTML = '<p class="text-center col-span-3 text-gray-500">No featured products available</p>';
        }
    } catch (error) {
        console.error('Failed to load featured products:', error);
        container.innerHTML = '<p class="text-center col-span-3 text-red-500">Failed to load products</p>';
    }
}

// Create product card HTML
function createProductCard(product, authenticated) {
    const imageUrl = product.image_url || `/static/images/${product.sku.toLowerCase()}.png`;
    const priceDisplay = authenticated && !product.requiresLogin
        ? `<span class="text-2xl font-bold text-green-600">$${product.wholesale_price || product.price}</span>`
        : `<button onclick="window.location.href='/login'" class="text-sm text-blue-600 hover:underline">Login for pricing</button>`;
    
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div class="aspect-w-1 aspect-h-1 bg-gray-200">
                <img src="${imageUrl}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='/static/images/logo.png'">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                ${product.strain_type ? `<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded mb-2">${product.strain_type}</span>` : ''}
                ${product.thc_percentage ? `<p class="text-sm text-gray-600 mb-2">THC: ${product.thc_percentage}%</p>` : ''}
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">${product.description || ''}</p>
                <div class="flex justify-between items-center">
                    ${priceDisplay}
                    <button onclick="addToCart(${product.id})" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add to cart function
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

// Show notification
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await updateCartCount();
    await loadFeaturedProducts();
    
    // Check auth and update UI
    const isAuthenticated = await checkAuth();
    const userMenu = document.getElementById('user-menu');
    if (userMenu && isAuthenticated) {
        userMenu.innerHTML = `
            <div class="flex items-center space-x-4">
                <a href="/orders" class="text-gray-700 hover:text-green-600 font-medium">My Orders</a>
                <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
            </div>
        `;
    }
});

// Logout function
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