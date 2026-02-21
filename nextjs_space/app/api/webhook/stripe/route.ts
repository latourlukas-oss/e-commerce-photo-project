import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!stripe || !webhookSecret || !signature) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event?.type) {
      case 'checkout.session.completed': {
        const session = event?.data?.object as Stripe.Checkout.Session;
        const orderId = session?.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' }
          });
          console.log(`Order ${orderId} marked as paid`);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event?.data?.object as Stripe.Checkout.Session;
        const orderId = session?.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'expired' }
          });
          console.log(`Order ${orderId} marked as expired`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event?.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
