export async function renderCatalogPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Catalog - Honest Pharm Co.</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/css/main.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center">
                    <img src="/static/images/logo.png" alt="Honest Pharm Co" class="h-16 w-auto">
                    <span class="ml-3 text-2xl font-bold text-green-700">Honest Pharm Co.</span>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-gray-700 hover:text-green-600 font-medium">Home</a>
                    <a href="/catalog" class="text-green-600 font-semibold">Catalog</a>
                    <a href="/cart" class="text-gray-700 hover:text-green-600 font-medium relative">
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hidden">0</span>
                    </a>
                    <div id="user-menu">
                        <a href="/login" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            <i class="fas fa-user mr-2"></i>Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-8">
            <!-- Sidebar Filters -->
            <aside class="w-64 flex-shrink-0">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Categories</h3>
                    <div id="categories-filter" class="space-y-2">
                        <!-- Categories will be loaded here -->
                    </div>

                    <h3 class="text-lg font-semibold mt-6 mb-4">Strain Type</h3>
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" value="Sativa" class="strain-filter mr-2">
                            <span>Sativa</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" value="Indica" class="strain-filter mr-2">
                            <span>Indica</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" value="Hybrid" class="strain-filter mr-2">
                            <span>Hybrid</span>
                        </label>
                    </div>

                    <h3 class="text-lg font-semibold mt-6 mb-4">THC Content</h3>
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" value="0-15" class="thc-filter mr-2">
                            <span>0-15%</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" value="15-20" class="thc-filter mr-2">
                            <span>15-20%</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" value="20-25" class="thc-filter mr-2">
                            <span>20-25%</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" value="25+" class="thc-filter mr-2">
                            <span>25%+</span>
                        </label>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1">
                <!-- Search and Sort -->
                <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
                    <div class="flex-1 max-w-md">
                        <div class="relative">
                            <input type="text" id="search-input" placeholder="Search products..." 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                            <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <select id="sort-select" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="name">Sort by Name</option>
                            <option value="thc">Sort by THC %</option>
                            <option value="price">Sort by Price</option>
                        </select>
                    </div>
                </div>

                <!-- Login Notice -->
                <div id="login-notice" class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 hidden">
                    <i class="fas fa-info-circle mr-2"></i>
                    <span>Please <a href="/login" class="underline font-semibold">login</a> to see wholesale pricing.</span>
                </div>

                <!-- Products Grid -->
                <div id="products-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Products will be loaded here -->
                </div>

                <!-- Loading Spinner -->
                <div id="loading" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-3xl text-green-600"></i>
                </div>

                <!-- No Products Message -->
                <div id="no-products" class="text-center py-8 hidden">
                    <p class="text-gray-500">No products found matching your criteria.</p>
                </div>
            </main>
        </div>
    </div>

    <!-- Product Modal -->
    <div id="product-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 id="modal-title" class="text-2xl font-bold"></h2>
                    <button onclick="closeProductModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="modal-content">
                    <!-- Product details will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <p>&copy; 2024 Honest Pharm Co. All rights reserved.</p>
                <div class="flex space-x-6">
                    <a href="#" class="hover:text-green-400"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="hover:text-green-400"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="hover:text-green-400"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/js/catalog.js"></script>
</body>
</html>
  `
}