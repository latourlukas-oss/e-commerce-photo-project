'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, X, Check, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';

const CANVAS_PRODUCT = {
  id: '4',
  name: 'Premium Canvas Print',
  description: 'Gallery-quality canvas prints for your walls. Stretched on solid wood frames.',
  price: 49.99,
  imageUrl: '/products/canvas.jpg',
};

const SIZE_LABELS: Record<string, string> = {
  '8x10': '8" × 10"',
  '11x14': '11" × 14"',
  '12x16': '12" × 16"',
  '16x20': '16" × 20"',
  '18x24': '18" × 24"',
  '20x24': '20" × 24"',
  '24x36': '24" × 36"',
};

const VALID_SIZES = Object.keys(SIZE_LABELS);

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

export function CanvasPrintUploadForm() {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();
  const sizeSlug = (params?.size as string) || '16x20';
  const sizeValid = VALID_SIZES.includes(sizeSlug);
  const sizeSlugSafe = sizeValid ? sizeSlug : '16x20';
  const sizeLabel = SIZE_LABELS[sizeSlugSafe] ?? sizeSlugSafe;

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageKey, setUploadedImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (!file) return;
      if (!file.type?.startsWith?.('image/')) {
        setError('Please use an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be under 10MB');
        return;
      }
      setError(null);
      setUploading(true);
      try {
        const { url, key } = await uploadOne(file);
        setUploadedImage(url);
        setUploadedImageKey(key);
      } catch {
        setError('Upload failed. Try again.');
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const remove = useCallback(() => {
    setUploadedImage(null);
    setUploadedImageKey(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleAddToCart = () => {
    if (!uploadedImage) {
      setError('Please upload a photo first');
      return;
    }
    addItem({
      productId: CANVAS_PRODUCT.id,
      productName: `${CANVAS_PRODUCT.name} (${sizeLabel})`,
      productImage: CANVAS_PRODUCT.imageUrl,
      price: CANVAS_PRODUCT.price,
      quantity: 1,
      uploadedPhotoUrl: uploadedImage,
      uploadedPhotoKey: uploadedImageKey ?? undefined,
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Canvas Print — {sizeLabel}
        </h1>
        <p className="text-slate-600 mb-8">
          Upload one photo. We&apos;ll print it on gallery-quality canvas at this size.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            id="canvas-photo-upload"
          />
          {!uploadedImage ? (
            <label
              htmlFor="canvas-photo-upload"
              className={`flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                uploading
                  ? 'border-teal-400 bg-teal-50'
                  : 'border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-teal-50'
              }`}
            >
              {uploading ? (
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-2" />
              ) : (
                <Upload className="w-12 h-12 text-slate-400 mb-2" />
              )}
              <span className="text-slate-600 font-medium">
                {uploading ? 'Uploading...' : 'Click to upload your photo'}
              </span>
              <span className="text-slate-400 text-sm mt-1">PNG or JPG, up to 10MB</span>
            </label>
          ) : (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group">
              <img
                src={uploadedImage}
                alt="Your canvas print"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={remove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!uploadedImage || added}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all ${
            added
              ? 'bg-green-500 text-white'
              : uploadedImage
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
              Add Canvas Print to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
