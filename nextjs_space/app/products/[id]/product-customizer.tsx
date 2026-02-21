"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, X, Check, ShoppingCart, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export function ProductCustomizer({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageKey, setUploadedImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file?.type?.startsWith?.('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file?.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Get presigned URL
      const response = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file?.name ?? 'image',
          contentType: file?.type ?? 'image/jpeg',
          isPublic: true
        })
      });

      if (!response?.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, cloud_storage_path } = await response.json();

      // Check if content-disposition is in signed headers
      const urlParams = new URLSearchParams(uploadUrl?.split?.('?')?.[1] ?? '');
      const signedHeaders = urlParams?.get?.('X-Amz-SignedHeaders') ?? '';
      const includesContentDisposition = signedHeaders?.includes?.('content-disposition');

      // Upload to S3
      const uploadHeaders: Record<string, string> = {
        'Content-Type': file?.type ?? 'image/jpeg'
      };
      
      if (includesContentDisposition) {
        uploadHeaders['Content-Disposition'] = 'attachment';
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: uploadHeaders,
        body: file
      });

      if (!uploadResponse?.ok) {
        throw new Error('Failed to upload image');
      }

      // Get the file URL
      const urlResponse = await fetch('/api/upload/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloud_storage_path, isPublic: true })
      });

      if (!urlResponse?.ok) {
        throw new Error('Failed to get image URL');
      }

      const { url } = await urlResponse.json();
      setUploadedImage(url);
      setUploadedImageKey(cloud_storage_path);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedImageKey(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      setError('Please upload a photo first');
      return;
    }

    addItem({
      productId: product?.id ?? '',
      productName: product?.name ?? '',
      productImage: product?.imageUrl ?? '',
      price: product?.price ?? 0,
      quantity: 1,
      uploadedPhotoUrl: uploadedImage ?? undefined,
      uploadedPhotoKey: uploadedImageKey ?? undefined
    });

    setAdded(true);
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

  return (
    <div>
      <Link 
        href="/products" 
        className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Preview</h2>
          
          <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg relative overflow-hidden flex items-center justify-center">
            {uploadedImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={uploadedImage} 
                  alt="Preview" 
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute inset-0 pointer-events-none border-8 border-slate-200 rounded-lg" />
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-slate-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500">Upload a photo to see preview</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center gap-2 text-teal-700">
              <Sparkles className="w-4 h-4 " />
              <span className="text-sm font-medium">Your purchase helps fight poverty</span>
            </div>
          </div>
        </motion.div>

        {/* Customization Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-teal-600 font-medium">
            {product?.category?.split('-')?.map(w => w?.charAt?.(0)?.toUpperCase?.() + w?.slice?.(1))?.join(' ')}
          </span>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{product?.name}</h1>
          <p className="text-slate-600 mb-4">{product?.description}</p>
          <p className="text-3xl font-bold text-teal-600 mb-8">${product?.price?.toFixed?.(2) ?? '0.00'}</p>

          {/* Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Your Photo
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            
            {!uploadedImage ? (
              <label
                htmlFor="photo-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  uploading 
                    ? 'border-teal-400 bg-teal-50' 
                    : 'border-slate-300 hover:border-teal-400 hover:bg-teal-50'
                }`}
              >
                {uploading ? (
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-2" />
                    <p className="text-teal-600 font-medium">Uploading...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">Click to upload</p>
                    <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Photo uploaded successfully</span>
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!uploadedImage || added}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all ${
              added
                ? 'bg-green-500 text-white'
                : uploadedImage
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
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
                Add to Cart
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-teal-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">Support Poverty Relief</p>
                <p className="text-sm text-slate-600">A portion of your purchase goes directly to communities in need.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
