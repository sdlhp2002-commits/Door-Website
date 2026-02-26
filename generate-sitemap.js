// generate-sitemap.js

const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const glob = require('glob');
const fs = require('fs');

async function generateSitemap() {
    const hostname = 'https://doors.ajormart.in';

    // 1. Create a sitemap stream
    const sitemapStream = new SitemapStream({ hostname });

    // 2. Find all .html files, excluding any templates or partials
    const files = glob.sync('**/*.html', {
        // Add paths to ignore here if you have any
        ignore: ['node_modules/**', 'template.html']
    });

    console.log('Found files:', files);

    // 3. Add static HTML files to the sitemap
    files.forEach(file => {
        const stats = fs.statSync(file);
        const urlPath = file.replace(/\\/g, '/'); // Ensure forward slashes for URLs

        // Basic logic to set priority and changefreq
        let priority = 0.8;
        let changefreq = 'monthly';

        if (urlPath === 'index.html') {
            priority = 1.0;
            changefreq = 'daily';
        } else if (urlPath.includes('product.html') || urlPath.includes('gallery.html')) {
            changefreq = 'weekly';
        }

        sitemapStream.write({
            url: `/${urlPath}`,
            lastmod: stats.mtime.toISOString().split('T')[0], // Get file modification date
            changefreq: changefreq,
            priority: priority,
        });
    });

    // 4. Manually add dynamic-looking URLs (product details)
    // In a real application, you might fetch this list from a JSON file or API
    const productIds = [
        'wpc-digital', 'solid-wood-primer', 'exclusive-laminates', 'teak-veneer',
        'laminate-doors', 'premium-digital', 'premium-teak-wood', 'antique-laminated',
        'wpc-door-frame', 'pooja-door', 'neo-classic-doors', 'hdf-moulded-doors'
    ];

    productIds.forEach(id => {
        sitemapStream.write({
            url: `/product-details.html?id=${id}`,
            lastmod: new Date().toISOString().split('T')[0], // Or get a more specific date if possible
            changefreq: 'weekly',
            priority: 0.8,
        });
    });

    // End the stream
    sitemapStream.end();

    // 5. Convert the stream to a string and write it to sitemap.xml
    const sitemap = await streamToPromise(sitemapStream).then(data => data.toString());
    createWriteStream('./sitemap.xml').write(sitemap);

    console.log('sitemap.xml generated successfully!');
}

generateSitemap();
