'use client';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import * as api from '@/lib/api';
import { getUserId } from '@/lib/userId';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [mallId, setMallId] = useState(null);
    const prevMallId = useRef(null);

    const fetchCart = useCallback(async (mId) => {
        const userId = getUserId();
        if (!userId || !mId) return;
        try {
            setLoading(true);
            const data = await api.getCart(userId, mId);
            setItems(data.items || []);
            setSummary(data.summary || null);
        } catch {
            setItems([]);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mallId && mallId !== prevMallId.current) {
            prevMallId.current = mallId;
            fetchCart(mallId);
        }
    }, [mallId, fetchCart]);

    const addItem = useCallback(async (menuItemId, quantity = 1) => {
        const userId = getUserId();
        if (!userId || !mallId) return;
        try {
            setLoading(true);
            await api.addToCart({ userId, mallId, menuItemId, quantity });
            await fetchCart(mallId);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, [mallId, fetchCart]);

    const updateItem = useCallback(async (cartItemId, quantity) => {
        try {
            setLoading(true);
            await api.updateCartItem(cartItemId, { quantity });
            await fetchCart(mallId);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, [mallId, fetchCart]);

    const removeItem = useCallback(async (cartItemId) => {
        try {
            setLoading(true);
            await api.removeCartItem(cartItemId);
            await fetchCart(mallId);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, [mallId, fetchCart]);

    const placeOrder = useCallback(async () => {
        const userId = getUserId();
        if (!userId || !mallId) return;
        try {
            setLoading(true);
            const result = await api.placeOrder({ userId, mallId });
            setItems([]);
            setSummary(null);
            setOpen(false);
            return result;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, [mallId]);

    const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

    return (
        <CartContext.Provider
            value={{
                items, summary, loading, open, mallId, itemCount,
                setOpen, setMallId, addItem, updateItem, removeItem, placeOrder, fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
