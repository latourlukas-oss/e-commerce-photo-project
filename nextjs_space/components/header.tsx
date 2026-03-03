"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './cart-provider';

export function Header() {
  const { cart } = useCart();
  const itemCount = cart?.items?.length ?? 0;

  return (
    <header className="sticky top-0 z-50">
      {/* 3D top bar - cart only */}
      <div
        className="relative bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200"
        style={{
          boxShadow:
            "0 1px 0 0 rgba(255,255,255,0.8) inset, 0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-end">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-white/80 transition-all shadow-sm hover:shadow"
            aria-label="Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-1">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Full logo (no crop). "Memories that matter" removed from image file. Tagline: MEMORIES MATTER MOST stacked, centred. */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-center">
          <Link href="/" className="flex flex-col items-center gap-6 no-underline group">
            <Image
              src="/logo.png"
              alt="PeoplesPrints"
              width={570}
              height={377}
              className="w-[320px] sm:w-[400px] md:w-[480px] h-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
            <span className="text-base md:text-lg lg:text-xl tracking-widest text-slate-700 font-medium text-center">
              MEMORIES<br />MATTER<br />MOST
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
