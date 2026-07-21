// Live provider stub. Not wired up yet — EXPO_PUBLIC_MAPBOX_TOKEN is unset,
// so `getPlacesProvider()` in ./index.ts returns the mock provider instead.
//
// To go live:
//   1. `npm install @rnmapbox/maps` and run `npx expo prebuild` (native module,
//      not available in Expo Go).
//   2. Set EXPO_PUBLIC_MAPBOX_TOKEN in .env.
//   3. Implement search against Mapbox Search Box API for nearby restaurants
//      and a venue/class data source of your choice for activities (Mapbox
//      has no built-in fitness-class index — pair it with a provider like
//      ClassPass or a manually curated venue list).
//   4. Nutrition data for real restaurants still needs a source (e.g. a menu
//      database or your own estimates) — Mapbox only returns place/location
//      data, not nutrition.

import type { PlacesProvider } from './types';

export const mapboxPlacesProvider: PlacesProvider = {
  async searchNearbyMeals() {
    throw new Error('Mapbox places provider is not implemented yet. See comments in mapboxProvider.ts.');
  },
  async searchNearbyActivities() {
    throw new Error('Mapbox places provider is not implemented yet. See comments in mapboxProvider.ts.');
  },
};
