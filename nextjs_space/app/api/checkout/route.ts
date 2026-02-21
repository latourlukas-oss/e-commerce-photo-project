import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  uploadedPhotoUrl?: string;
  uploadedPhotoKey?: string;
}

interface Customer {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer } = body as { items: CartItem[]; customer: Customer };

    if (!items || (items?.length ?? 0) === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!customer?.name || !customer?.email || !customer?.address) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please add STRIPE_SECRET_KEY to .env' },
        { status: 503 }
      );
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + ((item?.price ?? 0) * (item?.quantity ?? 1)), 0);

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerName: customer?.name ?? '',
        customerEmail: customer?.email ?? '',
        shippingAddress: customer?.address ?? '',
        shippingCity: customer?.city ?? '',
        shippingState: customer?.state ?? '',
        shippingZip: customer?.zip ?? '',
        shippingCountry: customer?.country ?? 'US',
        total,
        status: 'pending',
        items: {
          create: items.map(item => ({
            productId: item?.productId ?? '',
            quantity: item?.quantity ?? 1,
            price: item?.price ?? 0,
            uploadedPhotoUrl: item?.uploadedPhotoUrl ?? null
          }))
        }
      }
    });

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customer?.email,
      metadata: {
        orderId: order?.id ?? ''
      },
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item?.productName ?? 'Photo Product',
            description: 'Custom photo product from PeoplesPrints'
          },
          unit_amount: Math.round((item?.price ?? 0) * 100) // Convert to cents
        },
        quantity: item?.quantity ?? 1
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order?.id },
      data: { stripeSessionId: session?.id ?? null }
    });

    return NextResponse.json({ url: session?.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
