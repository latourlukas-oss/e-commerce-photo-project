import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/components/cart-provider';
import Script from 'next/script';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  return {
    title: 'PeoplesPrints - From the People, To the People',
    description: 'Custom photo products with purpose. Every purchase helps fight poverty. From the people, to the people.',
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
    },
    openGraph: {
      title: 'PeoplesPrints - From the People, To the People',
      description: 'Custom photo products with purpose. Every purchase helps fight poverty.',
      images: ['/og-image.png'],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} bg-slate-50 min-h-screen`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
