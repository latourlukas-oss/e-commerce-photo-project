'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

// ─── Calibration positions ────────────────────────────────────────────────────
// All values are fractions (0–1) of the plaque image (1024 × 694).
// Use the ⚙ Calibrate button on the page to drag/resize each region,
// then click "Copy to Code" and paste the new values here.
// Starting positions for the new clean plaque image (glass fills ~14%–86% wide, ~2%–80% tall).
// Use the ⚙ Calibrate button to drag/resize each box, then click "Copy to Code" and paste here.
export let PLAQUE_CAL = {
  title:    { left: 0.180, top: 0.030, width: 0.640, height: 0.130 },
  map:      { left: 0.140, top: 0.180, width: 0.720, height: 0.480 },
  location: { left: 0.180, top: 0.680, width: 0.640, height: 0.060 },
  date:     { left: 0.180, top: 0.740, width: 0.640, height: 0.050 },
  coords:   { left: 0.180, top: 0.790, width: 0.640, height: 0.040 },
};

// ─── Calibration overlay ──────────────────────────────────────────────────────

type RegionId = keyof typeof PLAQUE_CAL;
type Handle = 'move' | 'nw' | 'ne' | 'sw' | 'se';
type Region = { left: number; top: number; width: number; height: number };

const CAL_COLORS: Record<RegionId, string> = {
  title:    'rgba(251,146,60,0.35)',
  map:      'rgba(45,212,191,0.25)',
  location: 'rgba(74,222,128,0.35)',
  date:     'rgba(167,139,250,0.35)',
  coords:   'rgba(248,113,113,0.35)',
};
const CAL_BORDERS: Record<RegionId, string> = {
  title:    '#f97316',
  map:      '#0d9488',
  location: '#16a34a',
  date:     '#7c3aed',
  coords:   '#dc2626',
};

interface CalibrationOverlayProps {
  onClose: () => void;
  onUpdate: (positions: typeof PLAQUE_CAL) => void;
}

