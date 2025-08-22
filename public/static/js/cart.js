// Cart JavaScript

let cartItems = [];
let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    await loadCart();
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
            document.getElementById('login-message').classList.add('hidden');
            document.getElementById('checkout-btn').disabled = false;
            document.getElementById('user-menu').innerHTML = `
                <div class="flex items-center space-x-4">
                    <a href="/orders" class="text-gray-700 hover:text-green-600 font-medium">My Orders</a>
                    <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            `;
        } else {
            document.getElementById('login-message').classList.remove('hidden');
            document.getElementById('checkout-btn').disabled = true;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

async function loadCart() {
    try {
        const response = await fetch('/api/cart', {
            credentials: 'include'
        });
        const data = await response.json();
        
        cartItems = data.items || [];
        displayCart();
        updateSummary(data.total || 0);
        updateCartCount(data.count || 0);
    } catch (error) {
        console.error('Failed to load cart:', error);
        showNotification('Failed to load cart', 'error');
    }
}

function displayCart() {
    const container = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cartItems.length === 0) {
        container.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    
    container.innerHTML = `
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Cart Items (${cartItems.length})</h3>
            ${cartItems.map(item => createCartItemHTML(item)).join('')}
        </div>
    `;
}

function createCartItemHTML(item) {
    const imageUrl = item.image_url || `/static/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const price = item.wholesale_price || item.price || 0;
    const total = price * item.quantity;
    
    return `
        <div class="flex items-center gap-4 py-4 border-b border-gray-200">
            <img src="${imageUrl}" alt="${item.name}" class="w-20 h-20 object-cover rounded" onerror="this.src='/static/images/logo.png'">
            <div class="flex-1">
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-sm text-gray-600">SKU: ${item.sku}</p>
                ${item.unit_size ? `<p class="text-sm text-gray-600">Size: ${item.unit_size}</p>` : ''}
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity(${item.product_id}, ${item.quantity - 1})" 
                        class="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${item.quantity <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-minus text-sm"></i>
                </button>
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity(${item.product_id}, this.value)"
                       class="w-16 text-center border border-gray-300 rounded px-2 py-1">
                <button onclick="updateQuantity(${item.product_id}, ${item.quantity + 1})" 
                        class="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            </div>
            <div class="text-right">
                <p class="font-semibold">$${total.toFixed(2)}</p>
                ${item.quantity > 1 ? `<p class="text-sm text-gray-600">$${price.toFixed(2)} each</p>` : ''}
            </div>
            <button onclick="removeFromCart(${item.product_id})" 
                    class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

async function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    
    if (quantity < 0) return;
    
    try {
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadCart();
            showNotification(quantity === 0 ? 'Item removed from cart' : 'Cart updated', 'success');
        } else {
            showNotification(data.error || 'Failed to update cart', 'error');
        }
    } catch (error) {
        console.error('Failed to update cart:', error);
        showNotification('Failed to update cart', 'error');
    }
}

async function removeFromCart(productId) {
    await updateQuantity(productId, 0);
}

function updateSummary(subtotal) {
    const tax = subtotal * 0.08875; // NY State tax
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        if (count > 0) {
            cartCount.textContent = count;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

function proceedToCheckout() {
    if (!isAuthenticated) {
        window.location.href = '/login';
        return;
    }
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

async function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    const shippingAddress = `${form.shipping_address.value}, ${form.shipping_city.value}, ${form.shipping_state.value} ${form.shipping_zip.value}`;
    const billingAddress = document.getElementById('same-billing').checked ? shippingAddress : null;
    const notes = form.notes.value;
    
    try {
        const response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                shippingAddress,
                billingAddress,
                notes
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Order placed successfully!', 'success');
            closeCheckoutModal();
            
            // Clear cart and redirect to orders
            setTimeout(() => {
                window.location.href = '/orders';
            }, 2000);
        } else {
            showNotification(data.error || 'Failed to place order', 'error');
        }
    } catch (error) {
        console.error('Failed to place order:', error);
        showNotification('Failed to place order', 'error');
    }
    
    return false;
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