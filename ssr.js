import { createServer } from 'vite';

async function run() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  const files = [
    '/src/components/hero/HeroSection.jsx',
    '/src/components/legacy/LegacySection.jsx',
    '/src/components/machines/MachinesStrip.jsx',
    '/src/components/showcases/WhatWePrint.jsx',
    '/src/components/showcases/FeaturedWork.jsx',
    '/src/components/showcases/GalleryStrip.jsx',
    '/src/components/showcases/DesignLab.jsx',
    '/src/components/showcases/TrustQuality.jsx',
    '/src/components/ui/CtaBanner.jsx',
    '/src/components/contact/ContactSection.jsx',
    '/src/hooks/useScrollChoreography.js'
  ];

  for (const file of files) {
    try {
      console.log("Loading", file, "...");
      await vite.ssrLoadModule(file);
      console.log("  OK");
    } catch (e) {
      console.error("  ERROR in", file, ":", e.message);
    }
  }
  
  process.exit();
}

run();