function CalibrationOverlay({ onClose, onUpdate }: CalibrationOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<typeof PLAQUE_CAL>({ ...PLAQUE_CAL });
  const activeDrag = useRef<{
    id: RegionId;
    handle: Handle;
    startMouse: { x: number; y: number };
    startRegion: Region;
  } | null>(null);

  const getRelPos = (e: MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  const onMouseDown = useCallback((id: RegionId, handle: Handle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current!.getBoundingClientRect();
    activeDrag.current = {
      id, handle,
      startMouse: { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height },
      startRegion: { ...positions[id] },
    };
  }, [positions]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!activeDrag.current || !containerRef.current) return;
      const { id, handle, startMouse, startRegion } = activeDrag.current;
      const cur = getRelPos(e);
      const dx = cur.x - startMouse.x;
      const dy = cur.y - startMouse.y;
      const MIN = 0.04;

      setPositions(prev => {
        const r = { ...startRegion };
        if (handle === 'move') {
          r.left = Math.max(0, Math.min(1 - startRegion.width, startRegion.left + dx));
          r.top  = Math.max(0, Math.min(1 - startRegion.height, startRegion.top + dy));
        } else if (handle === 'se') {
          r.width  = Math.max(MIN, startRegion.width + dx);
          r.height = Math.max(MIN, startRegion.height + dy);
        } else if (handle === 'sw') {
          r.left   = Math.max(0, startRegion.left + dx);
          r.width  = Math.max(MIN, startRegion.width - dx);
          r.height = Math.max(MIN, startRegion.height + dy);
        } else if (handle === 'nw') {
          r.left   = Math.max(0, startRegion.left + dx);
          r.top    = Math.max(0, startRegion.top + dy);
          r.width  = Math.max(MIN, startRegion.width - dx);
          r.height = Math.max(MIN, startRegion.height - dy);
        } else if (handle === 'ne') {
          r.top    = Math.max(0, startRegion.top + dy);
          r.width  = Math.max(MIN, startRegion.width + dx);
          r.height = Math.max(MIN, startRegion.height - dy);
        }
        const next = { ...prev, [id]: r };
        onUpdate(next);
        return next;
      });
    };

    const onUp = () => { activeDrag.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [onUpdate]);

  const copyToCode = () => {
    const fmt = (n: number) => n.toFixed(3);
    const lines = (Object.keys(positions) as RegionId[]).map(id => {
      const r = positions[id];
      return `  ${id.padEnd(8)}: { left: ${fmt(r.left)}, top: ${fmt(r.top)}, width: ${fmt(r.width)}, height: ${fmt(r.height)} },`;
    });
    const code = `export let PLAQUE_CAL = {\n${lines.join('\n')}\n};`;
    navigator.clipboard.writeText(code).then(() => alert('Copied! Paste into TransparentProductPreview.tsx'));
  };

  const handleSize = 10;

  return (
    <div ref={containerRef} className="absolute inset-0 z-30" style={{ cursor: 'default' }}>
      {(Object.keys(positions) as RegionId[]).map(id => {
        const r = positions[id];
        const border = CAL_BORDERS[id];
        const bg = CAL_COLORS[id];
        const hw = handleSize / 2;
        return (
          <div key={id} style={{
            position: 'absolute',
            left: `${r.left * 100}%`, top: `${r.top * 100}%`,
            width: `${r.width * 100}%`, height: `${r.height * 100}%`,
            border: `2px solid ${border}`, background: bg,
            boxSizing: 'border-box', userSelect: 'none',
          }}>
            {/* Move handle — whole box */}
            <div
              style={{ position: 'absolute', inset: 0, cursor: 'move' }}
              onMouseDown={e => onMouseDown(id, 'move', e)}
            />
            {/* Label */}
            <span style={{
              position: 'absolute', top: 2, left: 4,
              fontSize: 9, fontWeight: 700, color: border,
              pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: 1,
            }}>{id}</span>
            {/* Corner resize handles */}
            {(['nw', 'ne', 'sw', 'se'] as const).map(h => {
              const isN = h.startsWith('n'), isW = h.endsWith('w');
              return (
                <div key={h} onMouseDown={e => onMouseDown(id, h, e)} style={{
                  position: 'absolute',
                  top: isN ? -hw : undefined, bottom: isN ? undefined : -hw,
                  left: isW ? -hw : undefined, right: isW ? undefined : -hw,
                  width: handleSize, height: handleSize,
                  background: border, borderRadius: 2,
                  cursor: `${h}-resize`, zIndex: 10,
                }} />
              );
            })}
            {/* Value readout */}
            <span style={{
              position: 'absolute', bottom: 2, right: 4,
              fontSize: 8, color: border, pointerEvents: 'none',
              fontFamily: 'monospace',
            }}>
              {r.left.toFixed(2)},{r.top.toFixed(2)} {r.width.toFixed(2)}×{r.height.toFixed(2)}
            </span>
          </div>
        );
      })}
      {/* Control panel */}
      <div style={{
        position: 'absolute', bottom: -44, left: 0, right: 0,
        display: 'flex', gap: 8, justifyContent: 'center',
      }}>
        <button onClick={copyToCode} style={{
          padding: '4px 12px', background: '#0d9488', color: 'white',
          border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600,
        }}>Copy to Code</button>
        <button onClick={onClose} style={{
          padding: '4px 12px', background: '#64748b', color: 'white',
          border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer',
        }}>Done</button>
      </div>
    </div>
  );
}

// ─── Shape clip paths (SVG objectBoundingBox — scales to any size) ────────────

const SHAPE_CLIP_PATHS: Record<string, string> = {
  heart:    'M0.5,0.27 C0.5,0.16 0.36,0.05 0.25,0.05 C0.09,0.05 0,0.19 0,0.36 C0,0.62 0.25,0.8 0.5,1 C0.75,0.8 1,0.62 1,0.36 C1,0.19 0.91,0.05 0.75,0.05 C0.64,0.05 0.5,0.16 0.5,0.27 Z',
  teardrop: 'M0.5,1 C0.22,0.78 0.04,0.6 0.04,0.38 C0.04,0.15 0.25,0 0.5,0 C0.75,0 0.96,0.15 0.96,0.38 C0.96,0.6 0.78,0.78 0.5,1 Z',
  house:    'M0.5,0 L1,0.44 L0.84,0.44 L0.84,1 L0.16,1 L0.16,0.44 Z',
};

// ─── Pin marker SVGs ──────────────────────────────────────────────────────────

const PIN_SVGS: Record<string, string> = {
  pin: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="#E53935"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M16,28 C16,28 2,18 2,10 C2,5.5 5.5,2 10,3.5 C12.5,4.5 16,8 16,8 C16,8 19.5,4.5 22,3.5 C26.5,2 30,5.5 30,10 C30,18 16,28 16,28Z" fill="#E53935"/>
  </svg>`,
  lollipop: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="38" viewBox="0 0 24 38">
    <circle cx="12" cy="12" r="12" fill="#E53935"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
    <rect x="11" y="24" width="2" height="14" rx="1" fill="#E53935"/>
  </svg>`,
  house: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M16,2 L30,16 L25,16 L25,30 L19,30 L19,22 L13,22 L13,30 L7,30 L7,16 L2,16 Z" fill="#E53935"/>
  </svg>`,
  thumbtack: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <circle cx="14" cy="10" r="10" fill="#E53935"/>
    <circle cx="14" cy="10" r="4" fill="white"/>
    <rect x="12.5" y="20" width="3" height="16" rx="1.5" fill="#E53935"/>
  </svg>`,
};

