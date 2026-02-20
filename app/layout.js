import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import { Providers } from '@/components/Providers';
import Header from '@/components/Header';
import CartPanel from '@/components/CartPanel';
import OrdersPanel from '@/components/OrdersPanel';
import ToastContainer from '@/components/ToastContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600', '700'] });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading', weight: ['500', '600', '700', '800'] });

export const metadata = {
  title: 'Qzaway — Mall Food Court Ordering',
  description: 'Order food from your favourite mall food court. Skip the queue, order ahead.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ErrorBoundary>
          <Providers>
            <Header />
            <main style={{ paddingTop: 'var(--header-h)' }}>{children}</main>
            <CartPanel />
            <OrdersPanel />
            <ToastContainer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
