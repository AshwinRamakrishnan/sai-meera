import * as THREE from 'three';

/**
 * Shared Three.js materials for all machine scenes.
 * Using factory functions to create fresh material instances.
 */

export const COLORS = {
  steel: '#2a2a3e',
  darkSteel: '#1a1a2e',
  chrome: '#8899aa',
  ink: '#04040a',
  cyan: '#00d4ff',
  magenta: '#ff0080',
  yellow: '#ffcc00',
  black: '#111111',
  gold: '#c9a84c',
  orange: '#ff6a00',
  green: '#00ff94',
  red: '#ff3366',
  white: '#f0ede8',
  warmWhite: '#fff5e6',
};

export function createMetalMaterial(color = COLORS.steel, opts = {}) {
  return {
    color,
    roughness: opts.roughness ?? 0.35,
    metalness: opts.metalness ?? 0.85,
    ...opts,
  };
}

export function createRubberMaterial(color = '#222222', opts = {}) {
  return {
    color,
    roughness: opts.roughness ?? 0.95,
    metalness: opts.metalness ?? 0.05,
    ...opts,
  };
}

export function createGlassMaterial(color = '#aaddff', opts = {}) {
  return {
    color,
    roughness: opts.roughness ?? 0.1,
    metalness: opts.metalness ?? 0.0,
    transparent: true,
    opacity: opts.opacity ?? 0.3,
    ...opts,
  };
}

export function createEmissiveMaterial(color = COLORS.cyan, opts = {}) {
  return {
    color,
    emissive: color,
    emissiveIntensity: opts.emissiveIntensity ?? 0.8,
    roughness: opts.roughness ?? 0.3,
    metalness: opts.metalness ?? 0.2,
    ...opts,
  };
}

export function createPaperMaterial(opts = {}) {
  return {
    color: COLORS.warmWhite,
    roughness: 0.9,
    metalness: 0.0,
    ...opts,
  };
}
