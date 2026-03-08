/** Shared config for map plaque preview and picker (Transparent Tracks–style). */

export interface MapPrintData {
  lat: number;
  lng: number;
  zoom: number;
  searchQuery: string;
  /** Map outline shape (permanent on product) */
  mapShape?: 'square' | 'rectangle' | 'heart' | 'circle' | 'teardrop' | 'house';
  /** Map visual style */
  mapStyle?: 'standard' | 'light' | 'satellite' | 'streets';
  /** Main title printed on plaque (e.g. Happy Anniversary!) – max 19 chars */
  title?: string;
  /** Location label (e.g. Starbucks, Star Casino) – max 45 chars */
  locationTitle?: string;
  /** Date shown on plaque when includeDate is true */
  date?: string;
  includeDate?: boolean;
  showCoordinates?: boolean;
}

/** Default: Gold Coast (matches plaque photo) so map selection matches the left picture. */
export const MAP_DEFAULT_CENTER: [number, number] = [-27.9985041, 153.4227099];
export const MAP_DEFAULT_ZOOM = 15;

/** Map tile URLs by style (no API key). "streets" = OSM default, matches plaque reference (yellow roads, light blue water). */
export const MAP_TILE_STYLES = {
  streets: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  standard: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
} as const;

export const MAP_TILE_URL = MAP_TILE_STYLES.standard.url;
export const MAP_ATTRIBUTION = MAP_TILE_STYLES.standard.attribution;

/** Map window on the plaque photo (%). Picker uses same layout so selection matches the plaque. */
export const MAP_REGION = { top: 24, right: 11, bottom: 35, left: 11 };
/** Aspect ratio of the map window: width/height for picker to match plaque. */
export const MAP_WINDOW_ASPECT = (100 - 11 - 11) / (100 - 24 - 35);
