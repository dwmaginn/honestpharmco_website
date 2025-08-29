const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const inputDir = path.join(__dirname, '../public/static/images');
  const outputDir = path.join(__dirname, '../public/static/images/optimized');
  
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  const images = [
    { name: 'greenhouse1.jpg', width: 1920, quality: 85 },
    { name: 'greenhouse2.jpg', width: 1920, quality: 85 },
    { name: 'greenhouse3.jpg', width: 1920, quality: 85 },
    { name: 'logo.png', width: 300, quality: 90 },
    { name: 'jam-master-jays.png', width: 600, quality: 90 },
    { name: 'midnight-cookies.png', width: 600, quality: 90 },
    { name: 'seed-weed.png', width: 600, quality: 90 },
  ];
  
  for (const image of images) {
    const inputPath = path.join(inputDir, image.name);
    const outputPath = path.join(outputDir, image.name);
    
    try {
      const stats = await fs.stat(inputPath);
      const originalSize = (stats.size / 1024 / 1024).toFixed(2);
      
      if (image.name.endsWith('.jpg')) {
        await sharp(inputPath)
          .resize(image.width, null, { withoutEnlargement: true })
          .jpeg({ quality: image.quality, progressive: true })
          .toFile(outputPath);
      } else if (image.name.endsWith('.png')) {
        await sharp(inputPath)
          .resize(image.width, null, { withoutEnlargement: true })
          .png({ quality: image.quality, compressionLevel: 9 })
          .toFile(outputPath);
      }
      
      const newStats = await fs.stat(outputPath);
      const newSize = (newStats.size / 1024 / 1024).toFixed(2);
      
      console.log(`✓ ${image.name}: ${originalSize}MB → ${newSize}MB`);
      
      // Generate WebP version for better compression
      const webpPath = outputPath.replace(/\.(jpg|png)$/, '.webp');
      await sharp(inputPath)
        .resize(image.width, null, { withoutEnlargement: true })
        .webp({ quality: image.quality })
        .toFile(webpPath);
      
      const webpStats = await fs.stat(webpPath);
      const webpSize = (webpStats.size / 1024 / 1024).toFixed(2);
      console.log(`  + WebP version: ${webpSize}MB`);
      
    } catch (error) {
      console.error(`✗ Error optimizing ${image.name}:`, error.message);
    }
  }
  
  console.log('\nOptimization complete! Remember to update image references to use the optimized versions.');
  console.log('Consider using <picture> elements for WebP with fallback:');
  console.log(`
<picture>
  <source srcset="/static/images/optimized/image.webp" type="image/webp">
  <img src="/static/images/optimized/image.jpg" alt="Description">
</picture>
  `);
}

optimizeImages().catch(console.error);