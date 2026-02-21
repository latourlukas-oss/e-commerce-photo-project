import { prisma } from '@/lib/db';
import { ProductGrid } from './product-grid';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default async function ProductsPage() {
  let products: Product[] = [];
  
  try {
    products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-teal-600 font-medium mb-2 block">Our Products</span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Create Custom Photo Products
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose a product, upload your photo, and create something beautiful. 
            Every purchase helps fight poverty.
          </p>
        </div>
        
        <ProductGrid products={products ?? []} />
      </div>
    </div>
  );
}
