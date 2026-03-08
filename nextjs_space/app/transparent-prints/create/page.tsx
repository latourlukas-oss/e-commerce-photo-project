'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Moon, Music, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { useRouter } from 'next/navigation';

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

export default function TransparentPrintsCreatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productType = searchParams.get('product_type') || 'Map';
  const productSize = searchParams.get('product_size') || 'A5';

  const typeInfo = PRODUCT_TYPES.find((t) => t.id === productType) ?? PRODUCT_TYPES[0];
  const sizeInfo = SIZES.find((s) => s.id === productSize) ?? SIZES[0];

  const handleAddToCart = () => {
    addItem({
      productId: `transparent-${productType}-${productSize}`,
      productName: `Custom ${typeInfo.title} (${sizeInfo.label})`,
      productImage: '/logo.png',
      price: sizeInfo.price,
      quantity: 1,
    });
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white" id="transparent-prints-create">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10 py-6">
        <Link
          href="/transparent-prints"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transparent Prints
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Create a plaque</h1>

        {/* Choose your design – type tabs */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Choose your design</h2>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map(({ id, title, icon: Icon }) => (
              <Link
                key={id}
                href={`/transparent-prints/create?product_type=${id}${productSize ? `&product_size=${productSize}` : ''}`}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  productType === id
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {title}
              </Link>
            ))}
          </div>
        </section>

        {/* Two-column layout: preview + options (Transparent Tracks style) */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 mb-12">
          {/* Left: Preview / canvas area */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Preview</h2>
              <div className="aspect-[3/4] max-h-[560px] bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8 text-slate-500">
                  <p className="font-medium text-slate-600 mb-1">{typeInfo.title}</p>
                  <p className="text-sm">{typeInfo.description}</p>
                  <p className="text-sm mt-2">{sizeInfo.label} — {sizeInfo.dims}</p>
                  <p className="text-xs mt-4">Customize options in the panel →</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Options panel */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Size */}
            <section className="border border-slate-200 rounded-xl p-5 bg-white">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Which size is right for you?</h2>
              <div className="space-y-2">
                {SIZES.map((size) => (
                  <Link
                    key={size.id}
                    href={`/transparent-prints/create?product_type=${productType}&product_size=${size.id}`}
                    className={`block px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      productSize === size.id
                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{size.label}</span>
                    <span className="text-slate-500 ml-2">({size.dims})</span>
                    <span className="float-right font-semibold text-slate-800">${size.price.toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Design options placeholder – type-specific */}
            <section className="border border-slate-200 rounded-xl p-5 bg-white">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Design</h2>
              <p className="text-slate-500 text-sm">
                {productType === 'Map' && 'Search location, adjust pin, map style and date — coming soon.'}
                {productType === 'NightSky' && 'Date, time, location and sky details — coming soon.'}
                {productType === 'Album' && 'Upload your photo and enter your song — coming soon.'}
              </p>
            </section>

            {/* Add to cart – sticky on desktop */}
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
              <Link
                href="/cart"
                className="block text-center text-teal-600 hover:text-teal-700 font-medium text-sm mt-3"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Trust line – Transparent Tracks style */}
        <p className="text-slate-500 text-sm text-center py-4 border-t border-slate-200">
          Clear sticky dots included to mount onto a wall. Free worldwide shipping.
        </p>
      </div>
    </div>
  );
}
