export async function renderCatalogPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Catalog - Honest Pharm Co.</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
    <link href="/static/css/premium.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }
        .font-bebas {
            font-family: 'Bebas Neue', cursive;
        }
        .gold-gradient {
            background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .glass-effect {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
            background: #4a5568;
            border-radius: 4px;
        }
    </style>
</head>
<body class="bg-black text-white">
    <!-- Premium Navigation -->
    <nav class="fixed w-full top-0 z-50 glass-effect bg-black/90 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center">
                    <img src="/static/images/logo.png" alt="Honest Pharm Co" class="h-14 w-auto">
                    <div class="ml-4">
                        <span class="text-2xl font-bebas tracking-wider gold-gradient">HONEST PHARM CO.</span>
                        <div class="text-xs text-gray-400 font-light tracking-widest">PREMIUM CANNABIS CULTIVATOR</div>
                    </div>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-gray-300 hover:text-white font-medium tracking-wide transition-colors">HOME</a>
                    <a href="/catalog" class="text-yellow-500 font-semibold tracking-wide">CATALOG</a>
                    <a href="#locations" class="text-gray-300 hover:text-white font-medium tracking-wide transition-colors">LOCATIONS</a>
                    <a href="/cart" class="text-gray-300 hover:text-white font-medium relative transition-colors">
                        <i class="fas fa-shopping-cart text-lg"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hidden">0</span>
                    </a>
                    <div id="user-menu">
                        <a href="/login" class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2.5 rounded-full font-semibold tracking-wide hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-500/30">
                            <i class="fas fa-user mr-2"></i>LOGIN
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Banner -->
    <div class="pt-20 bg-gradient-to-b from-gray-900 to-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center">
                <span class="text-yellow-500 text-sm font-semibold tracking-widest">PREMIUM SELECTION</span>
                <h1 class="text-5xl font-bebas mt-4 mb-4">
                    PRODUCT <span class="gold-gradient">CATALOG</span>
                </h1>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    Explore our curated collection of premium cannabis strains, each cultivated with precision in our state-of-the-art greenhouse facility
                </p>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex gap-8">
            <!-- Premium Sidebar Filters -->
            <aside class="w-72 flex-shrink-0">
                <div class="glass-effect rounded-xl p-6 sticky top-24">
                    <h3 class="text-lg font-bold mb-6 flex items-center">
                        <i class="fas fa-filter text-yellow-500 mr-3"></i>
                        FILTERS
                    </h3>
                    
                    <div class="mb-8">
                        <h4 class="font-semibold mb-4 text-gray-300">CATEGORIES</h4>
                        <div id="categories-filter" class="space-y-3">
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="flower">
                                <span>Premium Flower</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="preroll">
                                <span>Pre-Rolls</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="concentrate">
                                <span>Concentrates</span>
                            </label>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-semibold mb-4 text-gray-300">STRAIN TYPE</h4>
                        <div class="space-y-3">
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="radio" name="strain" class="mr-3 accent-yellow-500" value="all" checked>
                                <span>All Strains</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="radio" name="strain" class="mr-3 accent-yellow-500" value="sativa">
                                <span>Sativa</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="radio" name="strain" class="mr-3 accent-yellow-500" value="indica">
                                <span>Indica</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="radio" name="strain" class="mr-3 accent-yellow-500" value="hybrid">
                                <span>Hybrid</span>
                            </label>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-semibold mb-4 text-gray-300">THC CONTENT</h4>
                        <div class="space-y-3">
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="low">
                                <span>&lt; 15% THC</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="medium">
                                <span>15-20% THC</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="high">
                                <span>20-25% THC</span>
                            </label>
                            <label class="flex items-center cursor-pointer hover:text-yellow-500 transition-colors">
                                <input type="checkbox" class="mr-3 accent-yellow-500" value="premium">
                                <span>&gt; 25% THC</span>
                            </label>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-semibold mb-4 text-gray-300">PRICE RANGE</h4>
                        <div class="space-y-3">
                            <input type="range" min="100" max="500" value="300" class="w-full accent-yellow-500" id="price-range">
                            <div class="flex justify-between text-sm text-gray-400">
                                <span>$100</span>
                                <span id="price-value" class="text-yellow-500 font-bold">$300</span>
                                <span>$500</span>
                            </div>
                        </div>
                    </div>

                    <button class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg font-bold tracking-wide hover:from-yellow-400 hover:to-yellow-500 transition-all">
                        APPLY FILTERS
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1">
                <!-- Search and Sort Bar -->
                <div class="glass-effect rounded-xl p-4 mb-8">
                    <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div class="relative flex-1 max-w-md">
                            <input type="text" id="search-input" placeholder="Search strains..." 
                                class="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors">
                            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        <select id="sort-select" class="bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors">
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="thc-high">THC: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>
                </div>

                <!-- Products Grid -->
                <div id="products-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Products will be loaded here -->
                </div>

                <!-- Pagination -->
                <div class="flex justify-center mt-12">
                    <div class="flex space-x-2">
                        <button class="px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold">1</button>
                        <button class="px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors">2</button>
                        <button class="px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors">3</button>
                        <button class="px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Premium Footer -->
    <footer class="bg-gradient-to-b from-gray-900 to-black pt-16 pb-8 border-t border-white/10 mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="font-bebas text-3xl gold-gradient mb-4">HONEST PHARM CO.</div>
                <p class="text-gray-400">© 2024 Honest Pharm Co. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="/static/js/catalog.js"></script>
    <script>
        // Update price range display
        document.getElementById('price-range').addEventListener('input', function(e) {
            document.getElementById('price-value').textContent = '$' + e.target.value;
        });

        // Initialize cart count
        updateCartCount();
    </script>
</body>
</html>
  `
}