/** Shared config for map plaque preview and picker (Transparent Tracks–style). */

export interface MapPrintData {
  lat: number;
  lng: number;
  zoom: number;
  searchQuery: string;
  /** Map outline shape (permanent on product) */
  mapShape?: 'square' | 'rectangle' | 'heart' | 'circle' | 'teardrop' | 'house';
  /** Map visual style */
  mapStyle?: 'classic' | 'voyager' | 'light' | 'satellite';
  /** Main title printed on plaque (e.g. Happy Anniversary!) – max 19 chars */
  title?: string;
  /** Location label (e.g. Starbucks, Star Casino) – max 45 chars */
  locationTitle?: string;
  /** Date shown on plaque when includeDate is true */
  date?: string;
  includeDate?: boolean;
  showCoordinates?: boolean;
}

/** Default: Gold Coast, zoom 14 – matches the street-level detail shown in the plaque photo. */
export const MAP_DEFAULT_CENTER: [number, number] = [-27.9985041, 153.4227099];
export const MAP_DEFAULT_ZOOM = 14;

/**
 * Map tile styles. "classic" = ESRI World Street Map — closest free match to the
 * Google Maps-like style shown on the plaque (blue water, cream land, yellow roads).
 */
export const MAP_TILE_STYLES = {
  classic: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
  },
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
} as const;

export const MAP_TILE_URL = MAP_TILE_STYLES.classic.url;
export const MAP_ATTRIBUTION = MAP_TILE_STYLES.classic.attribution;

/** Map window on the plaque photo (%). Picker uses same layout so selection matches the plaque. */
export const MAP_REGION = { top: 24, right: 11, bottom: 35, left: 11 };
/** Aspect ratio of the map window: width/height for picker to match plaque. */
export const MAP_WINDOW_ASPECT = (100 - 11 - 11) / (100 - 24 - 35);
