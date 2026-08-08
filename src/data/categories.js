/**
 * categories.js — Single source of truth for ALL Sai Meera product categories.
 *
 * Architecture:
 *  - 29 categories across 4 groups
 *  - Add a new category: insert one object below. Zero new files, zero new routes.
 *  - tone: 'festive' | 'professional' | 'respectful'
 *    - 'festive'      → kolam patterns, accent glows, full animations
 *    - 'professional' → clean, minimal, no kolam, reduced glow
 *    - 'respectful'   → muted silver-grey palette, no patterns, no animations
 */

// ─── Group definitions ────────────────────────────────────────────────────────

export const GROUPS = {
  invitations: {
    slug: 'invitations',
    label: 'Invitations & Ceremonies',
    desc: 'All life events, weddings, and religious ceremonies',
    accentColor: '#f5a623',
  },
  flex: {
    slug: 'flex',
    label: 'Flex & Banners',
    desc: 'Large-format outdoor and event printing',
    accentColor: '#00d4ff',
  },
  cards: {
    slug: 'cards',
    label: 'Cards & Stationery',
    desc: 'Smaller-format premium print products',
    accentColor: '#00ff94',
  },
  business: {
    slug: 'business',
    label: 'Business & Institutional',
    desc: 'Bulk, corporate, and institutional printing',
    accentColor: '#a855f7',
  },
};

// ─── Default shared process steps (overridable per category) ──────────────────

const STANDARD_PROCESS = [
  { n: '1', title: 'Design Consultation', desc: 'Discuss themes, content, and specifications with our team.' },
  { n: '2', title: 'Digital Proof', desc: 'Review and approve a digital preview before printing begins.' },
  { n: '3', title: 'Premium Printing', desc: 'Printed on selected paper with chosen finish and effects.' },
  { n: '4', title: 'Quality Delivery', desc: 'Carefully packed and delivered on time.' },
];

