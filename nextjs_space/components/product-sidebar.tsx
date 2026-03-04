'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Package, Box, Key, Magnet, Image as ImageIcon, Layers } from 'lucide-react';

const CLOSE_DELAY_MS = 250;

const PRODUCTS = [
  { name: 'Transparent Prints', href: '/transparent-prints', icon: Layers },
  { name: 'Photo Cube', href: '/photo-cube', icon: Box },
  { name: 'Keychain', href: '/keychain', icon: Key },
  { name: 'Fridge Magnet', href: '/fridge-magnet', icon: Magnet },
  { name: 'Canvas Print', href: '/canvas-print', icon: ImageIcon },
  { name: 'All Products', href: '/products', icon: Package },
];

export function ProductSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleMouseEnter = () => {
    clearCloseTimeout();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    scheduleClose();
  };

  const handleBarClick = () => {
    setOpen((prev) => !prev);
  };

  if (!mounted) {
    return <div className="fixed left-0 top-0 z-[60] h-full w-14 flex-shrink-0" aria-hidden />;
  }

  const panelClass = open ? 'w-56 opacity-100' : 'w-0 opacity-0';

  return (
    <div
      className="fixed left-0 top-0 z-[60] flex h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleBarClick}
        className="flex h-full w-14 flex-shrink-0 flex-col items-center justify-start border-r-2 border-slate-200 bg-slate-50 pt-6 shadow-md cursor-pointer hover:bg-slate-100 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Open products menu"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-white shadow-sm">
          <Package className="h-6 w-6" aria-hidden />
        </div>
        <span className="mt-2 text-[10px] font-semibold text-slate-600">Products</span>
      </button>
      <div className={'overflow-hidden border-r-2 border-slate-200 bg-white shadow-xl transition-all duration-200 ' + panelClass}>
        <div className="flex min-h-full w-56 flex-col py-4">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            All products
          </p>
          <nav className="flex flex-1 flex-col gap-0.5 px-2 overflow-y-auto min-h-0">
            {PRODUCTS.map((product) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.href}
                  href={product.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 text-slate-400" />
                  <span className="font-medium">{product.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
