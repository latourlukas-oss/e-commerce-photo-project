'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Moon, Music, ShoppingCart, Square, RectangleHorizontal, Heart, Circle, MapPinned, Home, Plus, Minus, Search, Settings } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import type { MapPrintData } from '@/components/MapLocationPicker';
import type { AlbumPrintData, NightSkyPrintData } from '@/components/TransparentProductPreview';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@/lib/map-print';

const MapLocationPicker = dynamic(
  () => import('@/components/MapLocationPicker').then((m) => m.MapLocationPicker),
  { ssr: false }
);

const TransparentProductPreview = dynamic(
  () => import('@/components/TransparentProductPreview').then((m) => m.TransparentProductPreview),
  { ssr: false }
);

const PRODUCT_TYPES = [
  { id: 'Map',     title: 'Map Plaque',   icon: MapPin, description: 'Pin your special place and date' },
  { id: 'NightSky',title: 'Night Sky',    icon: Moon,   description: 'Date, time & location under the stars' },
  { id: 'Album',   title: 'Album Cover',  icon: Music,  description: 'Upload photo + add your song' },
];

const SIZES = [
  { id: 'A5',      label: 'A5',      dims: '5.83" × 8.27"',   price: 29.99 },
  { id: 'A4',      label: 'A4',      dims: '8.27" × 11.69"',  price: 39.99 },
  { id: 'A3',      label: 'A3',      dims: '11.69" × 16.53"', price: 54.99 },
  { id: 'keychain',label: 'Keychain',dims: '1.77" × 2.56"',   price: 12.99 },
];

const MAP_STYLES = [
  { id: 'classic',  label: 'Classic',  color: '#c8ddf0', desc: 'Google Maps style' },
  { id: 'voyager',  label: 'Voyager',  color: '#e8d5b0', desc: 'Warm tones' },
  { id: 'light',    label: 'Light',    color: '#e8edf0', desc: 'Minimal' },
  { id: 'satellite',label: 'Satellite',color: '#3a5a3a', desc: 'Aerial view' },
] as const;

const MAP_SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: RectangleHorizontal },
  { id: 'square',    label: 'Square',    icon: Square },
  { id: 'heart',     label: 'Heart',     icon: Heart },
  { id: 'circle',    label: 'Circle',    icon: Circle },
  { id: 'teardrop',  label: 'Teardrop',  icon: MapPinned },
  { id: 'house',     label: 'House',     icon: Home },
];

const TITLE_PRESETS = [
  'Where It Began',
  'Where It Started',
  'How It Began',
  'Where We Met',
];

const PIN_STYLES = [
  {
    id: 'pin', label: 'Pin',
    svg: <svg viewBox="0 0 28 36" className="w-6 h-7"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="#E53935"/><circle cx="14" cy="14" r="6" fill="white"/></svg>,
  },
  {
    id: 'heart', label: 'Heart',
    svg: <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M16,28 C16,28 2,18 2,10 C2,5.5 5.5,2 10,3.5 C12.5,4.5 16,8 16,8 C16,8 19.5,4.5 22,3.5 C26.5,2 30,5.5 30,10 C30,18 16,28 16,28Z" fill="#E53935"/></svg>,
  },
  {
    id: 'lollipop', label: 'Lollipop',
    svg: <svg viewBox="0 0 24 38" className="w-5 h-7"><circle cx="12" cy="12" r="12" fill="#E53935"/><circle cx="12" cy="12" r="5" fill="white"/><rect x="11" y="24" width="2" height="14" rx="1" fill="#E53935"/></svg>,
  },
  {
    id: 'house', label: 'House',
    svg: <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M16,2 L30,16 L25,16 L25,30 L19,30 L19,22 L13,22 L13,30 L7,30 L7,16 L2,16 Z" fill="#E53935"/></svg>,
  },
  {
    id: 'thumbtack', label: 'Tack',
    svg: <svg viewBox="0 0 28 36" className="w-6 h-7"><circle cx="14" cy="10" r="10" fill="#E53935"/><circle cx="14" cy="10" r="4" fill="white"/><rect x="12.5" y="20" width="3" height="16" rx="1.5" fill="#E53935"/></svg>,
  },
  {
    id: 'none', label: 'None',
    svg: <span className="text-slate-400 text-xs font-medium">—</span>,
  },
] as const;