// ─── Live map tile ─────────────────────────────────────────────────────────────

interface LiveMapTileProps { mapPrintData: MapPrintData | null; }

// Hardcoded icon sizes to avoid DOMParser in init
const PIN_SIZES: Record<string, [number, number]> = {
  pin: [28, 36], heart: [32, 32], lollipop: [24, 38], house: [32, 32], thumbtack: [28, 36],
};

function LiveMapTile({ mapPrintData }: LiveMapTileProps) {
  // outerRef is the React-managed div — React never touches its children
  const outerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import('leaflet').map> | null>(null);
  const tileLayerRef = useRef<ReturnType<typeof import('leaflet').tileLayer> | null>(null);
  const markerRef = useRef<ReturnType<typeof import('leaflet').marker> | null>(null);
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const dataRef = useRef(mapPrintData);
  dataRef.current = mapPrintData;

  // Create Leaflet container imperatively so React never reconciles its children
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7809/ingest/f3bbd371-ddfe-4a24-b817-997e43f05a2c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bde397'},body:JSON.stringify({sessionId:'bde397',location:'TransparentProductPreview.tsx:LiveMapTile-effect',message:'LiveMapTile effect fired',data:{hasOuter:!!outerRef.current,hasMap:!!mapRef.current},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    if (!outerRef.current || mapRef.current) return;

    // Create a plain div outside React's virtual DOM
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    outerRef.current.appendChild(container);
    leafletContainerRef.current = container;

    const init = async () => {
      const L = (await import('leaflet')).default;
      if (!container.isConnected) return;
      const d = dataRef.current;
      const [lat, lng] = d ? [d.lat, d.lng] : MAP_DEFAULT_CENTER;
      const zoom = d?.zoom ?? MAP_DEFAULT_ZOOM;
      const style = (d?.mapStyle ?? 'classic') as keyof typeof MAP_TILE_STYLES;
      const { url, attribution } = MAP_TILE_STYLES[style] ?? MAP_TILE_STYLES.classic;

      const map = L.map(container, {
        center: [lat, lng], zoom,
        zoomControl: false, dragging: false, scrollWheelZoom: false,
        doubleClickZoom: false, boxZoom: false, keyboard: false, attributionControl: false,
      });

      const tile = L.tileLayer(url, { attribution });
      tile.addTo(map);
      tileLayerRef.current = tile;

      mapRef.current = map;

      // Create initial marker
      const initPin = dataRef.current?.pinStyle ?? 'pin';
      if (initPin !== 'none') {
        const svgHtml = PIN_SVGS[initPin] ?? PIN_SVGS.pin;
        const [w, h] = PIN_SIZES[initPin] ?? [28, 36];
        const icon = L.divIcon({ className: '', html: svgHtml, iconSize: [w, h], iconAnchor: [w / 2, h] });
        const marker = L.marker([lat, lng], { icon });
        marker.addTo(map);
        markerRef.current = marker;
      }
      setTimeout(() => map.invalidateSize(), 0);
      setTimeout(() => map.invalidateSize(), 300);
    };

    init();

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7809/ingest/f3bbd371-ddfe-4a24-b817-997e43f05a2c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bde397'},body:JSON.stringify({sessionId:'bde397',location:'TransparentProductPreview.tsx:LiveMapTile-cleanup',message:'LiveMapTile cleanup fired',data:{hasMap:!!mapRef.current},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      markerRef.current = null;
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch { /* ignore */ }
        mapRef.current = null;
        tileLayerRef.current = null;
      }
      try { container.remove(); } catch { /* ignore */ }
      leafletContainerRef.current = null;
    };
  }, []); // runs once only

  // Update marker when pin style changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return; // map not ready yet — init() handles initial marker
    const update = async () => {
      const L = (await import('leaflet')).default;
      const d = dataRef.current;
      const [lat, lng] = d ? [d.lat, d.lng] : MAP_DEFAULT_CENTER;
      // Remove old marker
      if (markerRef.current) {
        try { map.removeLayer(markerRef.current); } catch { /* ignore */ }
        markerRef.current = null;
      }
      const pinStyle = d?.pinStyle ?? 'pin';
      if (pinStyle !== 'none') {
        const svgHtml = PIN_SVGS[pinStyle] ?? PIN_SVGS.pin;
        const [w, h] = PIN_SIZES[pinStyle] ?? [28, 36];
        const icon = L.divIcon({ className: '', html: svgHtml, iconSize: [w, h], iconAnchor: [w / 2, h] });
        const marker = L.marker([lat, lng], { icon });
        marker.addTo(map);
        markerRef.current = marker;
      }
    };
    update();
  }, [mapPrintData?.pinStyle]);

  // Swap tile layer on style change — no map destroy/recreate
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapPrintData?.mapStyle) return;
    const swap = async () => {
      const L = (await import('leaflet')).default;
      const style = mapPrintData.mapStyle as keyof typeof MAP_TILE_STYLES;
      const { url, attribution } = MAP_TILE_STYLES[style] ?? MAP_TILE_STYLES.classic;
      if (tileLayerRef.current) {
        try { map.removeLayer(tileLayerRef.current); } catch { /* ignore */ }
      }
      const tile = L.tileLayer(url, { attribution });
      tile.addTo(map);
      tileLayerRef.current = tile;
    };
    swap();
  }, [mapPrintData?.mapStyle]);

  // Pan/zoom and move marker on location or zoom change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapPrintData) return;
    map.setView([mapPrintData.lat, mapPrintData.lng], mapPrintData.zoom ?? MAP_DEFAULT_ZOOM, { animate: true, duration: 0.6 });
    map.invalidateSize();
    if (markerRef.current) {
      markerRef.current.setLatLng([mapPrintData.lat, mapPrintData.lng]);
    }
  }, [mapPrintData?.lat, mapPrintData?.lng, mapPrintData?.zoom]);

  // outerRef div has NO React children — React will never reconcile inside it
  return <div ref={outerRef} className="absolute inset-0 w-full h-full" />;
}

