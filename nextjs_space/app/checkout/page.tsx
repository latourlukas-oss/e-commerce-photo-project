import { CheckoutForm } from './checkout-form';

export default function CheckoutPage() {
  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Checkout</h1>
        <p className="text-slate-600 mb-8">Complete your order as a guest - no account needed!</p>
        <CheckoutForm />
      </div>
    </div>
  );
}