export default function TransparentPrintsPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [productType, setProductType] = useState('Map');
  const [productSize, setProductSize] = useState('A5');
  const [editTab, setEditTab] = useState<'search' | 'adjust'>('search');
  const [showCalibration, setShowCalibration] = useState(false);

  const [mapPrintData, setMapPrintData] = useState<MapPrintData | null>(() => ({
    lat: MAP_DEFAULT_CENTER[0],
    lng: MAP_DEFAULT_CENTER[1],
    zoom: MAP_DEFAULT_ZOOM,
    searchQuery: '',
    mapShape: 'rectangle',
    mapStyle: 'classic',
  }));

  const [albumData, setAlbumData] = useState<AlbumPrintData>({ photoUrl: null, songTitle: '', artist: '' });
  const [nightSkyData, setNightSkyData] = useState<NightSkyPrintData>({ date: '', time: '', location: '' });

  const typeInfo = PRODUCT_TYPES.find((t) => t.id === productType) ?? PRODUCT_TYPES[0];
  const sizeInfo = SIZES.find((s) => s.id === productSize) ?? SIZES[0];

  const handleAddToCart = () => {
    const item: Parameters<typeof addItem>[0] = {
      productId: `transparent-${productType}-${productSize}`,
      productName: `Custom ${typeInfo.title} (${sizeInfo.label})`,
      productImage: '/logo.png',
      price: sizeInfo.price,
      quantity: 1,
    };
    if (productType === 'Map' && mapPrintData) item.mapPrintData = mapPrintData;
    if (productType === 'Album') {
      item.albumPrintData = albumData;
      if (albumData.photoUrl) item.uploadedPhotoUrl = albumData.photoUrl;
    }
    if (productType === 'NightSky') item.nightSkyPrintData = nightSkyData;
    addItem(item);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10 py-6">

        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Product type tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PRODUCT_TYPES.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setProductType(id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                productType === id
                  ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {title}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">

          {/* ── LEFT: sticky product preview ── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Preview</p>
              {productType === 'Map' && (
                <button
                  onClick={() => setShowCalibration(c => !c)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    showCalibration
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                  title="Toggle calibration overlay"
                >
                  <Settings className="w-3 h-3" /> Calibrate
                </button>
              )}
            </div>
            <div className={showCalibration ? 'mb-12' : ''}>
              <TransparentProductPreview
                productType={productType as 'Map' | 'Album' | 'NightSky'}
                mapPrintData={mapPrintData}
                albumData={albumData}
                nightSkyData={nightSkyData}
                showCalibration={showCalibration}
                onCalibrationClose={() => setShowCalibration(false)}
              />
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              Map data from © MapBox © OpenStreetMap
            </p>
          </div>

          {/* ── RIGHT: options ── */}
          <div className="space-y-4">

            {/* Size */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Which size is right for you?
              </h2>
              <div className="space-y-2">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setProductSize(size.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      productSize === size.id
                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>
                      <span className="font-bold">{size.label}</span>
                      <span className="text-slate-400 ml-2 font-normal">{size.dims}</span>
                    </span>
                    <span className="font-bold text-slate-800">${size.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Edit design */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Edit design</h2>

              {/* ── Map design ── */}
              {productType === 'Map' && (
                <div className="space-y-5">

                  {/* Tab: Search / Adjust Pin */}
                  <div>
                    <div className="flex rounded-xl bg-slate-100 p-1 gap-1 mb-3">
                      {(['search', 'adjust'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setEditTab(tab)}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                            editTab === tab
                              ? 'bg-white text-slate-800 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {tab === 'search' ? (
                            <span className="flex items-center justify-center gap-1.5">
                              <Search className="w-3.5 h-3.5" /> Search Location
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" /> Adjust Pin
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {editTab === 'search' && (
                      <MapLocationPicker value={mapPrintData} onChange={setMapPrintData} />
                    )}

                    {editTab === 'adjust' && (
                      <div className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-200 rounded-xl">
                        Pan the map on the left to adjust the pin position.
                      </div>
                    )}
                  </div>

                  {/* Map zoom */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Map Zoom</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMapPrintData((d) => d ? { ...d, zoom: Math.max(1, (d.zoom ?? MAP_DEFAULT_ZOOM) - 1) } : d)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 hover:border-teal-500 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-slate-600" />
                      </button>
                      <input
                        type="range"
                        min={3} max={18}
                        value={mapPrintData?.zoom ?? MAP_DEFAULT_ZOOM}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, zoom: Number(e.target.value) } : d)}
                        className="flex-1 accent-teal-600"
                      />
                      <button
                        onClick={() => setMapPrintData((d) => d ? { ...d, zoom: Math.min(18, (d.zoom ?? MAP_DEFAULT_ZOOM) + 1) } : d)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 hover:border-teal-500 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Map style swatches */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Map Style</label>
                    <div className="grid grid-cols-4 gap-2">
                      {MAP_STYLES.map(({ id, label, color }) => (
                        <button
                          key={id}
                          onClick={() => setMapPrintData((d) => d ? { ...d, mapStyle: id } : d)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl p-2 border-2 transition-all ${
                            (mapPrintData?.mapStyle ?? 'classic') === id
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-200/60"
                            style={{ background: color }}
                          />
                          <span className="text-[10px] font-medium text-slate-600 leading-none">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Map shape */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Map Shape</label>
                    <div className="grid grid-cols-6 gap-2">
                      {MAP_SHAPES.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setMapPrintData((d) => d ? { ...d, mapShape: id as MapPrintData['mapShape'] } : d)}
                          title={label}
                          className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all ${
                            (mapPrintData?.mapShape ?? 'rectangle') === id
                              ? 'border-teal-600 bg-teal-50 text-teal-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-500'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[9px] font-medium leading-none">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pin style */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Pin Style</label>
                    <div className="grid grid-cols-6 gap-2">
                      {PIN_STYLES.map(({ id, label, svg }) => (
                        <button
                          key={id}
                          onClick={() => setMapPrintData((d) => d ? { ...d, pinStyle: id as typeof PIN_STYLES[number]['id'] } : d)}
                          title={label}
                          className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl border-2 transition-all ${
                            (mapPrintData?.pinStyle ?? 'pin') === id
                              ? 'border-teal-600 bg-teal-50 text-teal-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-500'
                          }`}
                        >
                          <span className="flex items-center justify-center h-7">{svg}</span>
                          <span className="text-[9px] font-medium leading-none">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options: date, coordinates, title, location label */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Text on plaque</p>

                    <div>
                      <label className="block text-xs text-slate-500 mb-2">Title</label>
                      {/* Preset chips */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {TITLE_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setMapPrintData((d) => d ? { ...d, title: preset } : d)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                              mapPrintData?.title === preset
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                            }`}
                          >{preset}</button>
                        ))}
                      </div>
                      {/* Free-text input */}
                      <input
                        type="text"
                        maxLength={22}
                        value={mapPrintData?.title ?? ''}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, title: e.target.value } : d)}
                        placeholder="Or type your own…"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      {/* Heart toggle */}
                      <label className="flex items-center gap-3 cursor-pointer mt-2">
                        <div
                          onClick={() => setMapPrintData((d) => d ? { ...d, heartEnabled: !d.heartEnabled } : d)}
                          className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                            mapPrintData?.heartEnabled ? 'bg-rose-500' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            mapPrintData?.heartEnabled ? 'left-5' : 'left-0.5'
                          }`} />
                        </div>
                        <span className="text-sm text-slate-700 font-medium flex items-center gap-1">
                          Add heart <span className="text-rose-400">♥</span>
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Location label (max 45)</label>
                      <input
                        type="text"
                        maxLength={45}
                        value={mapPrintData?.locationTitle ?? ''}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, locationTitle: e.target.value } : d)}
                        placeholder="e.g. Gold Coast, Australia"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setMapPrintData((d) => d ? { ...d, includeDate: !d.includeDate } : d)}
                        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                          mapPrintData?.includeDate ? 'bg-teal-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          mapPrintData?.includeDate ? 'left-5' : 'left-0.5'
                        }`} />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">Include Date</span>
                    </label>

                    {mapPrintData?.includeDate && (
                      <input
                        type="date"
                        value={mapPrintData?.date ?? ''}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, date: e.target.value } : d)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setMapPrintData((d) => d ? { ...d, showCoordinates: !d.showCoordinates } : d)}
                        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                          mapPrintData?.showCoordinates ? 'bg-teal-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          mapPrintData?.showCoordinates ? 'left-5' : 'left-0.5'
                        }`} />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">Show Coordinates</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Night Sky */}
              {productType === 'NightSky' && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Capture the sky on your special date.</p>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                    <input type="date" value={nightSkyData.date}
                      onChange={(e) => setNightSkyData((d) => ({ ...d, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                    <input type="time" value={nightSkyData.time}
                      onChange={(e) => setNightSkyData((d) => ({ ...d, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                    <input type="text" value={nightSkyData.location}
                      onChange={(e) => setNightSkyData((d) => ({ ...d, location: e.target.value }))}
                      placeholder="e.g. Paris, France"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                </div>
              )}

              {/* Album */}
              {productType === 'Album' && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Upload a photo and add your song.</p>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Song title</label>
                    <input type="text" value={albumData.songTitle}
                      onChange={(e) => setAlbumData((d) => ({ ...d, songTitle: e.target.value }))}
                      placeholder="Your Song"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Artist</label>
                    <input type="text" value={albumData.artist}
                      onChange={(e) => setAlbumData((d) => ({ ...d, artist: e.target.value }))}
                      placeholder="Artist name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Photo URL</label>
                    <input type="url" value={albumData.photoUrl || ''}
                      onChange={(e) => setAlbumData((d) => ({ ...d, photoUrl: e.target.value || null }))}
                      placeholder="https://…"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="bg-white border-2 border-teal-200 rounded-2xl p-5 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm text-slate-500">Size: <strong className="text-slate-800">{sizeInfo.label}</strong></span>
                <span className="text-2xl font-bold text-slate-800">${sizeInfo.price.toFixed(2)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Link href="/cart" className="block text-center text-teal-600 hover:text-teal-700 text-sm font-medium mt-3">
                View Cart
              </Link>
              <p className="text-center text-xs text-slate-400 mt-3">
                Clear sticky dots included · Free worldwide shipping
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
