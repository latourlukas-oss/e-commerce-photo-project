import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ProductCustomizer } from './product-customizer';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = params?.id;
  
  if (!productId) {
    notFound();
  }
  
  let product = null;
  
  try {
    product = await prisma.product.findUnique({
      where: { id: productId }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <ProductCustomizer product={{
          id: product?.id ?? '',
          name: product?.name ?? '',
          description: product?.description ?? '',
          price: product?.price ?? 0,
          category: product?.category ?? '',
          imageUrl: product?.imageUrl ?? ''
        }} />
      </div>
    </div>
  );
}