const STANDARD_PRICING = [
  { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 50',  features: ['Offset CMYK print', 'Matte or gloss', '300gsm cardstock', 'Standard envelope'] },
  { name: 'Premium', price: '₹18', unit: '/card', minQty: 'Min 50',  popular: true, features: ['Foil stamping option', 'Textured paper', '350gsm board', 'Matching envelope'] },
  { name: 'Luxury',  price: '₹35', unit: '/card', minQty: 'Min 100', features: ['Multi-foil & emboss', 'Handmade paper', 'Box packaging', 'Custom inserts'] },
];

// ─── Full catalogue ───────────────────────────────────────────────────────────

export const ALL_CATEGORIES = [

  // ═══════════════════════════════════════════
  // GROUP 1: INVITATIONS & CEREMONIES
  // ═══════════════════════════════════════════

  {
    slug: 'hindu-wedding',
    group: 'invitations',
    name: 'Hindu Wedding Invitations',
    subtitle: 'Traditional Hindu ceremony cards',
    heroLabel: 'Sacred · Auspicious · Traditional',
    desc: 'Traditional Hindu ceremony cards',
    description:
      'Exquisite invitations for Hindu weddings — ornate mandala borders, vibrant saffron and maroon palettes, auspicious Ganesha motifs, and Sanskrit shlokas, printed on premium cardstock with gold foil.',
    accentColor: '#f5a623',
    palette: 'gold-maroon',
    tone: 'festive',
    styles: [
      { id: 'traditional', name: 'Traditional Vedic', desc: 'Rich maroon with gold Ganesha motif, Sanskrit slokas, and mandala borders.', specs: ['300gsm Matte', 'Gold Foil Border', 'Min 100 cards'] },
      { id: 'fusion', name: 'Modern Fusion', desc: 'Saffron and ivory with subtle geometric mandala — tradition meets contemporary minimalism.', specs: ['350gsm Smooth', 'Spot UV', 'Min 50 cards'] },
      { id: 'luxury', name: 'Luxury Embossed', desc: 'Multi-foil, blind emboss Ganesha, and deep jewel-tone backgrounds on suede finish paper.', specs: ['350gsm Suede', 'Multi-foil + Emboss', 'Min 200 cards'] },
    ],
    pricing: STANDARD_PRICING,
    process: STANDARD_PROCESS,
  },

  {
    slug: 'muslim-nikah',
    group: 'invitations',
    name: 'Muslim Nikah Invitations',
    subtitle: 'Elegant Islamic ceremony cards',
    heroLabel: 'Bismillah · Elegant · Blessed',
    desc: 'Nikah and Islamic ceremony invitation cards',
    description:
      'Beautifully crafted Nikah invitation cards featuring Arabic Bismillah calligraphy, elegant Islamic geometric patterns, and a luxurious green, gold, and ivory palette printed on velvet or pearl finish paper.',
    accentColor: '#16a34a',
    palette: 'green-gold',
    tone: 'festive',
    styles: [
      { id: 'calligraphy', name: 'Arabic Calligraphy', desc: 'Bismillah and Quranic verse in Arabic calligraphy with dark green and gold.', specs: ['300gsm Velvet Touch', 'Gold Foil', 'Min 100 cards'] },
      { id: 'geometric', name: 'Islamic Geometric', desc: 'Intricate Islamic geometric star patterns in green, white, and gold.', specs: ['Premium Metallic Paper', 'Spot UV', 'Min 50 cards'] },
      { id: 'minimal', name: 'Modern Minimal', desc: 'Clean layout, crescent and star motif, ivory with gold text — understated elegance.', specs: ['Heavy Cotton Paper', 'Letterpress', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 50',  features: ['Offset print', 'Green & gold palette', '300gsm stock', 'Envelope'] },
      { name: 'Premium', price: '₹18', unit: '/card', minQty: 'Min 50',  popular: true, features: ['Gold foil calligraphy', 'Velvet touch finish', '350gsm board', 'Custom envelope'] },
      { name: 'Luxury',  price: '₹35', unit: '/card', minQty: 'Min 100', features: ['Embossed geometric', 'Pearl finish paper', 'Ribbon closure', 'Insert card'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'christian-wedding',
    group: 'invitations',
    name: 'Christian Wedding Invitations',
    subtitle: 'Graceful church ceremony cards',
    heroLabel: 'Grace · Love · Timeless',
    desc: 'Church wedding and Christian ceremony cards',
    description:
      'Timeless Christian wedding invitations featuring elegant cross motifs, delicate floral designs, and a graceful pearl or ivory finish — perfect for church ceremonies and Christian celebrations.',
    accentColor: '#7c94c4',
    palette: 'silver-pearl',
    tone: 'festive',
    styles: [
      { id: 'classic-cross', name: 'Classic Cross', desc: 'Elegant cross motif with white roses and gold script on shimmer pearl paper.', specs: ['Shimmer Pearl 300gsm', 'Silver Foil', 'Min 50 cards'] },
      { id: 'floral', name: 'Floral Elegance', desc: 'Watercolour white and blush florals with dove motif — romantic and delicate.', specs: ['Cream Textured 300gsm', 'Full Color', 'Min 25 cards'] },
      { id: 'luxury', name: 'Rose Gold Luxury', desc: 'Deep navy or ivory with rose gold foil cross and floral spray — premium and modern.', specs: ['350gsm Smooth', 'Rose Gold Foil', 'Min 50 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 50',  features: ['CMYK offset', 'Matte or gloss', '300gsm paper', 'White envelope'] },
      { name: 'Premium', price: '₹16', unit: '/card', minQty: 'Min 50',  popular: true, features: ['Silver / rose gold foil', 'Pearl finish paper', '350gsm board', 'Custom envelope'] },
      { name: 'Luxury',  price: '₹30', unit: '/card', minQty: 'Min 100', features: ['Multi-foil & emboss', 'Handmade paper', 'Box packaging', 'Ribbon inserts'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'engagement',
    group: 'invitations',
    name: 'Engagement Invitations',
    subtitle: 'Nichayathartham & ring ceremony cards',
    heroLabel: 'Joyful · Celebratory · Elegant',
    desc: 'Nichayathartham and engagement ceremony cards',
    description:
      'Mark the auspicious Nichayathartham with vibrant floral borders, rich jewel-tone palettes, and graceful Tamil or bilingual typography on premium cardstock.',
    accentColor: '#d4608a',
    palette: 'pink-gold',
    tone: 'festive',
    styles: [
      { id: 'floral', name: 'Floral Classic', desc: 'Rose and marigold floral borders — cheerful and festive for South Indian engagements.', specs: ['300gsm Art Paper', 'CMYK + Spot', 'Min 50 cards'] },
      { id: 'jewel', name: 'Jewel Tone', desc: 'Ruby, sapphire, emerald backgrounds with gold foil accents for a regal feel.', specs: ['Premium Metallic', 'Spot UV + Foil', 'Min 50 cards'] },
      { id: 'minimal', name: 'Minimalist', desc: 'Blush tones, delicate line-art borders, and serif typography — understated luxury.', specs: ['Heavy Cotton Paper', 'Letterpress', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 50',  features: ['Standard offset', 'Matte or gloss', '300gsm paper', 'White envelope'] },
      { name: 'Premium', price: '₹16', unit: '/card', minQty: 'Min 50',  popular: true, features: ['Spot UV coating', 'Textured paper', 'Custom colors', 'Matching envelope'] },
      { name: 'Luxury',  price: '₹30', unit: '/card', minQty: 'Min 100', features: ['Foil stamping', 'Velvet finish', 'Ribbon closure', 'Custom inserts'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'reception',
    group: 'invitations',
    name: 'Reception Invitations',
    subtitle: 'Wedding reception and seer varutal cards',
    heroLabel: 'Festive · Grand · Celebratory',
    desc: 'Wedding reception and celebration cards',
    description:
      'Grand reception invitation cards in bold, celebratory colors — perfect for post-wedding receptions, seer varutal functions, and family gatherings.',
    accentColor: '#e85d9a',
    palette: 'pink-gold',
    tone: 'festive',
    styles: [
      { id: 'grand', name: 'Grand Celebration', desc: 'Bold color blocking, gold foil text, and festive motifs for a memorable reception.', specs: ['350gsm Gloss', 'Gold Foil', 'Min 100 cards'] },
      { id: 'floral', name: 'Floral Garden', desc: 'Lush floral prints in vibrant pinks and yellows for a warm, welcoming reception.', specs: ['300gsm Matte', 'Full CMYK', 'Min 50 cards'] },
      { id: 'minimal', name: 'Elegant Minimal', desc: 'Soft cream or blush with gold script — refined and tasteful.', specs: ['300gsm Smooth', 'Soft-Touch Lam', 'Min 50 cards'] },
    ],
    pricing: STANDARD_PRICING,
    process: STANDARD_PROCESS,
  },

  {
    slug: 'baby-shower',
    group: 'invitations',
    name: 'Baby Shower / Seemantham',
    subtitle: 'Ithazhil Vizha and baby shower cards',
    heroLabel: 'Sweet · Warm · Celebratory',
    desc: 'Baby shower and Seemantham ceremony cards',
    description:
      'Announce the most precious arrival with cheerful, warmly designed baby shower invitations — soft pastel palettes, adorable illustrated motifs, and heartfelt messages on premium stock.',
    accentColor: '#7bc8f5',
    palette: 'pastel-blue',
    tone: 'festive',
    styles: [
      { id: 'pastel', name: 'Pastel Sweet', desc: 'Lavender, sky blue, and blush pink with cute baby motifs and rounded typography.', specs: ['300gsm Matte', 'Full CMYK', 'Min 25 cards'] },
      { id: 'nature', name: 'Nature & Garden', desc: 'Watercolor florals and butterflies — organic and beautiful.', specs: ['Textured Cream Paper', 'Soft-Touch Lam', 'Min 25 cards'] },
      { id: 'neutral', name: 'Gender-Neutral Modern', desc: 'Clean geometric shapes, warm neutrals — stylish regardless of reveal.', specs: ['300gsm Smooth', 'Gloss Lam', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹10', unit: '/card', minQty: 'Min 25',  features: ['Digital print', 'Vibrant colors', '300gsm stock', 'White envelope'] },
      { name: 'Premium', price: '₹18', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Custom illustration', 'Soft-touch finish', 'Pastel envelope', 'Insert card'] },
      { name: 'Luxury',  price: '₹32', unit: '/card', minQty: 'Min 50',  features: ['Foil accents', 'Handmade paper', 'Gift box packaging', 'Ribbon'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'valaikaapu',
    group: 'invitations',
    name: 'Valaikaapu Invitations',
    subtitle: 'Traditional bangle ceremony cards',
    heroLabel: 'Auspicious · Traditional · Sacred',
    desc: 'Valaikaapu bangle ceremony invitation cards',
    description:
      "The Valaikaapu — Tamil Nadu's sacred bangle ceremony — deserves invitations as rich in tradition as the ritual itself. Our designs incorporate banana-leaf motifs, betel-leaf iconography, and kolam patterns.",
    accentColor: '#e8a020',
    palette: 'turmeric-green',
    tone: 'festive',
    styles: [
      { id: 'banana-leaf', name: 'Banana Leaf', desc: 'Deep green banana-leaf backgrounds with gold text — authentic and auspicious.', specs: ['300gsm Textured Matte', 'Gold Foil Text', 'Min 50 cards'] },
      { id: 'turmeric', name: 'Turmeric & Kolam', desc: 'Warm turmeric-yellow with hand-drawn kolam border patterns — vibrant and festive.', specs: ['Premium Art Paper', 'Full CMYK + Gold', 'Min 50 cards'] },
      { id: 'betel', name: 'Betel & Marigold', desc: 'Betel-leaf and marigold garland motifs in green-and-orange palette.', specs: ['Cream Textured Stock', 'Earthy palette', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹10', unit: '/card', minQty: 'Min 25',  features: ['Traditional design', 'Tamil + English', '300gsm matte', 'Envelope'] },
      { name: 'Premium', price: '₹20', unit: '/card', minQty: 'Min 50',  popular: true, features: ['Gold foil text', 'Textured stock', 'Banana leaf motif', 'Custom envelope'] },
      { name: 'Luxury',  price: '₹38', unit: '/card', minQty: 'Min 100', features: ['Multi-foil', 'Handmade paper', 'Betel & kolam art', 'Gift packaging'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'ear-piercing',
    group: 'invitations',
    name: 'Ear Piercing / Kaadhukuthu',
    subtitle: 'Kaadhukuthu ceremony invitation cards',
    heroLabel: 'Auspicious · Joyful · Traditional',
    desc: 'Ear piercing and Kaadhukuthu function cards',
    description:
      'Celebrate the sacred Kaadhukuthu ceremony with cheerful, warmly coloured invitation cards featuring peacock feather motifs, temple arch borders, and traditional Tamil typography.',
    accentColor: '#9b59b6',
    palette: 'purple-gold',
    tone: 'festive',
    styles: [
      { id: 'peacock', name: 'Peacock Motif', desc: 'Vibrant peacock feather design with purple and teal palette — festive and traditional.', specs: ['300gsm Art Paper', 'Full CMYK', 'Min 25 cards'] },
      { id: 'temple', name: 'Temple Arch', desc: 'South Indian temple arch border with gold highlights and floral fill.', specs: ['300gsm Matte', 'Gold Foil Border', 'Min 50 cards'] },
      { id: 'pastel', name: 'Pastel Floral', desc: 'Soft lavender and cream with delicate flower print — light and joyful.', specs: ['Textured Cream', 'Soft-Touch Lam', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 25',  features: ['CMYK offset', 'Matte finish', '300gsm paper', 'Envelope'] },
      { name: 'Premium', price: '₹15', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Gold foil border', 'Textured paper', 'Custom design', 'Matching envelope'] },
      { name: 'Luxury',  price: '₹28', unit: '/card', minQty: 'Min 50',  features: ['Emboss + foil', 'Handmade paper', 'Decorative packaging', 'Insert'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'puberty-function',
    group: 'invitations',
    name: 'Puberty / Manjal Neerattu Vizha',
    subtitle: 'Half-sari function and coming-of-age cards',
    heroLabel: 'Sacred · Cultural · Celebratory',
    desc: 'Manjal Neerattu Vizha and half-sari function cards',
    description:
      'Celebrate this important Tamil milestone with invitation cards rooted in tradition — turmeric-yellow, banana-leaf green, and marigold orange palettes with kolam and floral motifs.',
    accentColor: '#f0c030',
    palette: 'turmeric-green',
    tone: 'festive',
    styles: [
      { id: 'turmeric-kolam', name: 'Turmeric & Kolam', desc: 'Warm yellow with intricate kolam borders — authentic Tamil celebration aesthetic.', specs: ['300gsm Art Paper', 'Full CMYK', 'Min 25 cards'] },
      { id: 'floral', name: 'Marigold Floral', desc: 'Marigold and jasmine garland prints in orange and white on cream.', specs: ['Textured Cream', 'Soft-Touch', 'Min 25 cards'] },
      { id: 'modern', name: 'Modern Pastel', desc: 'Contemporary pastel palette with minimal traditional accents.', specs: ['300gsm Smooth', 'Spot UV', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 25',  features: ['CMYK print', 'Matte finish', '300gsm stock', 'Envelope'] },
      { name: 'Premium', price: '₹15', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Kolam border art', 'Turmeric palette', 'Textured paper', 'Custom envelope'] },
      { name: 'Luxury',  price: '₹28', unit: '/card', minQty: 'Min 50',  features: ['Foil & emboss', 'Handmade paper', 'Gift packaging', 'Insert'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'housewarming',
    group: 'invitations',
    name: 'Housewarming / Gruhapravesam',
    subtitle: 'Gruhapravesam and housewarming cards',
    heroLabel: 'Auspicious · New Beginning · Warm',
    desc: 'Gruhapravesam and housewarming invitation cards',
    description:
      'Welcome loved ones to your new home with warmly designed Gruhapravesam invitation cards — featuring traditional kolam entrance motifs, mangal kalash designs, and auspicious green and saffron palettes.',
    accentColor: '#e8701a',
    palette: 'saffron-green',
    tone: 'festive',
    styles: [
      { id: 'kolam-door', name: 'Kolam Entrance', desc: 'House entrance with kolam motif and mango-leaf toran border — auspicious and welcoming.', specs: ['300gsm Matte', 'Full CMYK', 'Min 25 cards'] },
      { id: 'kalash', name: 'Mangal Kalash', desc: 'Gold kalash with coconut and mango leaves on saffron background.', specs: ['300gsm Textured', 'Gold Foil', 'Min 50 cards'] },
      { id: 'modern', name: 'Modern Home', desc: 'Contemporary flat-design house illustration with warm earthy palette.', specs: ['300gsm Smooth', 'Soft-Touch Lam', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 25',  features: ['CMYK print', 'Warm palette', '300gsm stock', 'Envelope'] },
      { name: 'Premium', price: '₹15', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Gold foil accents', 'Kolam art border', 'Textured paper', 'Custom envelope'] },
      { name: 'Luxury',  price: '₹28', unit: '/card', minQty: 'Min 50',  features: ['Foil + emboss', 'Premium handmade paper', 'Box packaging', 'Insert'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'birthday',
    group: 'invitations',
    name: 'Birthday Invitations',
    subtitle: 'Birthday party and celebration cards',
    heroLabel: 'Fun · Vibrant · Memorable',
    desc: 'Birthday party and celebration invitation cards',
    description:
      'Vibrant, fun birthday invitation cards for all ages — from colourful children\'s theme parties to elegant milestone celebrations. Custom designs for any theme, any age.',
    accentColor: '#ff6b6b',
    palette: 'rainbow-festive',
    tone: 'festive',
    styles: [
      { id: 'kids-theme', name: "Kids' Theme Party", desc: 'Bright colours, cartoon motifs, and fun typography for children\'s birthday parties.', specs: ['300gsm Gloss', 'Full CMYK', 'Min 25 cards'] },
      { id: 'milestone', name: 'Milestone Celebration', desc: 'Elegant gold and marble design for 50th, 60th, 75th milestone birthdays.', specs: ['350gsm Smooth', 'Gold Foil', 'Min 25 cards'] },
      { id: 'modern', name: 'Modern Minimalist', desc: 'Clean layout, balloon/confetti motif, and contemporary typography for teens and adults.', specs: ['300gsm Matte', 'Spot UV', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹6',  unit: '/card', minQty: 'Min 25',  features: ['Digital print', 'Any theme', '300gsm stock', 'Envelope'] },
      { name: 'Premium', price: '₹14', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Custom design', 'Gloss finish', 'Photo printing', 'Matching envelope'] },
      { name: 'Luxury',  price: '₹25', unit: '/card', minQty: 'Min 50',  features: ['Gold foil accents', 'Premium stock', 'Gift box', 'Name tag inserts'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'anniversary',
    group: 'invitations',
    name: 'Anniversary Invitations',
    subtitle: 'Wedding anniversary celebration cards',
    heroLabel: 'Love · Gratitude · Timeless',
    desc: 'Wedding anniversary celebration cards',
    description:
      'Celebrate love and partnership with beautifully designed anniversary invitation cards — romantic rose and gold palettes, couple monogram designs, and elegant foil accents.',
    accentColor: '#e05c8a',
    palette: 'rose-gold',
    tone: 'festive',
    styles: [
      { id: 'romantic', name: 'Romantic Roses', desc: 'Deep red roses and hearts with gold script — timeless romantic elegance.', specs: ['300gsm Smooth', 'Gold Foil', 'Min 25 cards'] },
      { id: 'silver-gold', name: 'Silver & Golden', desc: 'Silver (25th) or gold (50th) metallic palette with elegant serif typography.', specs: ['Metallic Paper', 'Foil', 'Min 25 cards'] },
      { id: 'photo', name: 'Photo Anniversary', desc: 'Couple photo with decorative frame border — personal and heartfelt.', specs: ['300gsm Gloss', 'Photo Print', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 25',  features: ['CMYK print', 'Rose palette', '300gsm stock', 'Envelope'] },
      { name: 'Premium', price: '₹16', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Photo printing', 'Gold foil', 'Textured stock', 'Custom envelope'] },
      { name: 'Luxury',  price: '₹30', unit: '/card', minQty: 'Min 50',  features: ['Multi-foil', 'Premium stock', 'Box packaging', 'Ribbon'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'naming-ceremony',
    group: 'invitations',
    name: 'Naming Ceremony Invitations',
    subtitle: 'Namakarana and naming function cards',
    heroLabel: 'New Life · Blessed · Joyful',
    desc: 'Namakarana and naming ceremony cards',
    description:
      'Welcome your little one with warmly designed naming ceremony invitation cards — baby cradle and peacock motifs, soft pastels, and Tamil or bilingual text printed on premium paper.',
    accentColor: '#6cc7e0',
    palette: 'pastel-blue',
    tone: 'festive',
    styles: [
      { id: 'cradle', name: 'Baby Cradle', desc: 'Adorable cradle illustration with flower garland border and soft palette.', specs: ['300gsm Matte', 'Full CMYK', 'Min 25 cards'] },
      { id: 'peacock', name: 'Peacock Blessing', desc: 'Peacock motif — sacred symbol of Murugan — with pastel teal and gold.', specs: ['300gsm Textured', 'Gold Foil', 'Min 25 cards'] },
      { id: 'stars', name: 'Stars & Moon', desc: 'Whimsical stars and moon design in soft lavender for a dreamy feel.', specs: ['300gsm Smooth', 'Soft-Touch', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹8',  unit: '/card', minQty: 'Min 25',  features: ['CMYK print', 'Pastel palette', '300gsm stock', 'Envelope'] },
      { name: 'Premium', price: '₹15', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Custom name typeset', 'Gold foil', 'Textured paper', 'Envelope'] },
      { name: 'Luxury',  price: '₹28', unit: '/card', minQty: 'Min 50',  features: ['Emboss + foil', 'Handmade paper', 'Gift packaging', 'Birth detail insert'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'temple-festival',
    group: 'invitations',
    name: 'Temple & Festival Event Cards',
    subtitle: 'Temple function and religious festival invitations',
    heroLabel: 'Divine · Sacred · Community',
    desc: 'Temple function and religious event invitation cards',
    description:
      'Dignified invitation cards for temple chariot festivals, puja functions, and religious community events — featuring temple gopuram illustrations, lotus motifs, and divine color palettes.',
    accentColor: '#c8960c',
    palette: 'gold-maroon',
    tone: 'festive',
    styles: [
      { id: 'gopuram', name: 'Temple Gopuram', desc: 'Illustrated temple tower with traditional border — majestic and community-appropriate.', specs: ['300gsm Matte', 'Full CMYK', 'Min 100 cards'] },
      { id: 'lotus', name: 'Lotus & Diyas', desc: 'Lotus flowers and diyas in gold and red — auspicious and universally devotional.', specs: ['300gsm Art', 'Gold Foil', 'Min 50 cards'] },
      { id: 'minimal', name: 'Simple & Dignified', desc: 'Clean layout, minimal iconography, suitable for all community functions.', specs: ['300gsm Smooth', 'CMYK', 'Min 100 cards'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹5',  unit: '/card', minQty: 'Min 100', features: ['Offset CMYK', 'Standard paper', '300gsm stock', 'No envelope'] },
      { name: 'Premium', price: '₹10', unit: '/card', minQty: 'Min 100', popular: true, features: ['Gold foil border', 'Art paper', '300gsm', 'Envelope'] },
      { name: 'Luxury',  price: '₹20', unit: '/card', minQty: 'Min 200', features: ['Emboss + foil', 'Premium stock', 'Temple art print', 'Envelope'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'funeral-memorial',
    group: 'invitations',
    name: 'Funeral & Memorial Cards',
    subtitle: 'Dignified memorial and condolence printing',
    heroLabel: 'Dignified · Thoughtful · Respectful',
    desc: 'Funeral notice and memorial card printing',
    description:
      'Thoughtfully designed memorial and funeral notice cards — printed with care, in muted and dignified palettes, to honour the memory of your loved one with the respect they deserve.',
    accentColor: '#8a8a9a',
    palette: 'memorial',
    tone: 'respectful',           // ← activates muted design mode
    styles: [
      { id: 'white-dove', name: 'White & Dove', desc: 'Pure white with grey border and a simple cross or Om symbol — universally respectful.', specs: ['300gsm Matte White', 'CMYK', 'Min 50 cards'] },
      { id: 'floral-grey', name: 'Floral Remembrance', desc: 'Soft grey background with white lily or rose illustration — gentle and dignified.', specs: ['300gsm Cream Matte', 'CMYK', 'Min 25 cards'] },
      { id: 'religious', name: 'Religious Tribute', desc: 'Customised with cross, crescent, Om, or other symbol per the family\'s faith.', specs: ['300gsm Smooth', 'Single color or CMYK', 'Min 25 cards'] },
    ],
    pricing: [
      { name: 'Standard', price: '₹5',  unit: '/card', minQty: 'Min 25',  features: ['Simple dignified layout', 'Black & white or muted color', '300gsm white matte', 'Envelope'] },
      { name: 'Premium',  price: '₹12', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Custom name & photo', 'Soft grey or cream palette', 'Matte premium stock', 'Envelope'] },
      { name: 'Tribute',  price: '₹22', unit: '/card', minQty: 'Min 50',  features: ['Portrait photo card', 'Life details printed', 'Premium matte paper', 'Envelope + insert'] },
    ],
    process: [
      { n: '1', title: 'Gentle Consultation', desc: 'We handle all details with care and discretion at your pace.' },
      { n: '2', title: 'Quick Proof', desc: 'Digital proof shared for approval before printing.' },
      { n: '3', title: 'Priority Printing', desc: 'Expedited printing for urgent requirements — same or next day.' },
      { n: '4', title: 'Discreet Delivery', desc: 'Carefully packed and delivered promptly.' },
    ],
  },

  // ═══════════════════════════════════════════
  // GROUP 2: FLEX & BANNERS
  // ═══════════════════════════════════════════

  {
    slug: 'flex-banner',
    group: 'flex',
    name: 'Flex Banners (Outdoor)',
    subtitle: 'Large-format eco-solvent outdoor printing',
    heroLabel: 'Bold · UV-Resistant · Any Size',
    desc: 'Large-format outdoor flex and vinyl printing',
    description:
      'Eye-catching outdoor flex banners printed with industrial-grade eco-solvent inks. UV-resistant for 3–5 year outdoor durability. Any size from shopfronts to stadium hoardings.',
    accentColor: '#00d4ff',
    palette: 'cyan-dark',
    tone: 'professional',
    styles: [
      { id: 'star-flex', name: 'Star Flex', desc: '280gsm star flex — the standard for all outdoor signage and shop boards.', specs: ['280gsm Star Flex', '1440 DPI', 'Any width'] },
      { id: 'backlit', name: 'Backlit Flex', desc: '440gsm backlit flex for illuminated sign boards and LED cabinets.', specs: ['440gsm Backlit Flex', 'LED-optimised', 'Any width'] },
      { id: 'vinyl', name: 'Vinyl Print', desc: 'Self-adhesive vinyl for walls, glass, and vehicle surfaces.', specs: ['120gsm Vinyl', 'Self-adhesive', 'Roll width'] },
    ],
    pricing: [
      { name: 'Star Flex',    price: '₹12', unit: '/sqft', minQty: 'Min 1 sqft', features: ['280gsm Star Flex', 'UV-resistant eco-sol inks', '1440 DPI print', 'Hemming & eyelets'] },
      { name: 'Backlit Flex', price: '₹22', unit: '/sqft', minQty: 'Min 1 sqft', popular: true, features: ['440gsm Backlit material', 'Vivid LED-optimised colors', 'Premium eco-sol inks', 'Hemming & eyelets'] },
      { name: 'Vinyl',        price: '₹18', unit: '/sqft', minQty: 'Min 2 sqft', features: ['120gsm self-adhesive', 'Outdoor grade', 'Precision cut', 'Application ready'] },
    ],
    process: [
      { n: '1', title: 'Size & Material', desc: 'Confirm dimensions, material type, and design requirements.' },
      { n: '2', title: 'Design Setup', desc: 'We prepare your artwork at correct DPI for large-format output.' },
      { n: '3', title: 'Print & Finish', desc: 'Printed at 1440 DPI, hemmed and eyeleted as required.' },
      { n: '4', title: 'Collection / Delivery', desc: 'Rolled and delivered — installation team available for hoardings.' },
    ],
  },

  {
    slug: 'wedding-flex',
    group: 'flex',
    name: 'Wedding Flex Backdrop',
    subtitle: 'Stage backdrops and wedding hall flex printing',
    heroLabel: 'Grand · Vibrant · Photo-Perfect',
    desc: 'Wedding stage backdrop and hall flex printing',
    description:
      'Stunning wedding stage backdrops, mandap flex prints, and photo booth backdrops in full 1440 DPI color — designed to look spectacular in photographs.',
    accentColor: '#e8a020',
    palette: 'gold-dark',
    tone: 'festive',
    styles: [
      { id: 'floral-stage', name: 'Floral Stage Backdrop', desc: 'Lush floral arch with gold details — perfect for wedding stage photography.', specs: ['440gsm Backlit Flex', '8×10 ft or custom', '1440 DPI'] },
      { id: 'royal', name: 'Royal Mandap', desc: 'Palace arch with pillars, drapes, and ornate gold border illustration.', specs: ['280gsm Star Flex', 'Any size', '1440 DPI'] },
      { id: 'modern', name: 'Modern Geometric', desc: 'Hexagonal gold pattern on white or dark background — contemporary chic.', specs: ['280gsm Star Flex', 'Any size', '1440 DPI'] },
    ],
    pricing: [
      { name: 'Standard',  price: '₹18', unit: '/sqft', minQty: 'Min 20 sqft', features: ['Star flex 280gsm', 'Custom design', '1440 DPI', 'Hemming & eyelets'] },
      { name: 'Backlit',   price: '₹25', unit: '/sqft', minQty: 'Min 20 sqft', popular: true, features: ['Backlit 440gsm', 'LED vivid colors', 'Premium output', 'Hemming & eyelets'] },
      { name: 'Premium',   price: '₹35', unit: '/sqft', minQty: 'Min 20 sqft', features: ['Premium vinyl', 'Seamless print', 'Installation support', 'Frame-ready'] },
    ],
    process: [
      { n: '1', title: 'Event Details', desc: 'Share stage dimensions, theme, and design references.' },
      { n: '2', title: 'Custom Design', desc: 'Our designers create a wedding-appropriate full backdrop artwork.' },
      { n: '3', title: 'Print & Quality Check', desc: 'Printed at full resolution and quality-inspected.' },
      { n: '4', title: 'Delivery', desc: 'Rolled and ready 24–48 hours before your event.' },
    ],
  },

  {
    slug: 'shop-opening',
    group: 'flex',
    name: 'Shop Opening Banners',
    subtitle: 'Grand opening and commercial signage printing',
    heroLabel: 'Bold · Commercial · High-Visibility',
    desc: 'Shop opening and commercial signage banners',
    description:
      'Make a powerful first impression with bright, bold shop opening banners and sign boards — designed for maximum visibility on busy streets, printed for outdoor durability.',
    accentColor: '#00d4ff',
    palette: 'cyan-dark',
    tone: 'professional',
    styles: [
      { id: 'grand-opening', name: 'Grand Opening', desc: '"Grand Opening" announcement banner with business branding and festive ribbon.', specs: ['Star Flex', 'Any size', '1440 DPI'] },
      { id: 'sign-board', name: 'Outdoor Sign Board', desc: 'Permanent outdoor sign board with UV-laminated flex on aluminum frame.', specs: ['Backlit Flex / Vinyl', 'Custom size', 'UV Laminated'] },
      { id: 'canopy', name: 'Canopy / Hoarding', desc: 'Large roof-mount hoarding or canopy flex for maximum street visibility.', specs: ['480gsm Heavy Flex', 'Large format', 'Wind-resistant'] },
    ],
    pricing: [
      { name: 'Banner',    price: '₹12', unit: '/sqft', minQty: 'Min 4 sqft',  features: ['Star flex', 'Any design', 'Eyelets', 'Same-day option'] },
      { name: 'Sign Board', price: '₹22', unit: '/sqft', minQty: 'Min 6 sqft',  popular: true, features: ['Backlit flex', 'UV lamination', 'Heavy-duty', 'Frame-ready'] },
      { name: 'Hoarding',  price: '₹16', unit: '/sqft', minQty: 'Min 50 sqft', features: ['480gsm heavy flex', 'Wind eyelets', 'Large format', 'Installation support'] },
    ],
    process: [
      { n: '1', title: 'Size & Location', desc: 'Measure your space and confirm visibility requirements.' },
      { n: '2', title: 'Design & Layout', desc: 'Professional commercial layout with your branding.' },
      { n: '3', title: 'Print', desc: 'High-impact colors, UV-resistant inks.' },
      { n: '4', title: 'Delivery', desc: 'Ready for collection or hoarding installation.' },
    ],
  },

  {
    slug: 'political-event',
    group: 'flex',
    name: 'Political & Public Event Flex',
    subtitle: 'Election campaign and public event printing',
    heroLabel: 'Large · Impactful · High-Reach',
    desc: 'Political campaign and public event flex printing',
    // ⚠️ Political disclaimer — rendered in CategoryPage when slug === 'political-event'
    disclaimer:
      'Note: During active election periods, all political printing is subject to applicable Election Commission of India guidelines and Model Code of Conduct restrictions. Compliance is the responsibility of the customer.',
    description:
      'High-impact large-format flex prints for political campaigns, public rallies, and community events — bold, readable designs at any scale from banners to full-building hoardings.',
    accentColor: '#4f8ef7',
    palette: 'blue-white',
    tone: 'professional',
    styles: [
      { id: 'campaign-banner', name: 'Campaign Banner', desc: 'Candidate portrait with bold party colors and slogan — high visibility on poles and walls.', specs: ['280gsm Star Flex', 'Any size', '1440 DPI'] },
      { id: 'rally-backdrop', name: 'Rally Stage Backdrop', desc: 'Large stage backdrop with speaker podium design and crowd-scale readability.', specs: ['440gsm Backlit / Star', 'Large format', '1440 DPI'] },
      { id: 'hoarding', name: 'Billboard / Hoarding', desc: 'Full building or roadside billboard flex with weatherproof inks.', specs: ['480gsm Heavy Flex', 'Any large size', 'Wind-resistant'] },
    ],
    pricing: [
      { name: 'Banner',   price: '₹12', unit: '/sqft', minQty: 'Min 4 sqft',  features: ['Star flex', 'Portrait print', 'Eyelets', 'UV inks'] },
      { name: 'Large',    price: '₹14', unit: '/sqft', minQty: 'Min 20 sqft', popular: true, features: ['Heavy flex', 'Bold colors', 'Weatherproof', 'Eyelets + hemming'] },
      { name: 'Hoarding', price: '₹16', unit: '/sqft', minQty: 'Min 50 sqft', features: ['480gsm heavy duty', 'Wind-resistant eyelets', 'Installation support', 'Bulk discount'] },
    ],
    process: [
      { n: '1', title: 'Brief', desc: 'Share candidate details, slogan, party colors, and dimensions.' },
      { n: '2', title: 'Design', desc: 'Layout at correct resolution for large-format readability.' },
      { n: '3', title: 'Print', desc: 'High-visibility colors, UV-resistant eco-solvent inks.' },
      { n: '4', title: 'Deliver', desc: 'Same-day or next-day for urgent campaign requirements.' },
    ],
  },

  {
    slug: 'rollup-banner',
    group: 'flex',
    name: 'Roll-up Standee Banners',
    subtitle: 'Exhibition standees and indoor roll-up display',
    heroLabel: 'Portable · Professional · Reusable',
    desc: 'Roll-up standee and exhibition display banners',
    description:
      'Portable, professional roll-up standee banners for exhibitions, trade fairs, reception desks, and corporate events — printed on premium vinyl with aluminium standee hardware.',
    accentColor: '#a855f7',
    palette: 'purple-dark',
    tone: 'professional',
    styles: [
      { id: 'standard', name: 'Standard Roll-up', desc: '85×200cm standard standee with single-sided print and aluminium base.', specs: ['85×200cm', 'Premium vinyl', 'Aluminium stand'] },
      { id: 'wide', name: 'Wide Roll-up', desc: '120×200cm wide-format standee — higher visual impact at events.', specs: ['120×200cm', 'Premium vinyl', 'Heavy-duty stand'] },
      { id: 'double-sided', name: 'Double-Sided', desc: 'Print visible from both sides — ideal for central aisle placement.', specs: ['85×200cm DS', 'Both sides printed', 'Premium stand'] },
    ],
    pricing: [
      { name: 'Standard',      price: '₹1,400', unit: '/unit', minQty: 'Min 1', features: ['85×200cm', 'Single-sided', 'Aluminium stand', 'Carry bag'] },
      { name: 'Wide',          price: '₹1,800', unit: '/unit', minQty: 'Min 1', popular: true, features: ['120×200cm', 'Single-sided', 'Heavy-duty stand', 'Carry bag'] },
      { name: 'Double-Sided',  price: '₹2,200', unit: '/unit', minQty: 'Min 1', features: ['85×200cm DS', 'Both sides', 'Premium stand', 'Carry bag'] },
    ],
    process: [
      { n: '1', title: 'Artwork', desc: 'Supply design at 85×200cm at 150 DPI, or we design for you.' },
      { n: '2', title: 'Print', desc: 'High-resolution vinyl print with vivid indoor colors.' },
      { n: '3', title: 'Assemble', desc: 'Mounted on standee hardware and tested.' },
      { n: '4', title: 'Ready', desc: 'Collected in carry bag — setup takes 60 seconds.' },
    ],
  },

  // ═══════════════════════════════════════════
  // GROUP 3: CARDS & STATIONERY
  // ═══════════════════════════════════════════

  {
    slug: 'greeting-card',
    group: 'cards',
    name: 'Greeting Cards',
    subtitle: 'Festivals, birthdays, and occasions',
    heroLabel: 'Festive · Personal · Premium',
    desc: 'Greeting cards for all festivals and occasions',
    description:
      'Beautiful custom greeting cards for Diwali, Pongal, Christmas, birthdays, and every special occasion — printed on premium stock with optional foil stamping and embossing.',
    accentColor: '#00ff94',
    palette: 'green-festive',
    tone: 'festive',
    styles: [
      { id: 'festival', name: 'Festival Themed', desc: 'Diwali diyas, Pongal kolam, Christmas trees — authentic festival artwork per occasion.', specs: ['300gsm Art Paper', 'Full CMYK', 'A5 or custom size'] },
      { id: 'photo', name: 'Photo Card', desc: 'Your own photo printed on premium card with decorative border — personalised and heartfelt.', specs: ['300gsm Gloss', 'Photo Print', 'Standard or A5'] },
      { id: 'corporate', name: 'Corporate Branded', desc: 'Professional branded greeting cards with your logo for business relationships.', specs: ['350gsm Matte', 'Logo Print', 'Min 50 cards'] },
    ],
    pricing: [
      { name: 'Classic',    price: '₹15', unit: '/card', minQty: 'Min 10',  features: ['CMYK offset', 'Standard design', '300gsm stock', 'Envelope'] },
      { name: 'Premium',    price: '₹28', unit: '/card', minQty: 'Min 10',  popular: true, features: ['Custom design', 'Foil/UV option', 'Premium stock', 'Envelope'] },
      { name: 'Corporate',  price: '₹12', unit: '/card', minQty: 'Min 100', features: ['Branded design', 'Bulk offset', 'Premium stock', 'Envelope'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'visiting-card',
    group: 'cards',
    name: 'Visiting / Business Cards',
    subtitle: 'Premium professional business cards',
    heroLabel: 'Professional · First Impression · Premium',
    desc: 'Premium visiting and business card printing',
    description:
      'Make a lasting first impression with premium visiting cards — matte, gloss, soft-touch, spot UV, and foil options on 350gsm and above. Standard, rounded corner, and die-cut shapes available.',
    accentColor: '#00ff94',
    palette: 'green-dark',
    tone: 'professional',
    styles: [
      { id: 'standard', name: 'Standard Matte/Gloss', desc: 'Classic 90×55mm card on 350gsm with matte or gloss lamination — crisp and professional.', specs: ['350gsm', 'Matte or Gloss Lam', '90×55mm'] },
      { id: 'soft-touch', name: 'Soft-Touch Velvet', desc: 'Premium velvet soft-touch lamination with spot UV accents — luxurious feel.', specs: ['400gsm', 'Soft-Touch + Spot UV', '90×55mm'] },
      { id: 'foil', name: 'Foil Stamped', desc: 'Gold or silver foil on name or logo — unmistakable premium impression.', specs: ['350gsm', 'Gold/Silver Foil', '90×55mm'] },
    ],
    pricing: [
      { name: 'Standard',  price: '₹1.50', unit: '/card', minQty: 'Min 100', features: ['350gsm paper', 'Matte or gloss lam', 'CMYK offset', 'Standard size'] },
      { name: 'Premium',   price: '₹3.00', unit: '/card', minQty: 'Min 50',  popular: true, features: ['400gsm stock', 'Soft-touch velvet', 'Spot UV', 'Rounded corners option'] },
      { name: 'Luxury',    price: '₹6.00', unit: '/card', minQty: 'Min 50',  features: ['400gsm+', 'Gold/silver foil', 'Emboss option', 'Die-cut available'] },
    ],
    process: [
      { n: '1', title: 'Design', desc: 'Supply your design or describe your profession for a custom layout.' },
      { n: '2', title: 'Proof', desc: 'PDF proof approved before print — get it right first time.' },
      { n: '3', title: 'Print & Finish', desc: 'Printed on premium stock with your chosen lamination and finish.' },
      { n: '4', title: 'Ready', desc: 'Ready in 1–2 working days. Collected or delivered.' },
    ],
  },

  {
    slug: 'thank-you-card',
    group: 'cards',
    name: 'Thank You Cards',
    subtitle: 'Gratitude and appreciation cards',
    heroLabel: 'Gracious · Heartfelt · Premium',
    desc: 'Custom thank you and appreciation cards',
    description:
      'Express genuine gratitude with elegantly designed thank you cards — for weddings, events, business, or personal use — printed on premium matte or gloss cardstock with optional foil or emboss.',
    accentColor: '#f59e42',
    palette: 'warm-gold',
    tone: 'festive',
    styles: [
      { id: 'floral', name: 'Floral Gratitude', desc: 'Delicate watercolor florals with graceful "Thank You" script — timeless and warm.', specs: ['300gsm Matte', 'Full CMYK', 'A6 or DL size'] },
      { id: 'minimal', name: 'Minimalist Elegant', desc: 'Clean white with gold script and a subtle line border — refined and corporate-friendly.', specs: ['350gsm Smooth', 'Gold Foil Text', 'A6 size'] },
      { id: 'photo', name: 'Photo Thank You', desc: 'Event or wedding photo with "Thank You" overlay — personal and memorable.', specs: ['300gsm Gloss', 'Photo Print', 'Standard size'] },
    ],
    pricing: [
      { name: 'Classic',  price: '₹10', unit: '/card', minQty: 'Min 25',  features: ['CMYK print', 'Warm design', '300gsm stock', 'Envelope'] },
      { name: 'Premium',  price: '₹20', unit: '/card', minQty: 'Min 25',  popular: true, features: ['Gold foil script', 'Premium paper', 'Soft-touch lam', 'Envelope'] },
      { name: 'Photo',    price: '₹18', unit: '/card', minQty: 'Min 25',  features: ['Photo print', 'Gloss finish', 'Custom text', 'Envelope'] },
    ],
    process: STANDARD_PROCESS,
  },

  {
    slug: 'menu-card',
    group: 'cards',
    name: 'Menu Cards',
    subtitle: 'Restaurant, hotel, and event menu printing',
    heroLabel: 'Professional · Appetising · Reusable',
    desc: 'Restaurant and event menu card printing',
    description:
      'Premium menu cards for restaurants, hotels, catering events, and wedding dinners — laminated for durability, or single-use for events. Custom sizes and fold options available.',
    accentColor: '#a855f7',
    palette: 'purple-dark',
    tone: 'professional',
    styles: [
      { id: 'laminated', name: 'Laminated Restaurant', desc: 'Durable gloss or matte laminated menu — wipe-clean, long-lasting for daily use.', specs: ['350gsm Gloss Lam', 'A4 or A5', 'Double-sided'] },
      { id: 'folded', name: 'Bi-fold / Tri-fold', desc: 'Folded menu card with multiple panels — ideal for larger menus and price lists.', specs: ['350gsm Matte', 'Bi or Tri-fold', 'Custom size'] },
      { id: 'event', name: 'Event Table Menu', desc: 'Single-use elegant event menu — luxury paper with gold or silver text for weddings.', specs: ['300gsm Textured', 'Gold Foil Text', 'A5 or tent-card'] },
    ],
    pricing: [
      { name: 'Standard',   price: '₹25', unit: '/menu', minQty: 'Min 20',  features: ['350gsm paper', 'Gloss or matte lam', 'Double-sided', 'A4 size'] },
      { name: 'Folded',     price: '₹35', unit: '/menu', minQty: 'Min 20',  popular: true, features: ['Bi-fold 350gsm', 'Matte lamination', 'Custom panel layout', 'Durable'] },
      { name: 'Event Gold', price: '₹45', unit: '/menu', minQty: 'Min 50',  features: ['Textured premium paper', 'Gold foil text', 'Event design', 'Elegant finish'] },
    ],
    process: [
      { n: '1', title: 'Content', desc: 'Supply menu items, prices, and any logo/branding materials.' },
      { n: '2', title: 'Layout Design', desc: 'Professional menu layout with appetising typography.' },
      { n: '3', title: 'Print & Laminate', desc: 'Printed and laminated for durability.' },
      { n: '4', title: 'Delivery', desc: 'Ready in 2–3 working days.' },
    ],
  },

  {
    slug: 'certificate',
    group: 'cards',
    name: 'Certificates',
    subtitle: 'Award, achievement, and appreciation certificates',
    heroLabel: 'Official · Prestigious · High-Quality',
    desc: 'Custom certificate and award printing',
    description:
      'Officially looking certificates for schools, colleges, corporate training, sports events, and community recognitions — printed on premium 120gsm or above certificate paper with optional gold border foil.',
    accentColor: '#c8960c',
    palette: 'gold-dark',
    tone: 'professional',
    styles: [
      { id: 'classic-gold', name: 'Classic Gold Border', desc: 'Traditional certificate layout with ornate gold border and premium cream stock.', specs: ['120gsm Certificate Paper', 'Gold Border', 'A4 size'] },
      { id: 'modern', name: 'Modern Corporate', desc: 'Clean, professional layout with your logo and minimal border — contemporary look.', specs: ['120gsm White', 'CMYK', 'A4 or custom'] },
      { id: 'foil', name: 'Gold Foil Premium', desc: 'Gold foil stamped border and title — prestigious and memorable for top awards.', specs: ['150gsm Premium', 'Gold Foil', 'A4 size'] },
    ],
    pricing: [
      { name: 'Standard',  price: '₹12', unit: '/cert', minQty: 'Min 10',  features: ['120gsm stock', 'Classic border', 'CMYK', 'Custom text'] },
      { name: 'Premium',   price: '₹25', unit: '/cert', minQty: 'Min 10',  popular: true, features: ['150gsm paper', 'Gold border print', 'Custom logo', 'A4 size'] },
      { name: 'Foil Gold', price: '₹45', unit: '/cert', minQty: 'Min 10',  features: ['150gsm premium', 'Gold foil title', 'Ornate border', 'Prestigious finish'] },
    ],
    process: [
      { n: '1', title: 'Details', desc: 'Supply organisation name, award title, and recipient fields.' },
      { n: '2', title: 'Design', desc: 'Professional certificate layout with your branding.' },
      { n: '3', title: 'Print', desc: 'High-resolution print on premium certificate paper.' },
      { n: '4', title: 'Delivery', desc: 'Ready in 1–2 days. Bulk orders 3–4 days.' },
    ],
  },

  // ═══════════════════════════════════════════
  // GROUP 4: BUSINESS & INSTITUTIONAL
  // ═══════════════════════════════════════════

  {
    slug: 'bill-book',
    group: 'business',
    name: 'Bill Books',
    subtitle: 'Customised bill and receipt book printing',
    heroLabel: 'Official · Carbonless · Reliable',
    desc: 'Custom bill book and receipt pad printing',
    description:
      'Professional bill books and receipt pads with your business name, GST number, and logo — available in single-part, duplicate (carbonless), and triplicate. Any size, any quantity.',
    accentColor: '#a855f7',
    palette: 'purple-dark',
    tone: 'professional',
    styles: [
      { id: 'duplicate', name: 'Duplicate Carbonless', desc: '50-leaf duplicate (NCR) bill book — white + yellow carbonless copy, no messy carbon paper.', specs: ['NCR 2-part', '50 leaves/book', 'A5 or custom'] },
      { id: 'triplicate', name: 'Triplicate NCR', desc: '50-leaf triplicate — white + yellow + pink, for businesses needing 3 copies.', specs: ['NCR 3-part', '50 leaves/book', 'A5 or custom'] },
      { id: 'single', name: 'Single-Part Booklet', desc: 'Single-part bill book with serial numbers and perforation — for digital billing shops.', specs: ['80gsm white', 'Numbered', 'A5 or custom'] },
    ],
    pricing: [
      { name: 'Single-Part',   price: '₹80',  unit: '/book', minQty: 'Min 10 books', features: ['80gsm paper', 'Serial numbered', 'Perforation', 'Your logo + GST'] },
      { name: 'Duplicate NCR', price: '₹140', unit: '/book', minQty: 'Min 10 books', popular: true, features: ['NCR 2-part', '50 leaves', 'No carbon paper', 'Logo + GST + address'] },
      { name: 'Triplicate NCR', price: '₹190', unit: '/book', minQty: 'Min 10 books', features: ['NCR 3-part', '50 leaves', '3 colour copies', 'Full business details'] },
    ],
    process: [
      { n: '1', title: 'Business Details', desc: 'Supply business name, GST number, address, and logo.' },
      { n: '2', title: 'Layout', desc: 'Layout approved via PDF proof — columns, fields, serial range.' },
      { n: '3', title: 'Print & Bind', desc: 'Printed, padded, and bound with cardboard back.' },
      { n: '4', title: 'Ready', desc: 'Typically ready in 2–3 working days.' },
    ],
  },

  {
    slug: 'corporate-event',
    group: 'business',
    name: 'Corporate Event Printing',
    subtitle: 'Conference, seminar, and office event materials',
    heroLabel: 'Professional · Branded · Complete',
    desc: 'Corporate conference and event print materials',
    description:
      'Complete print package for corporate conferences, seminars, product launches, and office events — brochures, programs, name badges, standees, backdrops, and banners, all brand-consistent.',
    accentColor: '#a855f7',
    palette: 'purple-dark',
    tone: 'professional',
    styles: [
      { id: 'conference', name: 'Conference Package', desc: 'Event program booklets, name badges, standees, and backdrop for conferences.', specs: ['Multiple formats', 'Brand consistent', 'Bulk printing'] },
      { id: 'product-launch', name: 'Product Launch', desc: 'Brochures, display boards, standees, and banners for product launch events.', specs: ['Gloss premium finish', 'Full color', 'Event-ready'] },
      { id: 'branded', name: 'Corporate Branded Kit', desc: 'Letterheads, business cards, envelopes, and notepads — a complete branded stationery kit.', specs: ['Multiple items', 'Brand guideline match', 'Offset print'] },
    ],
    pricing: [
      { name: 'Basic',     price: 'Get a Quote', unit: '', minQty: 'Contact us', features: ['Brochures + standee', 'Brand consistent', 'A4 + large format', 'Quick turnaround'] },
      { name: 'Standard',  price: 'Get a Quote', unit: '', minQty: 'Contact us', popular: true, features: ['Full event kit', 'Multiple formats', 'Premium finish', 'Project managed'] },
      { name: 'Complete',  price: 'Get a Quote', unit: '', minQty: 'Contact us', features: ['End-to-end print', 'Design support', 'Priority delivery', 'Account managed'] },
    ],
    process: [
      { n: '1', title: 'Brief', desc: 'Share event details, quantities needed, and brand guidelines.' },
      { n: '2', title: 'Quote', desc: 'Itemised quote with timelines for each print element.' },
      { n: '3', title: 'Proofing', desc: 'All items proofed and approved before bulk print.' },
      { n: '4', title: 'Delivery', desc: 'Coordinated delivery before your event date.' },
    ],
  },

  {
    slug: 'school-college',
    group: 'business',
    name: 'School & College Event Printing',
    subtitle: 'Annual day, sports day, and institutional materials',
    heroLabel: 'Institutional · Impactful · Affordable',
    desc: 'School, college, and institutional event print materials',
    description:
      'High-quality, affordable print materials for schools and colleges — annual day banners, certificates, hall tickets, event programs, ID cards, and merit certificates in bulk.',
    accentColor: '#3b82f6',
    palette: 'blue-institutional',
    tone: 'professional',
    styles: [
      { id: 'annual-day', name: 'Annual Day Package', desc: 'Stage backdrop, programme booklet, and certificates for annual day events.', specs: ['Multiple formats', 'Institutional design', 'Bulk pricing'] },
      { id: 'sports', name: 'Sports Day Materials', desc: 'Banners, certificates, and participation cards for sports events.', specs: ['Flex + print combo', 'Any quantity', 'Quick turnaround'] },
      { id: 'stationery', name: 'Institutional Stationery', desc: 'Letterheads, ID cards, admit cards, and hall tickets with institution branding.', specs: ['Security features', 'Bulk', 'Fast delivery'] },
    ],
    pricing: [
      { name: 'Certificates', price: '₹8',  unit: '/cert', minQty: 'Min 50',  features: ['Gold border', 'Institutional design', 'Custom text fields', 'A4 size'] },
      { name: 'Event Bundle', price: 'Quote', unit: '',     minQty: 'Contact us', popular: true, features: ['Backdrop + programme', 'Certificates included', 'Bulk rates', 'Project managed'] },
      { name: 'Full Package', price: 'Quote', unit: '',     minQty: 'Contact us', features: ['All print materials', 'Design support', 'Priority delivery', 'Volume discount'] },
    ],
    process: [
      { n: '1', title: 'Requirements', desc: 'Share event name, date, quantities, and any design guidelines.' },
      { n: '2', title: 'Design', desc: 'Institutional-appropriate layouts proofed quickly.' },
      { n: '3', title: 'Bulk Print', desc: 'Efficient offset or digital print for any volume.' },
      { n: '4', title: 'Delivery', desc: 'On-time delivery before your event date.' },
    ],
  },

  {
    slug: 'custom-print',
    group: 'business',
    name: 'Other Custom Printing',
    subtitle: 'Any print requirement not listed above',
    heroLabel: 'Flexible · Custom · Any Format',
    desc: 'Custom and miscellaneous printing services',
    description:
      'If your requirement isn\'t listed above, we can still print it. Offset, digital, large-format, UV, emboss, foil — Sai Meera handles any print job. Contact us with your specs.',
    accentColor: '#6b7280',
    palette: 'neutral-dark',
    tone: 'professional',
    styles: [
      { id: 'offset', name: 'Offset Print — Any Format', desc: 'High-volume, cost-effective offset printing for any format or size.', specs: ['Any paper type', 'Any quantity', 'CMYK or Pantone'] },
      { id: 'digital', name: 'Digital / Short Run', desc: 'Low minimum quantities via digital print — ideal for samples and small batches.', specs: ['Min 1 piece', 'Any size', 'Full color'] },
      { id: 'specialty', name: 'Specialty Finishing', desc: 'UV coating, spot UV, foil stamping, emboss, die-cut — any finishing on any print.', specs: ['Any base print', 'Specialty finish', 'Contact for quote'] },
    ],
    pricing: [
      { name: 'Digital',  price: 'Get a Quote', unit: '', minQty: 'Min 1 piece',   features: ['Any size', 'Full color', 'Quick turnaround', 'No plate cost'] },
      { name: 'Offset',   price: 'Get a Quote', unit: '', minQty: 'Min 500 pieces', popular: true, features: ['Any format', 'Cost-effective bulk', 'CMYK + Pantone', 'All papers'] },
      { name: 'Specialty', price: 'Get a Quote', unit: '', minQty: 'Contact us',    features: ['Foil / UV / emboss', 'Die-cut', 'Any base stock', 'Premium output'] },
    ],
    process: [
      { n: '1', title: 'Describe Your Job', desc: 'Tell us what you need — size, quantity, paper, finish, and deadline.' },
      { n: '2', title: 'Quote', desc: 'We\'ll quote within a few hours for any print job.' },
      { n: '3', title: 'Print', desc: 'Produced on the right press for your job type.' },
      { n: '4', title: 'Deliver', desc: 'On time, every time.' },
    ],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Get category by slug. Returns undefined for unknown slugs. */
export function getCategoryBySlug(slug) {
  return ALL_CATEGORIES.find((c) => c.slug === slug);
}

/** Get all categories in a group. */
export function getCategoriesByGroup(groupSlug) {
  return ALL_CATEGORIES.filter((c) => c.group === groupSlug);
}

// ─── Mega-menu structure (4 columns) ─────────────────────────────────────────

export const PRINT_SERVICES_MENU = [
  {
    group: 'Invitations & Ceremonies',
    groupSlug: 'invitations',
    accentColor: '#f5a623',
    // Show top 7 in mega-menu; the remaining 8 are via "View all" link
    items: [
      { name: 'Hindu Wedding',        to: '/products/hindu-wedding',      desc: 'Traditional Hindu ceremony' },
      { name: 'Muslim Nikah',         to: '/products/muslim-nikah',       desc: 'Islamic wedding cards' },
      { name: 'Christian Wedding',    to: '/products/christian-wedding',  desc: 'Church ceremony cards' },
      { name: 'Engagement',           to: '/products/engagement',         desc: 'Nichayathartham cards' },
      { name: 'Baby Shower',          to: '/products/baby-shower',        desc: 'Seemantham & baby cards' },
      { name: 'Valaikaapu',           to: '/products/valaikaapu',         desc: 'Bangle ceremony cards' },
      { name: 'Birthday',             to: '/products/birthday',           desc: 'Party & celebration' },
    ],
    moreCount: 8,
    moreLink: '/products?group=invitations',
  },
  {
    group: 'Flex & Banners',
    groupSlug: 'flex',
    accentColor: '#00d4ff',
    items: [
      { name: 'Flex Banners',         to: '/products/flex-banner',        desc: 'Outdoor star & backlit flex' },
      { name: 'Wedding Flex',         to: '/products/wedding-flex',       desc: 'Stage backdrops & mandap flex' },
      { name: 'Shop Opening',         to: '/products/shop-opening',       desc: 'Grand opening & sign boards' },
      { name: 'Political & Events',   to: '/products/political-event',    desc: 'Campaign & public flex' },
      { name: 'Roll-up Standees',     to: '/products/rollup-banner',      desc: 'Exhibition display banners' },
    ],
    moreCount: 0,
    moreLink: '/products?group=flex',
  },
  {
    group: 'Cards & Stationery',
    groupSlug: 'cards',
    accentColor: '#00ff94',
    items: [
      { name: 'Greeting Cards',       to: '/products/greeting-card',      desc: 'Festivals & occasions' },
      { name: 'Visiting Cards',       to: '/products/visiting-card',      desc: 'Premium business cards' },
      { name: 'Thank You Cards',      to: '/products/thank-you-card',     desc: 'Gratitude & appreciation' },
      { name: 'Menu Cards',           to: '/products/menu-card',          desc: 'Restaurant & event menus' },
      { name: 'Certificates',         to: '/products/certificate',        desc: 'Award & achievement certs' },
    ],
    moreCount: 0,
    moreLink: '/products?group=cards',
  },
  {
    group: 'Business & Institutional',
    groupSlug: 'business',
    accentColor: '#a855f7',
    items: [
      { name: 'Bill Books',           to: '/products/bill-book',          desc: 'NCR & carbonless books' },
      { name: 'Corporate Events',     to: '/products/corporate-event',    desc: 'Conference & seminar print' },
      { name: 'School & College',     to: '/products/school-college',     desc: 'Annual day & institutional' },
      { name: 'Custom Printing',      to: '/products/custom-print',       desc: 'Any format, any quantity' },
    ],
    moreCount: 0,
    moreLink: '/products?group=business',
  },
];
