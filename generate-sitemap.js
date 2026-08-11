import fs from 'fs';
import { ALL_CATEGORIES } from './src/data/categories.js';

const slugs = ALL_CATEGORIES.map(c => c.slug);
const urls = ['/', '/products', '/contact'].concat(slugs.map(s => '/products/' + s));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>https://sai-meera.web.app${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === '/' ? '1.0' : (u === '/products' || u === '/contact' ? '0.8' : '0.6')}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Generated ' + urls.length + ' urls');
