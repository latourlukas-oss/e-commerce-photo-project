"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="py-20">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-orange-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Payment Cancelled</h1>
          <p className="text-lg text-slate-600 mb-8">
            Your payment was cancelled. Don&apos;t worry - your items are still in your cart.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            href="/cart" 
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Return to Cart
          </Link>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
