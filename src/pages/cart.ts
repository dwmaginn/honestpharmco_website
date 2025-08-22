export async function renderCartPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - Honest Pharm Co.</title>
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
                    <a href="/cart" class="text-green-600 font-semibold relative">
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
        <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2">
                <div id="cart-items" class="bg-white rounded-lg shadow-md">
                    <!-- Cart items will be loaded here -->
                </div>

                <!-- Empty Cart Message -->
                <div id="empty-cart" class="bg-white rounded-lg shadow-md p-12 text-center hidden">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                    <p class="text-gray-500 mb-6">Add some products to get started</p>
                    <a href="/catalog" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition inline-block">
                        Browse Products
                    </a>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
                    
                    <div class="space-y-3 mb-4">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span id="cart-subtotal" class="font-medium">$0.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax (8.875%)</span>
                            <span id="cart-tax" class="font-medium">$0.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span id="cart-shipping" class="font-medium">FREE</span>
                        </div>
                        <div class="border-t pt-3">
                            <div class="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span id="cart-total">$0.00</span>
                            </div>
                        </div>
                    </div>

                    <div id="checkout-section">
                        <button id="checkout-btn" onclick="proceedToCheckout()" 
                                class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Proceed to Checkout
                        </button>
                        <p id="login-message" class="text-sm text-gray-600 mt-3 text-center hidden">
                            Please <a href="/login" class="text-green-600 underline">login</a> to checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Checkout Modal -->
    <div id="checkout-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold">Checkout</h2>
                    <button onclick="closeCheckoutModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="checkout-form" onsubmit="return submitOrder(event)">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-3">Shipping Address</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input type="text" name="shipping_address" required 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input type="text" name="shipping_city" required 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input type="text" name="shipping_state" maxlength="2" required 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                <input type="text" name="shipping_zip" required 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="flex items-center">
                            <input type="checkbox" id="same-billing" checked class="mr-2">
                            <span class="text-sm">Billing address same as shipping</span>
                        </label>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                        <textarea name="notes" rows="3" 
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                    </div>

                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="closeCheckoutModal()" 
                                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                            Place Order
                        </button>
                    </div>
                </form>
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
    <script src="/static/js/cart.js"></script>
</body>
</html>
  `
}