import React from 'react';
import { Helmet } from 'react-helmet-async';

// Sections in reference-image order
import HeroSection      from '../components/hero/HeroSection';
import LegacySection    from '../components/legacy/LegacySection';
import MachinesStrip    from '../components/machines/MachinesStrip';
import WhatWePrint      from '../components/showcases/WhatWePrint';
import FeaturedWork     from '../components/showcases/FeaturedWork';
import GalleryStrip     from '../components/showcases/GalleryStrip';
import DesignLab        from '../components/showcases/DesignLab';
import CtaBanner        from '../components/ui/CtaBanner';
import ContactSection   from '../components/contact/ContactSection';

// LOCKED: 3D machine scenes — DO NOT MODIFY
import MachineSection   from '../components/machines/MachineSection';
import OffsetPress      from '../scenes/OffsetPress';
import FlexPrinter      from '../scenes/FlexPrinter';
import PhotoshopStation from '../scenes/PhotoshopStation';
import HydraulicCutter  from '../scenes/HydraulicCutter';

import { useScrollChoreography } from '../hooks/useScrollChoreography';

export default function HomePage() {
  useScrollChoreography();

  return (
    <>
      <Helmet>
        <title>Sai Meera | Industrial Printing Excellence — Chennai</title>
        <meta name="description" content="Sai Meera: 60+ years of industrial printing in Chennai. Premium invitations, offset printing, large-format flex banners, and corporate stationery." />
        <meta name="keywords" content="industrial printing chennai, offset press, flex banner, premium invitations, wedding cards printing" />
      </Helmet>

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Legacy / About */}
      <LegacySection />

      {/* 3. Machines Summary Strip */}
      <MachinesStrip />

      {/* 4. What We Print */}
      <WhatWePrint />

      {/* ── LOCKED: 3D Interactive Machine Showcases ── */}
      {/* Machine 01: Flex Printer */}
      <MachineSection
        id="flex-sec"
        machineNumber="01"
        machineName="Large Format Eco-Solvent Flex Printer"
        serialNumber="FX-3200-PRO"
        description="3.2m wide 8-colour CMYK+LC+LM+White+Varnish system. Piezo print heads with sub-picolitre droplet control."
        specs={[
          { label: '3200mm', value: 'Width' },
          { label: '1440 DPI', value: 'Resolution' },
          { label: 'UV Resist', value: 'Ink' },
          { label: '80 sqm/hr', value: 'Speed' }
        ]}
        accentColor="var(--cyan)"
        sceneComponent={FlexPrinter}
        cameraPosition={[6, 3.5, 9]}
        cameraFov={42}
        consoleLines={[
          'MEDIA: 440gsm PVC Flex',
          'INK: 8 Color Eco-Sol',
          'HEAD: PRINTING...',
          'TEMP: 42°C',
          'PASS: Bi-directional',
          'STATUS: PRINTING...'
        ]}
      />

      {/* Machine 02: Offset Press */}
      <MachineSection
        id="offset-sec"
        machineNumber="02"
        machineName="Industrial Offset Printing Press"
        serialNumber="OS-SM74-6C"
        description="6-unit CTP press with aluminium plates. 15,000 sheets/hour for cards, brochures, and premium packaging."
        specs={[
          { label: 'B1 Sheet', value: 'Format' },
          { label: '15K sph', value: 'Speed' },
          { label: '6-Color+UV', value: 'Output' },
          { label: 'Pantone', value: 'Color' }
        ]}
        accentColor="var(--orange)"
        sceneComponent={OffsetPress}
        customLighting={true}
        cameraPosition={[7.5, 5, 10]}
        cameraFov={42}
        consoleLines={[
          'PRESS: HeidelBerg SM74',
          'UNITS: 6 (CMYK+2 Spot)',
          'INKING: RUNNING',
          'LOCKS: Torque Loaded',
          'SPEED: 12,000 sph',
          'PLATES: CTP Aluminium',
          'STATUS: RUNNING ■'
        ]}
      />

      {/* Machine 03: Photoshop Workstation */}
      <MachineSection
        id="ps-sec"
        machineNumber="03"
        machineName="Photoshop Editing Workstation"
        serialNumber="WS-CINTIQ-PRO-24"
        description="Professional design workstation with dual monitors, Wacom Cintiq tablet, and RTX 4090 for real-time rendering."
        specs={[
          { label: 'Intel i9', value: 'CPU' },
          { label: '128 GB', value: 'RAM' },
          { label: 'RTX 4090', value: 'GPU' },
          { label: 'Pro Display', value: 'Monitor' }
        ]}
        accentColor="var(--green)"
        sceneComponent={PhotoshopStation}
        cameraPosition={[0, 4.8, 8]}
        cameraFov={42}
        consoleLines={[
          'DISPLAY: Adobe RGB (1998)',
          'RENDER: RTX 4090 Active',
          'WACOM: Cintiq Pro 24',
          'RAM: 96GB / 128GB',
          'SCRATCH: 2TB NVMe',
          'STATUS: RENDERING...'
        ]}
      />

      {/* Machine 04: Hydraulic Cutter */}
      <MachineSection
        id="cutter-sec"
        machineNumber="04"
        machineName="Hydraulic Guillotine Cutter"
        serialNumber="HC-920-PRO"
        description="920mm precision hydraulic cutter with programmable backgauge and laser alignment system."
        specs={[
          { label: '920mm', value: 'Cut Width' },
          { label: '±0.1mm', value: 'Precision' },
          { label: 'Hydraulic', value: 'Drive' },
          { label: '500 sph', value: 'Speed' }
        ]}
        accentColor="var(--cyan)"
        sceneComponent={HydraulicCutter}
        cameraPosition={[7, 4.5, 10]}
        cameraFov={42}
        consoleLines={[
          'HYDRAULIC: Pressurized',
          'BLADE: Home Position',
          'LASER: Aligned',
          'CLAMP: Engaged',
          'STACK: 500 Sheets',
          'STATUS: READY ■'
        ]}
      />
      {/* ── END LOCKED SECTION ── */}

      {/* 5. Featured Work (invitation split) */}
      <FeaturedWork />

      {/* 6. Gallery Strip */}
      <GalleryStrip />

      {/* 7. Design Lab */}
      <DesignLab />

      {/* 8. CTA Banner */}
      <CtaBanner />

      {/* 9. Contact */}
      <ContactSection />
    </>
  );
}
