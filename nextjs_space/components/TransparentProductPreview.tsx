'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { MapPrintData } from '@/lib/map-print';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_TILE_STYLES,
} from '@/lib/map-print';

export interface AlbumPrintData {
  photoUrl: string | null;
  songTitle: string;
  artist: string;
}

export interface NightSkyPrintData {
  date: string;
  time: string;
  location: string;
}

type ProductType = 'Map' | 'Album' | 'NightSky';

interface TransparentProductPreviewProps {
  productType: ProductType;
  mapPrintData: MapPrintData | null;
  albumData: AlbumPrintData | null;
  nightSkyData: NightSkyPrintData | null;
  className?: string;
}

const LOCKED_MAP_WINDOW = {
  left: 0.3122,
  top: 0.3253,
  width: 0.3954,
  height: 0.3676,
};

interface LiveMapTileProps {
  mapPrintData: MapPrintData | null;
}

function LiveMapTile({ mapPrintData }: LiveMapTileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import('leaflet').map> | null>(null);
  const dataRef = useRef(mapPrintData);
  dataRef.current = mapPrintData;

  useEffect(() => {
    if (!containerRef.current) return;
    const init = async () => {
      const L = (await import('leaflet')).default;
      if (!containerRef.current) return;
      const d = dataRef.current;
      const [lat, lng] = d ? [d.lat, d.lng] : MAP_DEFAULT_CENTER;
      const zoom = d?.zoom ?? MAP_DEFAULT_ZOOM;
      const style = (d?.mapStyle ?? 'classic') as keyof typeof MAP_TILE_STYLES;
      const { url, attribution } = MAP_TILE_STYLES[style] ?? MAP_TILE_STYLES.classic;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      L.tileLayer(url, { attribution }).addTo(map);

      // Red Google Maps-style pin matching the plaque
      const redPin = L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
          <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="#E53935"/>
          <circle cx="14" cy="14" r="6" fill="white"/>
        </svg>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });
      L.marker([lat, lng], { icon: redPin }).addTo(map);

      mapRef.current = map;
      const latest = dataRef.current;
      if (latest) map.setView([latest.lat, latest.lng], latest.zoom ?? MAP_DEFAULT_ZOOM);
      // Force Leaflet to recalculate container size after React has painted
      setTimeout(() => map.invalidateSize(), 0);
      setTimeout(() => map.invalidateSize(), 300);
    };
    init();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapPrintData?.mapStyle]);

  // Pan/zoom live when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapPrintData) return;
    map.setView([mapPrintData.lat, mapPrintData.lng], mapPrintData.zoom ?? MAP_DEFAULT_ZOOM, {
      animate: true,
      duration: 0.6,
    });
    map.invalidateSize();
  }, [mapPrintData?.lat, mapPrintData?.lng, mapPrintData?.zoom]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}

// Image is 1024×694 → aspect = 694/1024 = 67.77%
// Using padding-bottom trick so the container has a real height before the image loads,
// which ensures Leaflet always initialises into a non-zero container.
const PLAQUE_ASPECT_PCT = (694 / 1024) * 100; // 67.7734375

function MapPlaquePreview({ mapPrintData }: { mapPrintData: MapPrintData | null }) {
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: `${PLAQUE_ASPECT_PCT}%`, lineHeight: 0 }}>
      <img
        src="/products/map-plaque-photo.png?v=7"
        alt="Map plaque"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Live map — pinned to the transparent glass window via CSS percentages.
          Because the container now has a real height (via padding-bottom),
          percentage top/height on absolute children resolve correctly. */}
      <div
        className="map-window-overlay map-window-clip"
        style={{
          position: 'absolute',
          left: `${LOCKED_MAP_WINDOW.left * 100}%`,
          top: `${LOCKED_MAP_WINDOW.top * 100}%`,
          width: `${LOCKED_MAP_WINDOW.width * 100}%`,
          height: `${LOCKED_MAP_WINDOW.height * 100}%`,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <LiveMapTile mapPrintData={mapPrintData} />
      </div>
    </div>
  );
}

export function TransparentProductPreview({
  productType,
  mapPrintData,
  albumData,
  nightSkyData,
  className = '',
}: TransparentProductPreviewProps) {
  return (
    <div className={`w-full bg-white ${className}`}>
      {productType === 'Map' && (
        <MapPlaquePreview mapPrintData={mapPrintData} />
      )}

      {productType === 'Album' && (
        <div className="relative flex flex-col bg-slate-100 rounded-xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <div className="flex-1 relative min-h-0">
            {albumData?.photoUrl ? (
              <img src={albumData.photoUrl} alt="Album" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Your photo</div>
            )}
          </div>
          <div className="p-3 bg-slate-800/90 text-white text-center">
            <p className="font-semibold truncate">{albumData?.songTitle || 'Your song'}</p>
            <p className="text-xs text-slate-300 truncate">{albumData?.artist || 'Artist'}</p>
          </div>
        </div>
      )}

      {productType === 'NightSky' && (
        <div className="relative flex flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <div className="absolute inset-0 opacity-70" style={{
            backgroundImage: `radial-gradient(1px 1px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 40% 70%, white, transparent),
              radial-gradient(1px 1px at 60% 20%, white, transparent),
              radial-gradient(2px 2px at 80% 10%, white, transparent),
              radial-gradient(1px 1px at 30% 80%, white, transparent)`,
          }} />
          <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-white/90 text-center">
            <p className="text-xl font-bold">{nightSkyData?.date || 'Your date'}</p>
            <p className="text-sm mt-1 opacity-80">{nightSkyData?.time || ''}</p>
            <p className="text-sm mt-2 opacity-70">{nightSkyData?.location || 'Your location'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
