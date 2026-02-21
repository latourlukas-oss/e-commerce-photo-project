# PeoplesPrints - Photo E-commerce with Purpose

> **From the People, To the People** - Every purchase helps fight poverty.

## About

PeoplesPrints is a photo e-commerce platform where customers can create custom photo products while contributing to poverty relief efforts worldwide. A portion of every purchase goes directly to charitable causes.

## Features

- **Custom Photo Products**: Photo cubes, keychains, fridge magnets, mugs, canvas prints, and phone cases
- **Photo Upload & Preview**: Upload photos and see real-time previews of customized products
- **Guest Checkout**: No account registration required
- **Stripe Payment Integration**: Secure payment processing
- **Order Management**: All orders saved to database

## Setup Instructions

### 1. Install Dependencies

```bash
cd nextjs_space
yarn install
```

### 2. Configure Environment Variables

Create or update the `.env` file with the following:

```env
# Database (already configured)
DATABASE_URL="your-database-url"

# AWS S3 (already configured)
AWS_PROFILE=hosted_storage
AWS_REGION=us-west-2
AWS_BUCKET_NAME=your-bucket-name
AWS_FOLDER_PREFIX=your-prefix/

# Stripe Configuration (ADD THESE)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in or create an account
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** and **Secret key**
5. For testing, use the test mode keys (starts with `pk_test_` and `sk_test_`)

### 4. Set Up Stripe Webhook (Optional but Recommended)

For production, set up a webhook to handle payment events:

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/webhook/stripe`
4. Select events: `checkout.session.completed`, `checkout.session.expired`
5. Copy the **Signing secret** and add it as `STRIPE_WEBHOOK_SECRET`

### 5. Initialize Database

```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed
```

### 6. Run Development Server

```bash
yarn dev
```

Visit `http://localhost:3000` to see the site.

## Project Structure

```
nextjs_space/
├── app/
│   ├── api/                # API routes
│   │   ├── checkout/       # Stripe checkout
│   │   ├── upload/         # File upload
│   │   └── webhook/        # Stripe webhooks
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout pages
│   ├── mission/            # Our mission page
│   ├── products/           # Product catalog
│   └── page.tsx            # Homepage
├── components/             # React components
├── lib/                    # Utility functions
│   ├── cart.ts             # Cart management
│   ├── s3.ts               # S3 file operations
│   └── stripe.ts           # Stripe initialization
├── prisma/
│   └── schema.prisma       # Database schema
└── scripts/
    └── seed.ts             # Database seeding
```

## Charitable Mission

PeoplesPrints is committed to fighting poverty through commerce. A portion of every purchase goes to:

- **Basic Necessities**: Food, clean water, and essential supplies
- **Education Support**: Programs giving children opportunities for a brighter future
- **Healthcare Access**: Medical supplies and services in underserved communities

## Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: AWS S3
- **Payments**: Stripe
- **Animations**: Framer Motion

## License

Proprietary - PeoplesPrints
