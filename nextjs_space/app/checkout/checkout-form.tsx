"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/components/cart-provider';
import { CreditCard, Sparkles, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function CheckoutForm() {
  const router = useRouter();
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e?.target ?? {};
    if (name) {
      setFormData(prev => ({ ...(prev ?? {}), [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setError(null);
    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart?.items ?? [],
          customer: formData
        })
      });

      const data = await response.json();

      if (!response?.ok) {
        throw new Error(data?.error ?? 'Failed to create checkout session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data?.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err?.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="w-48 h-6 bg-slate-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if ((cart?.items?.length ?? 0) === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <ShoppingBag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Add some products before checkout!</p>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            Shipping Information
          </h2>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData?.name ?? ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="John Doe"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData?.email ?? ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="john@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData?.address ?? ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData?.city ?? ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State/Province</label>
              <input
                type="text"
                name="state"
                value={formData?.state ?? ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                name="zip"
                value={formData?.zip ?? ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <select
                name="country"
                value={formData?.country ?? 'US'}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 px-6 rounded-lg font-semibold transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${cart?.total?.toFixed?.(2) ?? '0.00'}
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {(cart?.items ?? []).map((item, index) => (
              <div key={`${item?.productId}-${index}`} className="flex gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item?.uploadedPhotoUrl ? (
                    <img 
                      src={item?.uploadedPhotoUrl} 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800">{item?.productName}</h3>
                  <p className="text-sm text-slate-500">Qty: {item?.quantity ?? 1}</p>
                </div>
                <span className="font-medium text-slate-800">
                  ${(((item?.price ?? 0) * (item?.quantity ?? 1))?.toFixed?.(2)) ?? '0.00'}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${cart?.total?.toFixed?.(2) ?? '0.00'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-teal-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-slate-800 pt-2">
              <span>Total</span>
              <span>${cart?.total?.toFixed?.(2) ?? '0.00'}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-teal-50 rounded-lg">
            <div className="flex items-start gap-2 text-teal-700">
              <Sparkles className="w-5 h-5  mt-0.5" />
              <div>
                <p className="font-medium">Making a Difference</p>
                <p className="text-sm">Part of your purchase helps fight poverty worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