// ─── Map plaque preview ────────────────────────────────────────────────────────

const PLAQUE_ASPECT_PCT = (694 / 1024) * 100;

interface MapPlaquePreviewProps {
  mapPrintData: MapPrintData | null;
  showCalibration: boolean;
  onCalibrationUpdate: (positions: typeof PLAQUE_CAL) => void;
  onCalibrationClose: () => void;
  livePositions: typeof PLAQUE_CAL;
}

function MapPlaquePreview({
  mapPrintData, showCalibration, onCalibrationUpdate, onCalibrationClose, livePositions,
}: MapPlaquePreviewProps) {
  const cal = livePositions;

  const title = mapPrintData?.title ?? '';
  const heart = mapPrintData?.heartEnabled ? ' ♥' : '';
  const displayTitle = title + heart;
  const location = mapPrintData?.locationTitle ?? '';
  const date = mapPrintData?.includeDate ? (mapPrintData.date ?? '') : '';
  const coords = mapPrintData?.showCoordinates
    ? `${mapPrintData.lat?.toFixed(4) ?? ''}°, ${mapPrintData.lng?.toFixed(4) ?? ''}°`
    : '';

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: `${PLAQUE_ASPECT_PCT}%`, lineHeight: 0 }}>
      {/* Base plaque image */}
      <img
        src="/products/map-plaque-photo.png?v=8"
        alt="Map plaque"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', userSelect: 'none', pointerEvents: 'none' }}
      />

      {/* Shape clip SVG defs (objectBoundingBox = fraction-based, scales to any size) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {Object.entries(SHAPE_CLIP_PATHS).map(([id, d]) => (
            <clipPath key={id} id={`map-clip-${id}`} clipPathUnits="objectBoundingBox">
              <path d={d} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* Live map window */}
      {(() => {
        const shape = mapPrintData?.mapShape ?? 'rectangle';
        const needsSquare = shape === 'circle' || shape === 'square' || shape === 'heart';
        const hasClip = shape in SHAPE_CLIP_PATHS;

        // Image is 1024×694. cal values are fractions of image dimensions.
        // To get a square (equal pixels): find the largest square inside the cal rect, centred.
        const IMG_W = 1024, IMG_H = 694;
        let mLeft = cal.map.left, mTop = cal.map.top;
        let mWidth = cal.map.width, mHeight = cal.map.height;

        if (needsSquare) {
          const calWidthPx  = cal.map.width  * IMG_W;
          const calHeightPx = cal.map.height * IMG_H;
          const sidePx = Math.min(calWidthPx, calHeightPx);
          mWidth  = sidePx / IMG_W;
          mHeight = sidePx / IMG_H;
          // Centre within the calibrated area
          mLeft = cal.map.left + (cal.map.width  - mWidth)  / 2;
          mTop  = cal.map.top  + (cal.map.height - mHeight) / 2;
        }

        return (
          <div style={{
            position: 'absolute',
            left: `${mLeft * 100}%`, top: `${mTop * 100}%`,
            width: `${mWidth * 100}%`, height: `${mHeight * 100}%`,
            overflow: 'hidden', zIndex: 2,
            borderRadius: shape === 'circle' ? '50%' : 0,
            clipPath: hasClip ? `url(#map-clip-${shape})` : undefined,
          }}>
            <LiveMapTile mapPrintData={mapPrintData} />
          </div>
        );
      })()}

      {/* Title overlay */}
      {displayTitle && (
        <div style={{
          position: 'absolute',
          left: `${cal.title.left * 100}%`, top: `${cal.title.top * 100}%`,
          width: `${cal.title.width * 100}%`, height: `${cal.title.height * 100}%`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(12px, 2.4vw, 28px)',
            color: '#1a1a1a', fontWeight: 400, letterSpacing: '0.01em',
            textAlign: 'center', lineHeight: 1.2,
          }}>{displayTitle}</span>
        </div>
      )}

      {/* Location overlay */}
      {location && (
        <div style={{
          position: 'absolute',
          left: `${cal.location.left * 100}%`, top: `${cal.location.top * 100}%`,
          width: `${cal.location.width * 100}%`, height: `${cal.location.height * 100}%`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(9px, 1.4vw, 18px)',
            color: '#2a2a2a', textAlign: 'center',
          }}>{location}</span>
        </div>
      )}

      {/* Date overlay */}
      {date && (
        <div style={{
          position: 'absolute',
          left: `${cal.date.left * 100}%`, top: `${cal.date.top * 100}%`,
          width: `${cal.date.width * 100}%`, height: `${cal.date.height * 100}%`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(8px, 1.2vw, 16px)',
            color: '#2a2a2a', textAlign: 'center',
          }}>{date}</span>
        </div>
      )}

      {/* Coordinates overlay */}
      {coords && (
        <div style={{
          position: 'absolute',
          left: `${cal.coords.left * 100}%`, top: `${cal.coords.top * 100}%`,
          width: `${cal.coords.width * 100}%`, height: `${cal.coords.height * 100}%`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(7px, 1.0vw, 13px)',
            color: '#3a3a3a', textAlign: 'center', letterSpacing: '0.05em',
          }}>{coords}</span>
        </div>
      )}

      {/* Calibration overlay */}
      {showCalibration && (
        <CalibrationOverlay onClose={onCalibrationClose} onUpdate={onCalibrationUpdate} />
      )}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

