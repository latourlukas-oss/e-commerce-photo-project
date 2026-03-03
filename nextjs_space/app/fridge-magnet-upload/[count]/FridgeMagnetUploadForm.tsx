'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, X, Check, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';

const FRIDGE_MAGNET_PRODUCT = {
  id: '3',
  name: 'Custom Fridge Magnet',
  description: 'Display your favorite moments on any magnetic surface. Upload your photos and we\'ll print your magnet set.',
  price: 9.99,
  imageUrl: '/products/fridge-magnet.jpg',
};

function uploadOne(file: File): Promise<{ url: string; key: string }> {
  return new Promise((resolve, reject) => {
    fetch('/api/upload/presigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name || 'image',
        contentType: file.type || 'image/jpeg',
        isPublic: true,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to get upload URL');
        return res.json();
      })
      .then(
        ({
          uploadUrl,
          cloud_storage_path,
        }: { uploadUrl: string; cloud_storage_path: string }) => {
          const urlParams = new URLSearchParams(uploadUrl?.split?.('?')?.[1] ?? '');
          const includesCd = urlParams
            ?.get?.('X-Amz-SignedHeaders')
            ?.includes?.('content-disposition');
          const headers: Record<string, string> = {
            'Content-Type': file.type || 'image/jpeg',
          };
          if (includesCd) headers['Content-Disposition'] = 'attachment';
          return fetch(uploadUrl, { method: 'PUT', headers, body: file }).then((uploadRes) => {
            if (!uploadRes?.ok) throw new Error('Upload failed');
            return fetch('/api/upload/url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cloud_storage_path, isPublic: true }),
            }).then((urlRes) => ({ urlRes, cloud_storage_path }));
          });
        }
      )
      .then(({ urlRes, cloud_storage_path }) => {
        if (!urlRes?.ok) throw new Error('Failed to get URL');
        return urlRes.json().then((data: { url: string }) =>
          resolve({ url: data.url, key: cloud_storage_path })
        );
      })
      .catch(reject);
  });
}

function clampCount(n: number): number {
  return Math.min(25, Math.max(1, Math.floor(n)));
}

export function FridgeMagnetUploadForm() {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();
  const count = clampCount(Number(params?.count) || 5);

  const [urls, setUrls] = useState<(string | null)[]>(() => Array(count).fill(null));
  const [keys, setKeys] = useState<string[]>(() => Array(count).fill(''));
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFile = useCallback(async (index: number, file: File | undefined) => {
    if (file == null) return;
    if (!file.type?.startsWith?.('image/')) {
      setError('Please use image files only');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Each image must be under 10MB');
      return;
    }
    setError(null);
    setUploadingIndex(index);
    try {
      const { url, key } = await uploadOne(file);
      setUrls((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
      setKeys((prev) => {
        const next = [...prev];
        next[index] = key;
        return next;
      });
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploadingIndex(null);
    }
  }, []);

  const remove = useCallback((index: number) => {
    setUrls((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setKeys((prev) => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
    const el = fileRefs.current[index];
    if (el) el.value = '';
  }, []);

  const allFilled = urls.every(Boolean);
  const handleAddToCart = () => {
    if (!allFilled) {
      setError('Please upload all ' + count + ' photos.');
      return;
    }
    const list = urls.filter(Boolean) as string[];
    const keyList = keys.filter(Boolean);
    addItem({
      productId: FRIDGE_MAGNET_PRODUCT.id,
      productName: FRIDGE_MAGNET_PRODUCT.name + ` (${count} photos)`,
      productImage: FRIDGE_MAGNET_PRODUCT.imageUrl,
      price: FRIDGE_MAGNET_PRODUCT.price,
      quantity: 1,
      uploadedPhotoUrls: list,
      uploadedPhotoKeys: keyList.length ? keyList : undefined,
    });
    setAdded(true);
    setTimeout(() => router.push('/cart'), 1200);
  };

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Upload {count} photo{count !== 1 ? 's' : ''} for your fridge magnets
        </h1>
        <p className="text-slate-600 mb-8">
          One image per magnet. We&apos;ll print and ship your set.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: count }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50"
            >
              <input
                ref={(el) => {
                  fileRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                id={`fridge-upload-${i}`}
                onChange={(e) => handleFile(i, e.target?.files?.[0])}
              />
              {urls[i] ? (
                <div className="relative w-full h-full group">
                  <img
                    src={urls[i]!}
                    alt={`Magnet ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                    {i + 1}
                  </span>
                </div>
              ) : (
                <label
                  htmlFor={`fridge-upload-${i}`}
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  {uploadingIndex === i ? (
                    <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">{i + 1}</span>
                    </>
                  )}
                </label>
              )}
            </motion.div>
          ))}
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!allFilled || added}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all ${
            added
              ? 'bg-green-500 text-white'
              : allFilled
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add Magnet Set to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
