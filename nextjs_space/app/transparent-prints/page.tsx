'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Moon, Music, ShoppingCart, Square, RectangleHorizontal, Heart, Circle, MapPinned, Home } from 'lucide-react';
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
  { id: 'Map', title: 'Map Plaque', icon: MapPin, description: 'Pin your special place and date' },
  { id: 'NightSky', title: 'Night Sky', icon: Moon, description: 'Date, time & location under the stars' },
  { id: 'Album', title: 'Album Cover', icon: Music, description: 'Upload photo + add your song' },
];

const SIZES = [
  { id: 'A5', label: 'A5', dims: '5.83" × 8.27"', price: 29.99 },
  { id: 'A4', label: 'A4', dims: '8.27" × 11.69"', price: 39.99 },
  { id: 'A3', label: 'A3', dims: '11.69" × 16.53"', price: 54.99 },
  { id: 'keychain', label: 'Keychain', dims: '1.77" × 2.56"', price: 12.99 },
];

export default function TransparentPrintsPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [productType, setProductType] = useState('Map');
  const [productSize, setProductSize] = useState('A5');
  const [mapPrintData, setMapPrintData] = useState<MapPrintData | null>(() => ({
    lat: MAP_DEFAULT_CENTER[0],
    lng: MAP_DEFAULT_CENTER[1],
    zoom: MAP_DEFAULT_ZOOM,
    searchQuery: '',
    mapShape: 'rectangle',
    mapStyle: 'streets',
  }));
  const [albumData, setAlbumData] = useState<AlbumPrintData>({
    photoUrl: null,
    songTitle: '',
    artist: '',
  });
  const [nightSkyData, setNightSkyData] = useState<NightSkyPrintData>({
    date: '',
    time: '',
    location: '',
  });

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
    if (productType === 'Map' && mapPrintData) {
      item.mapPrintData = mapPrintData;
    }
    if (productType === 'Album') {
      item.albumPrintData = albumData;
      if (albumData.photoUrl) item.uploadedPhotoUrl = albumData.photoUrl;
    }
    if (productType === 'NightSky') {
      item.nightSkyPrintData = nightSkyData;
    }
    addItem(item);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white" id="transparent-prints-page">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Choose your design – reference: design type tabs at top */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Choose your design</h2>
          <p className="text-slate-600 text-sm mb-4">Remember your favourite moments in a unique way.</p>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setProductType(id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  productType === id
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {title}
              </button>
            ))}
          </div>
        </section>

        {/* Two-column: Product on wooden block (Transparent Tracks layout) */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 mb-10">
          {/* Left: Product preview – wooden block + transparent plaque for selected design */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Preview</h2>
            <TransparentProductPreview
              productType={productType as 'Map' | 'Album' | 'NightSky'}
              mapPrintData={mapPrintData}
              albumData={albumData}
              nightSkyData={nightSkyData}
            />
          </div>

          {/* Right: Size + Design + Add to cart */}
          <div className="space-y-5">
            {/* Which size is right for you? */}
            <section className="border border-slate-200 rounded-xl p-4 bg-white">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Which size is right for you?</h2>
              <div className="space-y-2">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setProductSize(size.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      productSize === size.id
                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{size.label}</span>
                    <span className="text-slate-500 ml-2">({size.dims})</span>
                    <span className="float-right font-semibold text-slate-800">${size.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Design – Map / Night Sky / Album (Transparent Tracks–style) */}
            <section className="border border-slate-200 rounded-xl p-4 bg-white">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">Edit design</h2>
              {productType === 'Map' && (
                <>
                  <p className="text-slate-500 text-sm mb-3">Search location · Pan and zoom the map to set the exact area to print.</p>
                  <MapLocationPicker
                    value={mapPrintData}
                    onChange={setMapPrintData}
                  />
                  {/* Map Shape – permanent outline of the map on the product */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-600 mb-2">Map shape</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'square', label: 'Square', icon: Square },
                        { id: 'rectangle', label: 'Rectangle', icon: RectangleHorizontal },
                        { id: 'heart', label: 'Heart', icon: Heart },
                        { id: 'circle', label: 'Circle', icon: Circle },
                        { id: 'teardrop', label: 'Teardrop', icon: MapPinned },
                        { id: 'house', label: 'House', icon: Home },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setMapPrintData((d) => d ? { ...d, mapShape: id as MapPrintData['mapShape'] } : d)}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            mapPrintData?.mapShape === id || (!mapPrintData?.mapShape && id === 'rectangle')
                              ? 'border-teal-600 bg-teal-50 text-teal-800'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                          title={label}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Map Style */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-600 mb-2">Map style</label>
                    <div className="flex flex-wrap gap-2">
                      {(['streets', 'standard', 'light', 'satellite'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setMapPrintData((d) => d ? { ...d, mapStyle: style } : d)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm capitalize ${
                            (mapPrintData?.mapStyle ?? 'streets') === style
                              ? 'border-teal-600 bg-teal-50 text-teal-800'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Permanent text and options – stay on the printed product */}
                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-slate-600">Text & options on plaque</p>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Title (e.g. Happy Anniversary!) – max 19</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={mapPrintData?.title ?? ''}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, title: e.target.value } : d)}
                        placeholder="Happy Anniversary!"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Location title (e.g. Starbucks) – max 45</label>
                      <input
                        type="text"
                        maxLength={45}
                        value={mapPrintData?.locationTitle ?? ''}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, locationTitle: e.target.value } : d)}
                        placeholder="Starbucks, Star Casino"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="includeDate"
                        checked={mapPrintData?.includeDate ?? false}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, includeDate: e.target.checked } : d)}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor="includeDate" className="text-sm text-slate-600">Include date</label>
                    </div>
                    {mapPrintData?.includeDate && (
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Select date</label>
                        <input
                          type="date"
                          value={mapPrintData?.date ?? ''}
                          onChange={(e) => setMapPrintData((d) => d ? { ...d, date: e.target.value } : d)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showCoordinates"
                        checked={mapPrintData?.showCoordinates ?? false}
                        onChange={(e) => setMapPrintData((d) => d ? { ...d, showCoordinates: e.target.checked } : d)}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor="showCoordinates" className="text-sm text-slate-600">Show coordinates</label>
                    </div>
                  </div>
                </>
              )}
              {productType === 'NightSky' && (
                <div className="space-y-3">
                  <p className="text-slate-500 text-sm">Your special date, time & location under the stars.</p>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={nightSkyData.date}
                      onChange={(e) => setNightSkyData((d) => ({ ...d, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={nightSkyData.time}
                      onChange={(e) => setNightSkyData((d) => ({ ...d, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={nightSkyData.location}
                      onChange={(e) => setNightSkyData((d) => ({ ...d, location: e.target.value }))}
                      placeholder="e.g. Paris, France"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
              {productType === 'Album' && (
                <div className="space-y-3">
                  <p className="text-slate-500 text-sm">Upload your photo and enter your song.</p>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Song title</label>
                    <input
                      type="text"
                      value={albumData.songTitle}
                      onChange={(e) => setAlbumData((d) => ({ ...d, songTitle: e.target.value }))}
                      placeholder="e.g. Your Song"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Artist</label>
                    <input
                      type="text"
                      value={albumData.artist}
                      onChange={(e) => setAlbumData((d) => ({ ...d, artist: e.target.value }))}
                      placeholder="e.g. Artist name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Photo (URL for now)</label>
                    <input
                      type="url"
                      value={albumData.photoUrl || ''}
                      onChange={(e) => setAlbumData((d) => ({ ...d, photoUrl: e.target.value || null }))}
                      placeholder="https://… or leave empty"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Add to cart – reference style sticky block */}
            <div className="border-2 border-teal-200 rounded-xl p-5 bg-teal-50/50 lg:sticky lg:top-24">
              <p className="text-sm text-slate-600 mb-1">Size: <strong>{sizeInfo.label}</strong></p>
              <p className="text-2xl font-bold text-slate-800 mb-4">${sizeInfo.price.toFixed(2)}</p>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Link href="/cart" className="block text-center text-teal-600 hover:text-teal-700 font-medium text-sm mt-3">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