interface TransparentProductPreviewProps {
  productType: ProductType;
  mapPrintData: MapPrintData | null;
  albumData: AlbumPrintData | null;
  nightSkyData: NightSkyPrintData | null;
  showCalibration?: boolean;
  onCalibrationClose?: () => void;
  className?: string;
}

export function TransparentProductPreview({
  productType, mapPrintData, albumData, nightSkyData,
  showCalibration = false, onCalibrationClose = () => {},
  className = '',
}: TransparentProductPreviewProps) {
  const [livePositions, setLivePositions] = useState<typeof PLAQUE_CAL>(() => ({ ...PLAQUE_CAL }));
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7809/ingest/f3bbd371-ddfe-4a24-b817-997e43f05a2c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bde397'},body:JSON.stringify({sessionId:'bde397',location:'TransparentProductPreview.tsx:mount',message:'TransparentProductPreview mounted',data:{productType},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    return () => { fetch('http://127.0.0.1:7809/ingest/f3bbd371-ddfe-4a24-b817-997e43f05a2c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bde397'},body:JSON.stringify({sessionId:'bde397',location:'TransparentProductPreview.tsx:unmount',message:'TransparentProductPreview UNMOUNTED',data:{productType},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{}); };
  }, []);
  // #endregion

  const handleCalUpdate = useCallback((positions: typeof PLAQUE_CAL) => {
    PLAQUE_CAL = positions;
    setLivePositions({ ...positions });
  }, []);

  return (
    <div className={`w-full bg-white ${className}`}>
      {productType === 'Map' && (
        <MapPlaquePreview
          mapPrintData={mapPrintData}
          showCalibration={showCalibration}
          onCalibrationUpdate={handleCalUpdate}
          onCalibrationClose={onCalibrationClose}
          livePositions={livePositions}
        />
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
