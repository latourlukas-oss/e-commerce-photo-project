"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart-provider';

export function CartContent() {
  const { cart, removeItem, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <p className="text-slate-500 mb-8">Add some products to get started!</p>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <AnimatePresence mode="popLayout">
          {(cart?.items ?? []).map((item, index) => (
            <motion.div
              key={`${item?.productId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-md p-4 flex gap-4"
            >
              {/* Product Preview */}
              <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {item?.uploadedPhotoUrl ? (
                  <img 
                    src={item?.uploadedPhotoUrl} 
                    alt="Product preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{item?.productName}</h3>
                <p className="text-teal-600 font-medium">${item?.price?.toFixed?.(2) ?? '0.00'}</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(index, (item?.quantity ?? 1) - 1)}
                    disabled={(item?.quantity ?? 1) <= 1}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="text-slate-800 font-medium">{item?.quantity ?? 1}</span>
                  <button
                    onClick={() => updateQuantity(index, (item?.quantity ?? 1) + 1)}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="flex flex-col items-end justify-between">
                <span className="font-bold text-slate-800">
                  ${(((item?.price ?? 0) * (item?.quantity ?? 1))?.toFixed?.(2)) ?? '0.00'}
                </span>
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({cart?.items?.length ?? 0} items)</span>
              <span>${cart?.total?.toFixed?.(2) ?? '0.00'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-teal-600">Free</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold text-slate-800">
                <span>Total</span>
                <span>${cart?.total?.toFixed?.(2) ?? '0.00'}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="mt-6 p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center gap-2 text-teal-700">
              <Sparkles className="w-4 h-4 " />
              <span className="text-sm font-medium">Part of your purchase goes to charity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
