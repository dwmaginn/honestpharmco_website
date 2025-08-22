export async function renderHomePage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honest Pharm Co. - Licensed NY Cannabis Cultivator</title>
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
                    <a href="/catalog" class="text-gray-700 hover:text-green-600 font-medium">Catalog</a>
                    <a href="/cart" class="text-gray-700 hover:text-green-600 font-medium relative">
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hidden">0</span>
                    </a>
                    <a href="/login" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        <i class="fas fa-user mr-2"></i>Login
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-5xl font-bold mb-6">A Licensed New York State Cannabis Cultivator</h1>
                <p class="text-xl mb-8 max-w-3xl mx-auto">
                    Honest Pharm Co. enjoys the benefit of greenhouse growing conditions leading to a more controlled environment to produce top quality cannabis for the New York State market.
                </p>
                <div class="space-x-4">
                    <a href="/catalog" class="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                        <i class="fas fa-cannabis mr-2"></i>Browse Products
                    </a>
                    <a href="/login" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition inline-block">
                        <i class="fas fa-sign-in-alt mr-2"></i>Login for Pricing
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-6">Quality Starts with Genetics</h2>
                    <p class="text-gray-600 mb-4">
                        Here at Honest Pharm Co. we know that success starts with the genetics. Through intense research and development we strive to foster the most sought after and in demand strains to respond to an ever changing market.
                    </p>
                    <p class="text-gray-600 mb-6">
                        Our cultivation team is constantly working on improving and expanding our genetics lines to produce top quality cannabis and new innovations.
                    </p>
                    <ul class="space-y-3 text-gray-700">
                        <li><i class="fas fa-check text-green-600 mr-2"></i>Licensed NY State Cultivator</li>
                        <li><i class="fas fa-check text-green-600 mr-2"></i>Greenhouse Growing Conditions</li>
                        <li><i class="fas fa-check text-green-600 mr-2"></i>Premium Genetics Selection</li>
                        <li><i class="fas fa-check text-green-600 mr-2"></i>Wholesale Pricing Available</li>
                    </ul>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <img src="/static/images/greenhouse1.jpg" alt="Greenhouse" class="rounded-lg shadow-lg">
                    <img src="/static/images/greenhouse2.jpg" alt="Cannabis Plants" class="rounded-lg shadow-lg">
                    <img src="/static/images/product1.jpg" alt="Product" class="rounded-lg shadow-lg">
                    <img src="/static/images/product2.jpg" alt="Product" class="rounded-lg shadow-lg">
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Featured Products</h2>
            <div id="featured-products" class="grid md:grid-cols-3 gap-8">
                <!-- Products will be loaded here -->
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-green-700 text-white">
        <div class="max-w-4xl mx-auto text-center px-4">
            <h2 class="text-3xl font-bold mb-4">Ready to Order?</h2>
            <p class="text-xl mb-8">Create an account to see wholesale pricing and place orders</p>
            <a href="/login" class="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                Get Started
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
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

    <script src="/static/js/main.js"></script>
</body>
</html>
  `
}