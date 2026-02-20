import './globals.css';
import { Providers } from '@/components/Providers';
import Header from '@/components/Header';
import CartPanel from '@/components/CartPanel';
import OrdersPanel from '@/components/OrdersPanel';
import ToastContainer from '@/components/ToastContainer';

export const metadata = {
  title: 'Qzaway — Mall Food Court Ordering',
  description: 'Order food from your favourite mall food court. Skip the queue, order ahead.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main style={{ paddingTop: 'var(--header-h)' }}>{children}</main>
          <CartPanel />
          <OrdersPanel />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
