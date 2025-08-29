import siteContent from '../content/site-content.json';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export function generateHTMLHead(meta: PageMeta): string {
  const { title, description, keywords = [], ogImage = '/static/images/og-image.jpg' } = meta;
  
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${keywords.length > 0 ? `<meta name="keywords" content="${keywords.join(', ')}">` : ''}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://honestpharmco.com/">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="Honest Pharm Co.">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://honestpharmco.com/">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/static/images/favicon.png">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- Compiled Tailwind CSS -->
    <link href="/static/css/tailwind.css" rel="stylesheet">
    <link href="/static/css/premium.css" rel="stylesheet">
    
    <!-- Additional SEO -->
    <link rel="canonical" href="https://honestpharmco.com${getCurrentPath()}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Honest Pharm Co.">
  `;
}

function getCurrentPath(): string {
  // This would be set based on the current route
  // For now, return empty string
  return '';
}

export function generateNavigation(): string {
  return `
    <nav class="bg-black shadow-lg sticky top-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center">
                    <img src="/static/images/logo.png" alt="Honest Pharm Co" class="h-16 w-auto">
                    <span class="ml-3 text-2xl font-bold gold-gradient font-bebas">HONEST PHARM CO.</span>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-gray-300 hover:text-gold transition-colors font-medium">Home</a>
                    <a href="/catalog" class="text-gray-300 hover:text-gold transition-colors font-medium">Catalog</a>
                    <a href="/dispensary" class="text-gray-300 hover:text-gold transition-colors font-medium">Dispensaries</a>
                    <a href="/labs" class="text-gray-300 hover:text-gold transition-colors font-medium">Lab Results</a>
                    <a href="/cart" class="text-gray-300 hover:text-gold transition-colors font-medium relative">
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">0</span>
                    </a>
                    <a href="/login" class="btn-premium text-black font-bold py-2 px-4 rounded">Login</a>
                </div>
            </div>
        </div>
    </nav>
  `;
}

export function generateFooter(): string {
  const { contact, social, legal } = siteContent.site;
  
  return `
    <footer class="bg-black text-gray-300 py-12 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-gold font-bebas text-2xl mb-4">HONEST PHARM CO.</h3>
                    <p class="text-sm">New York's Premier Cannabis Cultivator</p>
                    <p class="text-sm mt-2">OCM License #: CCB-0000123</p>
                </div>
                <div>
                    <h4 class="text-gold font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/catalog" class="hover:text-gold transition-colors">Product Catalog</a></li>
                        <li><a href="/dispensary" class="hover:text-gold transition-colors">Find Dispensaries</a></li>
                        <li><a href="/labs" class="hover:text-gold transition-colors">Lab Results</a></li>
                        <li><a href="/login" class="hover:text-gold transition-colors">Wholesale Portal</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-gold font-semibold mb-4">Contact</h4>
                    <p class="text-sm">${contact.email}</p>
                    <p class="text-sm">${contact.phone}</p>
                    <p class="text-sm mt-2">
                        ${contact.address.street}<br>
                        ${contact.address.city}, ${contact.address.state} ${contact.address.zip}
                    </p>
                </div>
                <div>
                    <h4 class="text-gold font-semibold mb-4">Follow Us</h4>
                    <div class="flex space-x-4">
                        <a href="${social.instagram}" class="text-2xl hover:text-gold transition-colors" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="${social.twitter}" class="text-2xl hover:text-gold transition-colors" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="${social.linkedin}" class="text-2xl hover:text-gold transition-colors" aria-label="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                <p>${legal.disclaimer}</p>
                <p class="mt-2">
                    <a href="${legal.termsOfService}" class="hover:text-gold transition-colors">Terms of Service</a> | 
                    <a href="${legal.privacyPolicy}" class="hover:text-gold transition-colors ml-2">Privacy Policy</a>
                </p>
                <p class="mt-4 text-xs text-gray-500">© 2024 Honest Pharm Co. All rights reserved.</p>
            </div>
        </div>
    </footer>
  `;
}