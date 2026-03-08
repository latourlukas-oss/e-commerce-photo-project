'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { MapPrintData } from '@/lib/map-print';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_TILE_STYLES,
  MAP_REGION,
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

/** Clip-path for the map area based on selected shape. */
function getMapShapeClipPath(shape: MapPrintData['mapShape']): React.CSSProperties {
  const s = shape ?? 'rectangle';
  switch (s) {
    case 'square':
      return { clipPath: 'inset(12.5% 0 12.5% 0)' };
    case 'circle':
      return { clipPath: 'circle(45% at 50% 50%)' };
    case 'heart':
      return { clipPath: 'path("M50 85 C20 55 5 30 25 12 C38 0 50 8 50 8 C50 8 62 0 75 12 C95 30 80 55 50 85 Z")' };
    case 'teardrop':
      return { clipPath: 'path("M50 0 C75 0 100 35 100 60 C100 85 75 100 50 100 C25 100 0 85 0 60 C0 35 25 0 50 0 Z")' };
    case 'house':
      return { clipPath: 'path("M50 0 L100 45 L100 100 L0 100 L0 45 Z")' };
    case 'rectangle':
    default:
      return {};
  }
}

function MapPlaqueContent({ mapPrintData }: { mapPrintData: MapPrintData | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import('leaflet').map> | null>(null);
  const dataRef = useRef(mapPrintData);
  dataRef.current = mapPrintData;

  useEffect(() => {
    if (!containerRef.current) return;
    let L: typeof import('leaflet');
    const init = async () => {
      L = (await import('leaflet')).default;
      if (!containerRef.current) return;
      const data = dataRef.current;
      const [lat, lng] = data ? [data.lat, data.lng] : MAP_DEFAULT_CENTER;
      const zoom = data?.zoom ?? MAP_DEFAULT_ZOOM;
      const style = data?.mapStyle ?? 'standard';
      const { url, attribution } = MAP_TILE_STYLES[style];
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
      mapRef.current = map;
      // Sync view to latest in case state changed during async init
      const latest = dataRef.current;
      if (latest) map.setView([latest.lat, latest.lng], latest.zoom ?? MAP_DEFAULT_ZOOM);
    };
    init();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapPrintData?.mapStyle]);

  // Keep preview map in sync with picker (pan/zoom) and redraw after container size changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapPrintData) return;
    const [lat, lng] = [mapPrintData.lat, mapPrintData.lng];
    const zoom = mapPrintData.zoom ?? MAP_DEFAULT_ZOOM;
    map.setView([lat, lng], zoom);
    map.invalidateSize();
  }, [mapPrintData?.lat, mapPrintData?.lng, mapPrintData?.zoom]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}

/** Your plaque photo only – no map overlay. */
const MAP_PHOTO_URL = '/products/map-plaque-photo.png?v=3';

function PhotoWithLiveMapOverlay({ mapPrintData }: { mapPrintData: MapPrintData | null }) {
  return (
    <div className="absolute inset-0">
      {/* Your full photo only – no overlay. */}
      <img
        src={MAP_PHOTO_URL}
        alt="Map plaque"
        className="absolute inset-0 w-full h-full object-contain object-center"
      />
    </div>
  );
}

/** Live plaque preview: map + title, date, location, coordinates from mapPrintData */
function LiveMapPlaquePreview({ mapPrintData }: { mapPrintData: MapPrintData | null }) {
  const d = mapPrintData;
  const lat = d?.lat ?? MAP_DEFAULT_CENTER[0];
  const lng = d?.lng ?? MAP_DEFAULT_CENTER[1];
  const title = (d?.title ?? '').trim() || 'Your title';
  const locationTitle = (d?.locationTitle ?? '').trim() || 'Location';
  const date = (d?.date ?? '').trim();
  const includeDate = d?.includeDate ?? false;
  const showCoordinates = d?.showCoordinates ?? false;
  const mapShape = d?.mapShape ?? 'rectangle';

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-slate-800">
      <div className="flex-shrink-0 pt-3 px-3 text-center">
        <div className="border-b border-slate-300 pb-1.5">
          <span className="text-lg font-semibold tracking-tight">{title}</span>
          <span className="ml-1 text-red-500" aria-hidden>❤</span>
        </div>
      </div>
      {includeDate && date && (
        <div className="flex-shrink-0 text-center text-sm font-bold text-slate-700 mt-1.5">
          {date}
        </div>
      )}
      <div
        className="flex-1 min-h-0 relative mt-2 mx-2 rounded overflow-hidden"
        style={getMapShapeClipPath(mapShape)}
      >
        <MapPlaqueContent mapPrintData={mapPrintData} />
      </div>
      <div className="flex-shrink-0 text-center text-sm font-bold text-slate-700 mt-2 px-2">
        {locationTitle}
      </div>
      {showCoordinates && (
        <div className="flex-shrink-0 text-center text-xs text-slate-500 mt-0.5 pb-2 font-mono">
          {lat.toFixed(7)}, {lng.toFixed(7)}
        </div>
      )}
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
    <div className={`overflow-hidden w-full ${className}`}>
      {/* Product only – as large as possible within layout without overlapping */}
      <div
        className="relative ml-0 mr-auto overflow-hidden w-full"
        style={{
          aspectRatio: '3/4',
          maxHeight: 'min(80vh, 900px)',
          maxWidth: '100%',
        }}
      >
          {productType === 'Map' && (
            <PhotoWithLiveMapOverlay mapPrintData={mapPrintData} />
          )}

          {productType === 'Album' && (
            <div className="absolute inset-0 flex flex-col bg-slate-100">
              <div className="flex-1 relative min-h-0">
                {albumData?.photoUrl ? (
                  <img
                    src={albumData.photoUrl}
                    alt="Album"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="text-sm">Your photo</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-800/90 text-white text-center">
                <p className="font-semibold truncate">{albumData?.songTitle || 'Your song'}</p>
                <p className="text-xs text-slate-300 truncate">{albumData?.artist || 'Artist'}</p>
              </div>
            </div>
          )}

          {productType === 'NightSky' && (
            <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
              {/* Simple star field */}
              <div className="absolute inset-0 opacity-80" style={{
                backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                  radial-gradient(2px 2px at 40% 70%, white, transparent),
                  radial-gradient(1px 1px at 50% 50%, white, transparent),
                  radial-gradient(2px 2px at 80% 10%, white, transparent),
                  radial-gradient(1px 1px at 90% 60%, white, transparent)`,
              }} />
              <div className="relative flex-1 flex flex-col items-center justify-center p-4 text-white/90 text-center">
                <p className="text-lg font-semibold">{nightSkyData?.date || 'Date'}</p>
                <p className="text-sm mt-1">{nightSkyData?.time || 'Time'}</p>
                <p className="text-sm mt-2 text-white/70">{nightSkyData?.location || 'Location'}</p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
