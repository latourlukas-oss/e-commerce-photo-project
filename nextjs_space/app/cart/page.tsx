import { CartContent } from './cart-content';

export default function CartPage() {
  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Shopping Cart</h1>
        <CartContent />
      </div>
    </div>
  );
}
