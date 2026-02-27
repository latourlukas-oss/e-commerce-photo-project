"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export function ProductGrid({ products }: { products: Product[] }) {
  const list = products ?? [];
  return (
    <div>
      {list.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No products found. Check back soon!</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(list).map((product, index) => {
          const isPhotoCube = product?.category === 'photo-cube' || product?.id === '1';
          const isFridgeMagnet = product?.category === 'fridge-magnet' || product?.id === '3';
          const isCanvasPrint = product?.category === 'canvas-print' || product?.id === '4';
          const href = isPhotoCube
            ? '/photo-cube'
            : isFridgeMagnet
              ? '/fridge-magnet'
              : isCanvasPrint
                ? '/canvas-print'
                : `/products/${product?.id}`;
          return (
          <motion.div
            key={product?.id ?? index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={href}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all group cursor-pointer overflow-hidden h-full">
                <div className="aspect-video relative bg-slate-100 overflow-hidden">
                  <Image 
                    src={product?.imageUrl ?? '/products/photo-cube.jpg'} 
                    alt={product?.name ?? 'Product'} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{product?.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-teal-600">${product?.price?.toFixed?.(2) ?? '0.00'}</span>
                    <span className="text-sm text-orange-500 font-medium group-hover:translate-x-1 transition-transform">
                      Customize →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
          );
        })}
      </div>
      )}
    </div>
  );
}
