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
  const outerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof import('leaflet').map> | null>(null);
  const markerRef = useRef<ReturnType<typeof import('leaflet').marker> | null>(null);
  const searchQueryRef = useRef(value?.searchQuery ?? '');
  const [searchQuery, setSearchQuery] = useState(value?.searchQuery ?? '');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  searchQueryRef.current = searchQuery;

  const valueRef = useRef(value);
  valueRef.current = value;

  // Keep onChange in a ref so the map's moveend closure never goes stale
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const reportMapView = useCallback(
    (lat: number, lng: number, zoom: number, query: string) => {
      onChangeRef.current({ ...valueRef.current, lat, lng, zoom, searchQuery: query } as MapPrintData);
    },
    [] // stable — uses refs internally
  );

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7809/ingest/f3bbd371-ddfe-4a24-b817-997e43f05a2c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bde397'},body:JSON.stringify({sessionId:'bde397',location:'MapLocationPicker.tsx:effect',message:'MapLocationPicker effect fired',data:{hasOuter:!!outerRef.current,hasMap:!!mapInstanceRef.current},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    if (!outerRef.current || mapInstanceRef.current) return;

    // Create Leaflet container imperatively — React never reconciles inside it
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    outerRef.current.appendChild(container);

    const init = async () => {
      const L = (await import('leaflet')).default;
      if (!container.isConnected) return;

      const RedIcon = L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="#E53935"/><circle cx="14" cy="14" r="6" fill="white"/></svg>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });

      const [lat, lng] = valueRef.current
        ? [valueRef.current.lat, valueRef.current.lng]
        : MAP_DEFAULT_CENTER;
      const zoom = valueRef.current?.zoom ?? MAP_DEFAULT_ZOOM;

      const map = L.map(container).setView([lat, lng], zoom);
      const style = (valueRef.current?.mapStyle ?? 'classic') as keyof typeof MAP_TILE_STYLES;
      const { url, attribution } = MAP_TILE_STYLES[style];
      L.tileLayer(url, { attribution }).addTo(map);

      const marker = L.marker([lat, lng], { icon: RedIcon, zIndexOffset: 1000 }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      map.on('moveend', () => {
        const center = map.getCenter();
        const z = map.getZoom();
        if (markerRef.current) markerRef.current.setLatLng([center.lat, center.lng]);
        reportMapView(center.lat, center.lng, z, searchQueryRef.current);
      });

      reportMapView(lat, lng, zoom, searchQueryRef.current);
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch { /* ignore */ }
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
      try { container.remove(); } catch { /* ignore */ }
    };
  }, []); // runs once only — stable refs handle fresh values

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
        ref={outerRef}
        className="w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md"
        style={{ position: 'relative', aspectRatio: MAP_WINDOW_ASPECT, maxHeight: '320px', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}
      />
    </div>
  );
}
