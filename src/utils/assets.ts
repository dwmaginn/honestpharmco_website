// Helper to get compiled asset URLs
export function getAssetUrl(assetName: string): string {
  // In production, Vite will generate hashed filenames
  // For now, we'll use a simple path
  // This should be updated to read from a manifest.json in production
  return `/static/css/${assetName}`
}

// Helper to generate meta tags
export function generateMetaTags(page: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}): string {
  const { title, description, keywords = [], ogImage = '/static/images/og-image.jpg' } = page;
  
  return `
    <meta name="description" content="${description}">
    ${keywords.length > 0 ? `<meta name="keywords" content="${keywords.join(', ')}">` : ''}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="Honest Pharm Co.">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- Additional SEO -->
    <link rel="canonical" href="https://honestpharmco.com">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Honest Pharm Co.">
  `;
}