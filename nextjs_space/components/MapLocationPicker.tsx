'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  type MapPrintData,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_TILE_STYLES,
  MAP_WINDOW_ASPECT,
} from '@/lib/map-print';

export type { MapPrintData } from '@/lib/map-print';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'PeoplesPrint/1.0 (https://peoplesprint.com)';

interface MapLocationPickerProps {
  value: MapPrintData | null;
  onChange: (data: MapPrintData) => void;
  className?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

async function searchLocation(query: string): Promise<NominatimResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    limit: '5',
  });
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data;
}

export function MapLocationPicker({ value, onChange, className = '' }: MapLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof import('leaflet').map> | null>(null);
  const markerRef = useRef<ReturnType<typeof import('leaflet').marker> | null>(null);
  const searchQueryRef = useRef(value?.searchQuery ?? '');
  const [searchQuery, setSearchQuery] = useState(value?.searchQuery ?? '');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);

  searchQueryRef.current = searchQuery;

  const reportMapView = useCallback(
    (lat: number, lng: number, zoom: number, query: string) => {
      onChange({ ...value, lat, lng, zoom, searchQuery: query } as MapPrintData);
    },
    [onChange, value]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    let L: typeof import('leaflet');
    const init = async () => {
      L = (await import('leaflet')).default;
      if (!mapRef.current) return;

      // Red teardrop marker to match the plaque (left picture)
      const RedIcon = L.divIcon({
        className: 'red-pin-icon',
        html: '<div style="width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:24px solid #dc2626;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));margin-left:-12px;margin-top:-24px;"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const [lat, lng] = value
        ? [value.lat, value.lng]
        : MAP_DEFAULT_CENTER;
      const zoom = value?.zoom ?? MAP_DEFAULT_ZOOM;

      const map = L.map(mapRef.current).setView([lat, lng], zoom);
      const style = value?.mapStyle ?? 'streets';
      const { url, attribution } = MAP_TILE_STYLES[style];
      L.tileLayer(url, { attribution }).addTo(map);

      const marker = L.marker([lat, lng], { icon: RedIcon }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      map.on('moveend', () => {
        const center = map.getCenter();
        const z = map.getZoom();
        if (markerRef.current) markerRef.current.setLatLng([center.lat, center.lng]);
        reportMapView(center.lat, center.lng, z, searchQueryRef.current);
      });

      if (!value) {
        reportMapView(lat, lng, zoom, searchQueryRef.current);
      }
    };

    init();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, [mounted]);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchStatus('loading');
    try {
      const results = await searchLocation(q);
      if (results.length === 0) {
        setSearchStatus('error');
        return;
      }
      const first = results[0];
      const lat = parseFloat(first.lat);
      const lng = parseFloat(first.lon);
      setSearchStatus('idle');

      if (mapInstanceRef.current && markerRef.current) {
        const L = (await import('leaflet')).default;
        mapInstanceRef.current.setView([lat, lng], 14);
        markerRef.current.setLatLng([lat, lng]);
        reportMapView(lat, lng, 14, q);
      }
    } catch {
      setSearchStatus('error');
    }
  };

  return (
    <div className={className}>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for a place or address…"
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searchStatus === 'loading'}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {searchStatus === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </div>
      {searchStatus === 'error' && (
        <p className="text-sm text-amber-600 mb-2">No results. Try another search.</p>
      )}
      <p className="text-xs text-slate-500 mb-2">
        Pan and zoom the map to choose the exact area that will be printed.
      </p>
      <div
        ref={mapRef}
        className="w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md"
        style={{ aspectRatio: MAP_WINDOW_ASPECT, maxHeight: '320px', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}
      />
    </div>
  );
}
