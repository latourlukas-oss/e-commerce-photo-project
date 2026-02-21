"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Package, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart-provider';

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get?.('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful payment
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="py-20">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-slate-600 mb-8">
            Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-teal-50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-teal-700 mb-2">
            <Sparkles className="w-5 h-5 " />
            <span className="font-semibold">You&apos;ve Made a Difference!</span>
          </div>
          <p className="text-teal-600">
            A portion of your purchase will go directly to poverty relief efforts around the world. 
            Thank you for being part of the change.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <Package className="w-6 h-6 text-teal-600" />
            <div className="text-left">
              <p className="font-medium">What&apos;s Next?</p>
              <p className="text-sm text-slate-500">
                Your custom photo products will be carefully crafted and shipped to you.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
