import { mockPlacesProvider } from './mockProvider';
import { mapboxPlacesProvider } from './mapboxProvider';
import type { PlacesProvider } from './types';

export * from './types';

const hasMapboxToken = Boolean(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

export const placesProvider: PlacesProvider = hasMapboxToken ? mapboxPlacesProvider : mockPlacesProvider;
