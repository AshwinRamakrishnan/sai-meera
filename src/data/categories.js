/**
 * Category configuration for all invitation types.
 * This is the single source of truth — no duplication across page components.
 * To add a new category: add one object here. Zero new files needed.
 */

export const INVITATION_CATEGORIES = {
  wedding: {
    slug: 'wedding',
    title: 'Wedding Invitations',
    subtitle: 'Traditional Tamil & South Indian Wedding Printing',
    heroLabel: 'Traditional · Premium · Timeless',
    description:
      'Exquisite wedding invitations in the grand South Indian tradition — ornate gold borders, auspicious Ganesha motifs, kolam-inspired borders, and elegant Tamil or English typography, printed on luxurious paper stocks.',
    accentColor: 'var(--gold)',
    palette: 'gold-maroon',
    styles: [
      {
        id: 'traditional-tamil',
        name: 'Traditional Tamil',
        desc: 'Ornate gold borders, auspicious Ganesha symbols, elegant Tamil typography honoring rich Dravidian traditions.',
        specs: ['300gsm Matte / Textured', 'Gold Foil Borders', 'Min 100 cards'],
      },
      {
        id: 'modern-fusion',
        name: 'Modern Fusion',
        desc: 'Contemporary typography with subtle kolam-inspired border motifs — tradition meets minimalism.',
        specs: ['350gsm Premium Cardstock', 'Soft-Touch Lamination', 'Min 50 cards'],
      },
      {
        id: 'luxury-foil',
        name: 'Luxury Foil Stamped',
        desc: 'Multi-layer gold and copper foil stamping with embossed relief on premium handmade paper.',
        specs: ['350gsm Suede Finish', 'Multi-foil & Die-cut', 'Min 200 cards'],
      },
    ],
    pricing: [
      { name: 'Classic', price: '₹8', unit: '/card', minQty: 'Min 100', features: ['Offset printing', 'Matte or gloss', '300gsm cardstock', 'Standard envelope'] },
      { name: 'Premium', price: '₹18', unit: '/card', minQty: 'Min 100', popular: true, features: ['Gold foil borders', 'Textured paper', '350gsm board', 'Custom envelope'] },
      { name: 'Luxury', price: '₹35', unit: '/card', minQty: 'Min 200', features: ['Multi-foil & emboss', 'Handmade paper', 'Box packaging', 'Custom inserts'] },
    ],
    process: [
      { n: '1', title: 'Design Consultation', desc: 'Discuss themes, script, colors, and content.' },
      { n: '2', title: 'Digital Proof', desc: 'Approve the digital proof before printing begins.' },
      { n: '3', title: 'Premium Print', desc: 'Offset or digital with foil and embossing options.' },
      { n: '4', title: 'Delivery', desc: 'Careful packaging, on-time delivery.' },
    ],
  },

  engagement: {
    slug: 'engagement',
    title: 'Engagement Invitations',
    subtitle: 'Elegant Nichayathartham & Ring Ceremony Cards',
    heroLabel: 'Elegant · Celebratory · Joyful',
    description:
      'Mark the auspicious Nichayathartham (formal engagement) with beautifully printed cards — vibrant floral motifs, rich jewel-tone palettes, and graceful Tamil or bilingual typography for this joyful milestone.',
    accentColor: '#d4608a',
    palette: 'pink-gold',
    styles: [
      {
        id: 'floral-classic',
        name: 'Floral Classic',
        desc: 'Lush floral borders in rose and marigold — cheerful, festive, perfect for a South Indian engagement.',
        specs: ['300gsm Art Paper', 'CMYK + Spot Color', 'Min 50 cards'],
      },
      {
        id: 'jewel-tone',
        name: 'Jewel Tone',
        desc: 'Deep ruby, sapphire, and emerald backgrounds with gold foil accents for a regal celebration.',
        specs: ['Premium Metallic Paper', 'Spot UV + Foil', 'Min 50 cards'],
      },
      {
        id: 'minimal-elegant',
        name: 'Minimalist Elegant',
        desc: 'Clean, modern layout with soft blush tones, delicate line-art borders, and serif typography.',
        specs: ['Heavyweight Cotton Paper', 'Letterpress', 'Min 25 cards'],
      },
    ],
    pricing: [
      { name: 'Classic', price: '₹8', unit: '/card', minQty: 'Min 50', features: ['Standard offset', 'Matte or gloss', '300gsm paper', 'White envelope'] },
      { name: 'Premium', price: '₹16', unit: '/card', minQty: 'Min 50', popular: true, features: ['Spot UV coating', 'Textured paper', 'Custom colors', 'Matching envelope'] },
      { name: 'Luxury', price: '₹30', unit: '/card', minQty: 'Min 100', features: ['Foil stamping', 'Velvet finish', 'Ribbon closure', 'Custom inserts'] },
    ],
    process: [
      { n: '1', title: 'Design Brief', desc: 'Share your date, venue, and preferred style.' },
      { n: '2', title: 'Proof Approval', desc: 'Review the digital layout in Tamil and English.' },
      { n: '3', title: 'Printing', desc: 'High-quality offset with finishing options.' },
      { n: '4', title: 'Delivery', desc: 'Packed with care, delivered on time.' },
    ],
  },

  'baby-shower': {
    slug: 'baby-shower',
    title: 'Baby Shower Invitations',
    subtitle: 'Sweet & Joyful Ithazhil Vizha Cards',
    heroLabel: 'Sweet · Warm · Celebratory',
    description:
      'Announce the most precious arrival with cheerful, warmly designed baby shower invitations — soft pastel palettes, adorable illustrated motifs, and heartfelt messages printed on premium stock.',
    accentColor: '#7bc8f5',
    palette: 'pastel-blue-pink',
    styles: [
      {
        id: 'pastel-sweet',
        name: 'Pastel Sweet',
        desc: 'Soft lavender, sky blue, and blush pink backgrounds with cute baby motifs and rounded typography.',
        specs: ['300gsm Matte Art', 'Full CMYK', 'Min 25 cards'],
      },
      {
        id: 'nature-garden',
        name: 'Nature & Garden',
        desc: 'Watercolor florals, butterflies, and leaves — organic and beautiful for a garden-themed shower.',
        specs: ['Textured Cream Paper', 'Soft-Touch Lam', 'Min 25 cards'],
      },
      {
        id: 'gender-neutral',
        name: 'Gender-Neutral Modern',
        desc: 'Clean geometric shapes, warm neutrals, and playful type — stylish regardless of gender reveal.',
        specs: ['300gsm Smooth White', 'Gloss Lamination', 'Min 25 cards'],
      },
    ],
    pricing: [
      { name: 'Classic', price: '₹10', unit: '/card', minQty: 'Min 25', features: ['Digital print', 'Vibrant colors', '300gsm stock', 'White envelope'] },
      { name: 'Premium', price: '₹18', unit: '/card', minQty: 'Min 25', popular: true, features: ['Custom illustration', 'Soft-touch finish', 'Pastel envelope', 'Insert card'] },
      { name: 'Luxury', price: '₹32', unit: '/card', minQty: 'Min 50', features: ['Foil accents', 'Handmade paper', 'Gift box packaging', 'Ribbon'] },
    ],
    process: [
      { n: '1', title: 'Theme Selection', desc: 'Pick your palette and motif style.' },
      { n: '2', title: 'Text Customization', desc: 'Your details typeset with care in Tamil or English.' },
      { n: '3', title: 'Premium Print', desc: 'Vibrant digital print on premium paper.' },
      { n: '4', title: 'Quick Delivery', desc: 'Ready in 3–5 working days.' },
    ],
  },

  valaikaapu: {
    slug: 'valaikaapu',
    title: 'Valaikaapu Invitations',
    subtitle: 'Traditional Bangle Ceremony Cards',
    heroLabel: 'Auspicious · Traditional · Sacred',
    description:
      'The Valaikaapu — Tamil Nadu\'s sacred bangle ceremony — deserves invitations as rich in tradition as the ritual itself. Our designs incorporate banana-leaf motifs, betel-leaf iconography, turmeric-yellow palettes, and kolam border patterns rooted in authentic South Indian visual culture.',
    accentColor: '#e8a020',
    palette: 'turmeric-green',
    styles: [
      {
        id: 'banana-leaf',
        name: 'Banana Leaf',
        desc: 'Deep green banana-leaf backgrounds with gold text — an authentic and auspicious visual rooted in Tamil tradition.',
        specs: ['300gsm Textured Matte', 'Gold Foil Text', 'Min 50 cards'],
      },
      {
        id: 'turmeric-kolam',
        name: 'Turmeric & Kolam',
        desc: 'Warm turmeric-yellow with hand-drawn kolam border patterns — vibrant, festive, and deeply Tamil.',
        specs: ['Premium Art Paper', 'Full CMYK + Gold', 'Min 50 cards'],
      },
      {
        id: 'betel-marigold',
        name: 'Betel & Marigold',
        desc: 'Betel-leaf and marigold garland motifs in a lush green-and-orange palette, evoking the warmth of the ceremony.',
        specs: ['Cream Textured Stock', 'Earthy Color Palette', 'Min 25 cards'],
      },
    ],
    pricing: [
      { name: 'Classic', price: '₹10', unit: '/card', minQty: 'Min 25', features: ['Traditional design', 'Tamil + English', '300gsm matte', 'Envelope'] },
      { name: 'Premium', price: '₹20', unit: '/card', minQty: 'Min 50', popular: true, features: ['Gold foil text', 'Textured stock', 'Banana leaf motif', 'Custom envelope'] },
      { name: 'Luxury', price: '₹38', unit: '/card', minQty: 'Min 100', features: ['Multi-foil', 'Handmade paper', 'Betel & kolam art', 'Gift packaging'] },
    ],
    process: [
      { n: '1', title: 'Cultural Brief', desc: 'Share ceremony details, family names, date, venue.' },
      { n: '2', title: 'Design with Intent', desc: 'We select motifs meaningful to Valaikaapu tradition.' },
      { n: '3', title: 'Print with Care', desc: 'Premium inks on authentic-feeling paper.' },
      { n: '4', title: 'Timely Delivery', desc: 'Packed in traditional style, delivered on time.' },
    ],
  },
};

