// Premium Cannabis Website JavaScript

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Update cart count on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadFeaturedProducts();
    initializeAnimations();
    initializeVideoControls();
});

// Update cart count display
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

// Load featured products with premium styling
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    try {
        const response = await fetch('/api/products?featured=true&limit=6');
        const products = await response.json();

        if (products.length === 0) {
            // Display sample products if database is empty
            const sampleProducts = [
                {
                    id: 1,
                    name: 'Purple Haze',
                    strain_type: 'Sativa Dominant',
                    thc_content: 22.5,
                    price: 280,
                    image: '/static/images/product1.jpg',
                    badge: 'Premium'
                },
                {
                    id: 2,
                    name: 'OG Kush',
                    strain_type: 'Indica',
                    thc_content: 24.0,
                    price: 300,
                    image: '/static/images/product2.jpg',
                    badge: 'Top Shelf'
                },
                {
                    id: 3,
                    name: 'Blue Dream',
                    strain_type: 'Hybrid',
                    thc_content: 21.0,
                    price: 260,
                    image: '/static/images/product3.jpg',
                    badge: 'Best Seller'
                }
            ];

            displayProducts(sampleProducts, container);
        } else {
            displayProducts(products, container);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Display sample products on error
        displaySampleProducts(container);
    }
}

// Display products with premium card design
function displayProducts(products, container) {
    container.innerHTML = products.map(product => `
        <div class="product-card hover-lift" data-aos="fade-up" data-aos-delay="${products.indexOf(product) * 100}">
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
                    <button class="btn-view-details" onclick="viewProduct(${product.id})">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display sample products
function displaySampleProducts(container) {
    const sampleHTML = `
        <div class="product-card hover-lift">
            <div class="product-image">
                <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <i class="fas fa-cannabis text-6xl text-gray-700"></i>
                </div>
                <span class="product-badge">Premium</span>
            </div>
            <div class="product-content">
                <div class="product-strain">Sativa Dominant</div>
                <h3 class="product-name">Purple Haze</h3>
                <div class="product-details">
                    <div class="thc-content">
                        <span class="thc-label">THC</span>
                        <span class="thc-value">22.5%</span>
                    </div>
                    <div class="product-price">
                        <div class="price-label">per oz</div>
                        <div class="price-value">$280</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="showToast('Please login to add items to cart')">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                    <button class="btn-view-details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="product-card hover-lift">
            <div class="product-image">
                <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <i class="fas fa-cannabis text-6xl text-gray-700"></i>
                </div>
                <span class="product-badge">Top Shelf</span>
            </div>
            <div class="product-content">
                <div class="product-strain">Indica</div>
                <h3 class="product-name">OG Kush</h3>
                <div class="product-details">
                    <div class="thc-content">
                        <span class="thc-label">THC</span>
                        <span class="thc-value">24.0%</span>
                    </div>
                    <div class="product-price">
                        <div class="price-label">per oz</div>
                        <div class="price-value">$300</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="showToast('Please login to add items to cart')">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                    <button class="btn-view-details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="product-card hover-lift">
            <div class="product-image">
                <div class="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <i class="fas fa-cannabis text-6xl text-gray-700"></i>
                </div>
                <span class="product-badge">Best Seller</span>
            </div>
            <div class="product-content">
                <div class="product-strain">Hybrid</div>
                <h3 class="product-name">Blue Dream</h3>
                <div class="product-details">
                    <div class="thc-content">
                        <span class="thc-label">THC</span>
                        <span class="thc-value">21.0%</span>
                    </div>
                    <div class="product-price">
                        <div class="price-label">per oz</div>
                        <div class="price-value">$260</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="showToast('Please login to add items to cart')">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                    <button class="btn-view-details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = sampleHTML;
}

// Add to cart function
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

// View product details
function viewProduct(productId) {
    window.location.href = `/catalog#product-${productId}`;
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

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe all elements with animation classes
    document.querySelectorAll('.hover-lift, .product-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize video controls
function initializeVideoControls() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Ensure video plays on mobile
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        
        // Retry play if it fails
        const playVideo = () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Auto-play was prevented, try muted play
                    video.muted = true;
                    video.play();
                });
            }
        };
        
        // Try to play on various events
        ['loadeddata', 'canplay'].forEach(event => {
            video.addEventListener(event, playVideo);
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-section');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.backgroundPositionY = `${scrolled * speed}px`;
    });
});

// Premium hover effects
document.querySelectorAll('.premium-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
    });
});

// Initialize on page load
window.addEventListener('load', () => {
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
    
    // Initialize any third-party libraries
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
});