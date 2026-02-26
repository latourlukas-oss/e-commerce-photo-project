import { ProductGrid } from './product-grid';

const PRODUCTS = [
  { id: '1', name: 'Classic Photo Cube', description: 'A beautiful 3D rotating cube featuring your cherished photos.', price: 24.99, category: 'photo-cube', imageUrl: '/products/photo-cube.jpg' },
  { id: '2', name: 'Memory Keychain', description: 'Keep your loved ones close wherever you go.', price: 12.99, category: 'keychain', imageUrl: '/products/keychain.jpg' },
  { id: '3', name: 'Custom Fridge Magnet', description: 'Display your favorite moments on any magnetic surface.', price: 9.99, category: 'fridge-magnet', imageUrl: '/products/fridge-magnet.jpg' },
  { id: '4', name: 'Premium Canvas Print', description: 'Gallery-quality canvas prints for your walls.', price: 49.99, category: 'canvas-print', imageUrl: '/products/canvas.jpg' },
];

export default function ProductsPage() {
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
        <ProductGrid products={PRODUCTS} />
      </div>
    </div>
  );
}
