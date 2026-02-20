'use client';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { OrdersProvider } from '@/context/OrdersContext';

export function Providers({ children }) {
    return (
        <ToastProvider>
            <CartProvider>
                <OrdersProvider>
                    {children}
                </OrdersProvider>
            </CartProvider>
        </ToastProvider>
    );
}
