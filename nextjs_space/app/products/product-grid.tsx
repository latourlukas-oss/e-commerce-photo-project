"use client";

import { useState } from 'react';
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
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...new Set((products ?? []).map(p => p?.category).filter(Boolean))];
  
  const filteredProducts = filter === 'all' 
    ? (products ?? []) 
    : (products ?? []).filter(p => p?.category === filter);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat 
                ? 'bg-teal-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Products' : cat?.split('-')?.map(w => w?.charAt?.(0)?.toUpperCase?.() + w?.slice?.(1))?.join(' ')}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No products found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => {
            return (
              <motion.div
                key={product?.id ?? index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/products/${product?.id}`}>
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
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                          {product?.category?.split('-')?.map(w => w?.charAt?.(0)?.toUpperCase?.() + w?.slice?.(1))?.join(' ')}
                        </span>
                      </div>
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
