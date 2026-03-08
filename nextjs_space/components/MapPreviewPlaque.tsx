'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { MapPrintData } from '@/lib/map-print';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_TILE_URL,
  MAP_ATTRIBUTION,
} from '@/lib/map-print';

interface MapPreviewPlaqueProps {
  /** Current map view (null = default world view so map is always visible) */
  mapPrintData: MapPrintData | null;
  className?: string;
}

export function MapPreviewPlaque({ mapPrintData, className = '' }: MapPreviewPlaqueProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import('leaflet').map> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let L: typeof import('leaflet');
    const init = async () => {
      L = (await import('leaflet')).default;
      if (!containerRef.current) return;

      const [lat, lng] = mapPrintData
        ? [mapPrintData.lat, mapPrintData.lng]
        : MAP_DEFAULT_CENTER;
      const zoom = mapPrintData?.zoom ?? MAP_DEFAULT_ZOOM;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: true,
      });
      L.tileLayer(MAP_TILE_URL, { attribution: MAP_ATTRIBUTION }).addTo(map);
      mapRef.current = map;
    };
    init();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync view when mapPrintData changes (instant preview update)
  useEffect(() => {
    if (!mapRef.current) return;
    const [lat, lng] = mapPrintData
      ? [mapPrintData.lat, mapPrintData.lng]
      : MAP_DEFAULT_CENTER;
    const zoom = mapPrintData?.zoom ?? MAP_DEFAULT_ZOOM;
    mapRef.current.setView([lat, lng], zoom);
  }, [mapPrintData?.lat, mapPrintData?.lng, mapPrintData?.zoom]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-white shadow-lg ring-1 ring-slate-200/50 ${className}`}
      style={{
        boxShadow: '0 0 0 1px rgba(0,0,0,.04), 0 4px 24px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6)',
      }}
    >
      <div className="aspect-[3/4] w-full max-h-[500px] min-h-[320px] relative">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>
      <p className="text-[10px] text-slate-400 px-2 py-1.5 text-center bg-slate-50/80 border-t border-slate-100">
        Map data © OpenStreetMap © CARTO
      </p>
    </div>
  );
}