/**
 * Ordered list of all categories for navigation and overview page rendering.
 */
export const INVITATION_CATEGORY_LIST = [
  INVITATION_CATEGORIES.wedding,
  INVITATION_CATEGORIES.engagement,
  INVITATION_CATEGORIES['baby-shower'],
  INVITATION_CATEGORIES.valaikaapu,
];

/**
 * Top-level "Print Services" mega-menu structure for Navbar.
 */
export const PRINT_SERVICES_MENU = [
  {
    group: 'Invitations',
    items: [
      { name: 'Wedding Invitations', to: '/invitations/wedding', desc: 'Traditional Tamil & South Indian' },
      { name: 'Engagement Invitations', to: '/invitations/engagement', desc: 'Nichayathartham cards' },
      { name: 'Baby Shower Invitations', to: '/invitations/baby-shower', desc: 'Ithazhil Vizha cards' },
      { name: 'Valaikaapu Invitations', to: '/invitations/valaikaapu', desc: 'Bangle ceremony cards' },
    ],
  },
  {
    group: 'Print & Display',
    items: [
      { name: 'Flex Banners', to: '/flex-banners', desc: 'Large-format outdoor printing' },
      { name: 'Greeting Cards', to: '/greeting-cards', desc: 'Festivals, birthdays & more' },
    ],
  },
];
