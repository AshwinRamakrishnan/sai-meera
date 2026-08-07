export const COLORS = {
  bgPrimary: '#0a0a0f', bgSecondary: '#111118', bgTertiary: '#1a1a25',
  cyan: '#00d4ff', gold: '#f5a623', green: '#00ff94', orange: '#ff6a00', red: '#ff3366', purple: '#a855f7',
  cmykC: '#00bcd4', cmykM: '#e91e63', cmykY: '#ffc107', cmykK: '#263238',
  white: '#f0ede8', gray: '#6a6a7a',
};
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 };
export const MACHINE_DATA = {
  offset: { name: 'Industrial Offset Printing Press', serial: 'OS-SM74-6C', specs: [{ label: '6-Unit CTP', value: 'B1 Sheet' }, { label: '15K sph', value: 'Speed' }, { label: '6-Color+UV', value: 'Config' }] },
  flex: { name: 'Large Format Eco-Solvent Flex Printer', serial: 'FX-3200-PRO', specs: [{ label: '3.2m', value: 'Width' }, { label: '1440 DPI', value: 'Resolution' }, { label: 'UV Resist', value: 'Ink' }, { label: '80 sqm/hr', value: 'Speed' }] },
  photoshop: { name: 'Photoshop Editing Workstation', serial: 'WS-CINTIQ-PRO-24', specs: [{ label: 'Intel i9', value: 'CPU' }, { label: '128 GB', value: 'RAM' }, { label: 'RTX 4090', value: 'GPU' }, { label: 'Pro Display', value: 'Monitor' }] },
  cutter: { name: 'Hydraulic Guillotine Cutter', serial: 'HC-920-PRO', specs: [{ label: '920mm', value: 'Cut Width' }, { label: '±0.1mm', value: 'Precision' }, { label: 'Hydraulic', value: 'Drive' }, { label: '500 sph', value: 'Speed' }] },
};
export const HERO_STATS = [
  { value: '1962', label: 'Founded' },
  { value: '60+', label: 'Years Legacy' },
  { value: '3.2m', label: 'Print Width' },
  { value: '1440', label: 'DPI Precision' },
];
export const SERVICES = [
  { id: '01', title: 'Flex Printing', description: 'Large format eco-solvent printing' },
  { id: '02', title: 'Offset Press', description: 'High-volume commercial printing' },
  { id: '03', title: 'Design Studio', description: 'Professional Photoshop editing' },
  { id: '04', title: 'Banner Printing', description: 'Indoor and outdoor banners' },
  { id: '05', title: 'Photo Frames', description: 'Canvas, acrylic, and metal frames' },
  { id: '06', title: 'Visiting Cards', description: 'Premium business cards' },
  { id: '07', title: 'Vinyl Printing', description: 'Adhesive vinyl for signage' },
  { id: '08', title: 'Sticker Printing', description: 'Custom die-cut stickers' },
];
