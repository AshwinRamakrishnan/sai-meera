import React from 'react';
import './FlexSectionLightBeam.css';

/* =========================================================================
   CINEMATIC CENTRAL VERTICAL LIGHT BEAM — PURE GOLD & OBSIDIAN
   Section 2 (immediately below Flex & Banners Hero)
   Matches Flex & Banners Reference:
     - Pure obsidian background
     - Warm radiant golden ambient glow
     - Luminous central vertical beam with champagne-white spine
     - Consistent black-and-gold visual treatment with zero purple
   ========================================================================= */

export default function FlexSectionLightBeam() {
  return (
    <div className="flex-section-beam-container" aria-hidden="true">
      {/* 1. Deep Black-to-Warm Obsidian Ambient Canvas */}
      <div className="flex-beam-ambient-canvas" />

      {/* 2. Soft Warm Golden Ambient Glow (Lower & Middle Aura) */}
      <div className="flex-beam-gold-aura" />

      {/* 3. Golden Corona Diffusion Field */}
      <div className="flex-beam-gold-corona" />

      {/* 4. Bright Central Vertical Light Beam / Column */}
      <div className="flex-beam-vertical-column">
        {/* Core intense specular champagne spine */}
        <div className="flex-beam-spine" />
        {/* Soft diffused flare cone */}
        <div className="flex-beam-flare-cone" />
      </div>

      {/* 5. Central Ethereal Origin Spotlight Bloom */}
      <div className="flex-beam-center-bloom" />

      {/* 6. Subtle Floor Grounding Shadow */}
      <div className="flex-beam-floor-shadow" />
    </div>
  );
}
