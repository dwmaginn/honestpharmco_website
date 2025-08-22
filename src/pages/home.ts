export async function renderHomePage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honest Pharm Co. - Premium New York Cannabis Cultivator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link href="/static/css/premium.css" rel="stylesheet">
    <style>
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
            background: #4a5568;
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #718096;
        }
        
        /* Premium typography */
        .font-bebas {
            font-family: 'Bebas Neue', cursive;
        }
        .font-montserrat {
            font-family: 'Montserrat', sans-serif;
        }
        .font-playfair {
            font-family: 'Playfair Display', serif;
        }
        
        /* Gold accent gradient */
        .gold-gradient {
            background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* Premium animations */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        .float-animation {
            animation: float 6s ease-in-out infinite;
        }
        
        .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
        }
        
        /* Video background overlay */
        .video-overlay {
            background: linear-gradient(180deg, 
                rgba(0,0,0,0.3) 0%, 
                rgba(0,0,0,0.5) 50%, 
                rgba(0,0,0,0.8) 100%);
        }
        
        /* Premium button effects */
        .premium-btn {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .premium-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .premium-btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        /* Glass effect */
        .glass-effect {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Map styling */
        #location-map {
            height: 500px;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .leaflet-container {
            background: #1a1a1a;
        }
    </style>
</head>
<body class="bg-black text-white font-montserrat">
    <!-- Premium Navigation -->
    <nav class="fixed w-full top-0 z-50 glass-effect transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center">
                    <div class="relative">
                        <img src="/static/images/logo.png" alt="Honest Pharm Co" class="h-14 w-auto">
                        <div class="absolute inset-0 shimmer"></div>
                    </div>
                    <div class="ml-4">
                        <span class="text-2xl font-bebas tracking-wider gold-gradient">HONEST PHARM CO.</span>
                        <div class="text-xs text-gray-400 font-light tracking-widest">PREMIUM CANNABIS CULTIVATOR</div>
                    </div>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-gray-300 hover:text-white font-medium tracking-wide transition-colors duration-200">HOME</a>
                    <a href="/catalog" class="text-gray-300 hover:text-white font-medium tracking-wide transition-colors duration-200">CATALOG</a>
                    <a href="#locations" class="text-gray-300 hover:text-white font-medium tracking-wide transition-colors duration-200">LOCATIONS</a>
                    <a href="/cart" class="text-gray-300 hover:text-white font-medium relative transition-colors duration-200">
                        <i class="fas fa-shopping-cart text-lg"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hidden">0</span>
                    </a>
                    <a href="/login" class="premium-btn bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2.5 rounded-full font-semibold tracking-wide hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-500/30">
                        <i class="fas fa-user mr-2"></i>LOGIN
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section with Video Background -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
        <!-- Video Background -->
        <div class="absolute inset-0 w-full h-full">
            <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
                <source src="https://cdn.coverr.co/videos/coverr-cannabis-plants-in-greenhouse-4577/1080p.mp4" type="video/mp4">
                <!-- Fallback video sources -->
                <source src="https://assets.mixkit.co/videos/preview/mixkit-cannabis-plant-close-up-4982-large.mp4" type="video/mp4">
            </video>
            <div class="video-overlay absolute inset-0"></div>
        </div>
        
        <!-- Hero Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="space-y-8">
                <div class="inline-block">
                    <div class="flex items-center justify-center space-x-2 mb-4">
                        <div class="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500"></div>
                        <span class="text-yellow-500 text-sm font-semibold tracking-widest">LICENSED & CERTIFIED</span>
                        <div class="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500"></div>
                    </div>
                </div>
                
                <h1 class="text-6xl md:text-8xl font-bebas tracking-wider leading-tight">
                    <span class="block">NEW YORK STATE</span>
                    <span class="block gold-gradient text-7xl md:text-9xl">CANNABIS</span>
                    <span class="block">CULTIVATOR</span>
                </h1>
                
                <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                    Experience the pinnacle of greenhouse cultivation. Our controlled environment produces the finest premium cannabis for New York's discerning market.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <a href="/catalog" class="premium-btn group bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-10 py-4 rounded-full font-bold tracking-wide hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/40 transform hover:scale-105">
                        <i class="fas fa-cannabis mr-3 group-hover:rotate-12 transition-transform"></i>EXPLORE CATALOG
                    </a>
                    <a href="/login" class="premium-btn glass-effect text-white px-10 py-4 rounded-full font-bold tracking-wide hover:bg-white/10 transition-all duration-300 border border-white/20">
                        <i class="fas fa-crown mr-3"></i>WHOLESALE ACCESS
                    </a>
                </div>
                
                <!-- Scroll Indicator -->
                <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 float-animation">
                    <div class="flex flex-col items-center space-y-2">
                        <span class="text-xs tracking-widest">SCROLL TO EXPLORE</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Features Bar -->
    <section class="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-6 border-y border-white/10">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-wrap justify-center items-center gap-8 text-sm">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-certificate text-yellow-500"></i>
                    <span class="text-gray-300">NY STATE LICENSED</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-leaf text-green-500"></i>
                    <span class="text-gray-300">PREMIUM GENETICS</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-temperature-low text-blue-500"></i>
                    <span class="text-gray-300">CLIMATE CONTROLLED</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-microscope text-purple-500"></i>
                    <span class="text-gray-300">LAB TESTED</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-truck text-orange-500"></i>
                    <span class="text-gray-300">STATEWIDE DELIVERY</span>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section with Premium Design -->
    <section class="py-24 bg-black relative">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <div class="space-y-8">
                    <div>
                        <span class="text-yellow-500 text-sm font-semibold tracking-widest">OUR PHILOSOPHY</span>
                        <h2 class="text-5xl font-bebas mt-4 mb-6">
                            QUALITY STARTS WITH <span class="gold-gradient">GENETICS</span>
                        </h2>
                    </div>
                    
                    <p class="text-gray-400 text-lg leading-relaxed">
                        At Honest Pharm Co., we believe exceptional cannabis begins with superior genetics. Through intensive research and development, we cultivate the most sought-after strains to meet the evolving demands of New York's premium market.
                    </p>
                    
                    <p class="text-gray-400 text-lg leading-relaxed">
                        Our expert cultivation team continuously refines and expands our genetic lineage, ensuring each harvest exceeds the highest standards of quality and innovation.
                    </p>
                    
                    <div class="grid grid-cols-2 gap-6 pt-4">
                        <div class="glass-effect p-6 rounded-lg border border-white/10 hover:border-yellow-500/30 transition-colors">
                            <i class="fas fa-award text-3xl text-yellow-500 mb-3"></i>
                            <h3 class="font-bold text-white mb-2">Licensed Excellence</h3>
                            <p class="text-sm text-gray-400">NY State certified cultivation facility</p>
                        </div>
                        <div class="glass-effect p-6 rounded-lg border border-white/10 hover:border-green-500/30 transition-colors">
                            <i class="fas fa-seedling text-3xl text-green-500 mb-3"></i>
                            <h3 class="font-bold text-white mb-2">Premium Strains</h3>
                            <p class="text-sm text-gray-400">Carefully selected genetic profiles</p>
                        </div>
                        <div class="glass-effect p-6 rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors">
                            <i class="fas fa-home text-3xl text-blue-500 mb-3"></i>
                            <h3 class="font-bold text-white mb-2">Greenhouse Control</h3>
                            <p class="text-sm text-gray-400">Optimal growing environment</p>
                        </div>
                        <div class="glass-effect p-6 rounded-lg border border-white/10 hover:border-purple-500/30 transition-colors">
                            <i class="fas fa-flask text-3xl text-purple-500 mb-3"></i>
                            <h3 class="font-bold text-white mb-2">Lab Verified</h3>
                            <p class="text-sm text-gray-400">Third-party tested quality</p>
                        </div>
                    </div>
                </div>
                
                <div class="relative">
                    <div class="grid grid-cols-2 gap-4">
                        <img src="/static/images/greenhouse1.jpg" alt="Greenhouse" class="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <img src="/static/images/greenhouse2.jpg" alt="Cannabis Plants" class="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500 mt-8">
                        <img src="/static/images/product1.jpg" alt="Premium Product" class="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <img src="/static/images/product2.jpg" alt="Premium Product" class="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500 mt-8">
                    </div>
                    <div class="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl"></div>
                    <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Product Showcase -->
    <section class="py-24 bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="text-yellow-500 text-sm font-semibold tracking-widest">CURATED SELECTION</span>
                <h2 class="text-5xl font-bebas mt-4">
                    FEATURED <span class="gold-gradient">PRODUCTS</span>
                </h2>
            </div>
            
            <div id="featured-products" class="grid md:grid-cols-3 gap-8">
                <!-- Products will be loaded here with premium styling -->
            </div>
        </div>
    </section>

    <!-- Location Map Section -->
    <section id="locations" class="py-24 bg-black relative">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="text-yellow-500 text-sm font-semibold tracking-widest">STATEWIDE PRESENCE</span>
                <h2 class="text-5xl font-bebas mt-4 mb-4">
                    WHERE TO FIND <span class="gold-gradient">OUR PRODUCTS</span>
                </h2>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    Our premium cannabis products are available at select dispensaries across New York State
                </p>
            </div>
            
            <div class="glass-effect rounded-xl p-2 shadow-2xl">
                <div id="location-map"></div>
            </div>
            
            <div class="grid md:grid-cols-4 gap-6 mt-12">
                <div class="glass-effect p-6 rounded-lg text-center border border-white/10 hover:border-yellow-500/30 transition-all hover:transform hover:scale-105">
                    <i class="fas fa-map-marker-alt text-3xl text-yellow-500 mb-3"></i>
                    <h3 class="font-bold text-white mb-2">Manhattan</h3>
                    <p class="text-sm text-gray-400">12 Locations</p>
                </div>
                <div class="glass-effect p-6 rounded-lg text-center border border-white/10 hover:border-yellow-500/30 transition-all hover:transform hover:scale-105">
                    <i class="fas fa-map-marker-alt text-3xl text-green-500 mb-3"></i>
                    <h3 class="font-bold text-white mb-2">Brooklyn</h3>
                    <p class="text-sm text-gray-400">8 Locations</p>
                </div>
                <div class="glass-effect p-6 rounded-lg text-center border border-white/10 hover:border-yellow-500/30 transition-all hover:transform hover:scale-105">
                    <i class="fas fa-map-marker-alt text-3xl text-blue-500 mb-3"></i>
                    <h3 class="font-bold text-white mb-2">Queens</h3>
                    <p class="text-sm text-gray-400">6 Locations</p>
                </div>
                <div class="glass-effect p-6 rounded-lg text-center border border-white/10 hover:border-yellow-500/30 transition-all hover:transform hover:scale-105">
                    <i class="fas fa-map-marker-alt text-3xl text-purple-500 mb-3"></i>
                    <h3 class="font-bold text-white mb-2">Upstate NY</h3>
                    <p class="text-sm text-gray-400">15 Locations</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium CTA Section -->
    <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-yellow-500/10 to-yellow-600/20"></div>
        <div class="relative max-w-4xl mx-auto text-center px-4">
            <div class="space-y-8">
                <h2 class="text-5xl font-bebas">
                    READY TO ELEVATE YOUR <span class="gold-gradient">INVENTORY</span>?
                </h2>
                <p class="text-xl text-gray-300 font-light">
                    Join New York's premier cannabis wholesale network. Access exclusive strains and competitive pricing.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <a href="/login" class="premium-btn group bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-12 py-4 rounded-full font-bold tracking-wide hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/40 transform hover:scale-105">
                        <i class="fas fa-unlock mr-3 group-hover:rotate-12 transition-transform"></i>ACCESS WHOLESALE
                    </a>
                    <a href="mailto:wholesale@honestpharmco.com" class="premium-btn glass-effect text-white px-12 py-4 rounded-full font-bold tracking-wide hover:bg-white/10 transition-all duration-300 border border-white/20">
                        <i class="fas fa-envelope mr-3"></i>CONTACT SALES
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Footer -->
    <footer class="bg-gradient-to-b from-gray-900 to-black pt-16 pb-8 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8 mb-12">
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <img src="/static/images/logo.png" alt="Honest Pharm Co" class="h-12 w-auto">
                        <div>
                            <div class="font-bebas text-2xl gold-gradient">HONEST PHARM CO.</div>
                            <div class="text-xs text-gray-500">EST. 2022</div>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm">
                        New York's premier licensed cannabis cultivator, committed to quality and innovation.
                    </p>
                </div>
                
                <div>
                    <h3 class="font-bold text-white mb-4 tracking-wide">QUICK LINKS</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/catalog" class="text-gray-400 hover:text-yellow-500 transition-colors">Product Catalog</a></li>
                        <li><a href="/login" class="text-gray-400 hover:text-yellow-500 transition-colors">Wholesale Portal</a></li>
                        <li><a href="#locations" class="text-gray-400 hover:text-yellow-500 transition-colors">Store Locations</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-yellow-500 transition-colors">Lab Results</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="font-bold text-white mb-4 tracking-wide">LEGAL</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="text-gray-400 hover:text-yellow-500 transition-colors">License Information</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-yellow-500 transition-colors">Compliance</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="font-bold text-white mb-4 tracking-wide">CONNECT</h3>
                    <div class="flex space-x-4 mb-6">
                        <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition-colors">
                            <i class="fab fa-instagram text-white"></i>
                        </a>
                        <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition-colors">
                            <i class="fab fa-facebook-f text-white"></i>
                        </a>
                        <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition-colors">
                            <i class="fab fa-twitter text-white"></i>
                        </a>
                        <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition-colors">
                            <i class="fab fa-linkedin-in text-white"></i>
                        </a>
                    </div>
                    <p class="text-sm text-gray-400">
                        <i class="fas fa-phone mr-2"></i>1-800-HONEST-1<br>
                        <i class="fas fa-envelope mr-2 mt-2 inline-block"></i>info@honestpharmco.com
                    </p>
                </div>
            </div>
            
            <div class="border-t border-white/10 pt-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-500 text-sm">© 2024 Honest Pharm Co. All rights reserved.</p>
                    <p class="text-gray-500 text-xs mt-4 md:mt-0">
                        Licensed by the New York State Office of Cannabis Management
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <script src="/static/js/premium.js"></script>
    <script>
        // Initialize map
        document.addEventListener('DOMContentLoaded', function() {
            // Create map centered on New York
            const map = L.map('location-map', {
                center: [40.7128, -74.0060],
                zoom: 10,
                scrollWheelZoom: false,
                style: 'mapbox://styles/mapbox/dark-v10'
            });

            // Add dark theme tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors © CARTO',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);

            // Custom gold marker icon
            const goldIcon = L.divIcon({
                html: '<i class="fas fa-map-marker-alt text-3xl text-yellow-500"></i>',
                iconSize: [30, 40],
                className: 'custom-div-icon'
            });

            // Add dispensary locations
            const locations = [
                { lat: 40.7580, lng: -73.9855, name: "Times Square Dispensary", address: "1515 Broadway, NYC" },
                { lat: 40.7489, lng: -73.9680, name: "Midtown East Cannabis", address: "420 Lexington Ave, NYC" },
                { lat: 40.7260, lng: -73.9897, name: "East Village Wellness", address: "88 2nd Avenue, NYC" },
                { lat: 40.7831, lng: -73.9712, name: "Upper West Side Shop", address: "2020 Broadway, NYC" },
                { lat: 40.6892, lng: -74.0445, name: "Brooklyn Heights", address: "55 Court St, Brooklyn" },
                { lat: 40.6782, lng: -73.9442, name: "Williamsburg Store", address: "135 Bedford Ave, Brooklyn" },
                { lat: 40.7282, lng: -73.7949, name: "Queens Plaza", address: "31-00 47th Ave, Queens" },
                { lat: 40.7614, lng: -73.8328, name: "Flushing Location", address: "136-20 38th Ave, Queens" }
            ];

            locations.forEach(loc => {
                L.marker([loc.lat, loc.lng], { icon: goldIcon })
                    .addTo(map)
                    .bindPopup(\`
                        <div class="text-black p-2">
                            <h3 class="font-bold">\${loc.name}</h3>
                            <p class="text-sm">\${loc.address}</p>
                        </div>
                    \`);
            });

            // Add cultivation facility (main location)
            const cultivationIcon = L.divIcon({
                html: '<i class="fas fa-industry text-4xl text-green-500"></i>',
                iconSize: [40, 40],
                className: 'custom-div-icon'
            });

            L.marker([42.8864, -78.8784], { icon: cultivationIcon })
                .addTo(map)
                .bindPopup(\`
                    <div class="text-black p-2">
                        <h3 class="font-bold">Honest Pharm Co. Cultivation Facility</h3>
                        <p class="text-sm">Main Greenhouse & Processing Center</p>
                        <p class="text-sm">Buffalo, NY</p>
                    </div>
                \`);

            // Pan to show both NYC and Buffalo
            map.fitBounds([
                [40.4774, -74.2591], // Southwest
                [43.0481, -78.4356]  // Northeast
            ]);
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('bg-black/90', 'backdrop-blur-md');
            } else {
                navbar.classList.remove('bg-black/90', 'backdrop-blur-md');
            }
        });
    </script>
</body>
</html>
  `
}