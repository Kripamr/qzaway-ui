'use client';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import * as api from '@/lib/api';
import { getUserId } from '@/lib/userId';

const preserveOrder = (prev, newItems, tempId = null) => {
    if (!prev || prev.length === 0) return newItems || [];
    const map = new Map((newItems || []).map(i => [i.cartItemId, i]));
    const result = [];
    for (const p of prev) {
        if (p.cartItemId === tempId) {
            const added = newItems.find(i => i.menuItemId === p.menuItemId && !prev.some(old => old.cartItemId === i.cartItemId));
            if (added) {
                result.push(added);
                map.delete(added.cartItemId);
            }
        } else if (map.has(p.cartItemId)) {
            result.push(map.get(p.cartItemId));
            map.delete(p.cartItemId);
        }
    }
    for (const item of map.values()) result.push(item);
    return result;
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [mallId, setMallId] = useState(null);
    const prevMallId = useRef(null);
    const updateTimeouts = useRef({});

    const fetchCart = useCallback(async (mId, silent = false) => {
        const userId = getUserId();
        if (!userId || !mId) return;
        try {
            if (!silent) setLoading(true);
            const data = await api.getCart(userId, mId);
            setItems(prev => preserveOrder(prev, data.items));
            setSummary(data.summary || null);
        } catch {
            setItems([]);
            setSummary(null);
        } finally {
            if (!silent) setLoading(false);
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

        const tempId = 'temp-' + Date.now();
        setItems(prev => [...prev, { cartItemId: tempId, menuItemId, quantity, price: 0, isOptimistic: true }]);

        try {
            const data = await api.addToCart({ userId, mallId, menuItemId, quantity });
            if (data && data.items) {
                setItems(prev => preserveOrder(prev, data.items, tempId));
                setSummary(data.summary);
            } else {
                fetchCart(mallId, true);
            }
        } catch (err) {
            setItems(prev => prev.filter(i => i.cartItemId !== tempId));
            throw err;
        }
    }, [mallId, fetchCart]);

    const updateItem = useCallback((cartItemId, quantity) => {
        if (String(cartItemId).startsWith('temp-')) {
            console.warn('Cannot update an optimistic item before it syncs.');
            return;
        }

        setItems(prev => prev.map(item => {
            if (item.cartItemId === cartItemId) {
                return { ...item, quantity, lineTotal: item.price * quantity };
            }
            return item;
        }));

        if (updateTimeouts.current[cartItemId]) {
            clearTimeout(updateTimeouts.current[cartItemId]);
        }

        setIsSyncing(true);
        updateTimeouts.current[cartItemId] = setTimeout(async () => {
            try {
                const data = await api.updateCartItem(cartItemId, { quantity });
                if (data && data.items) {
                    setItems(prev => preserveOrder(prev, data.items));
                    setSummary(data.summary);
                } else {
                    await fetchCart(mallId, true);
                }
            } catch (err) {
                await fetchCart(mallId, true);
            } finally {
                // Defer setting isSyncing to false to ensure React has painted the new values
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setIsSyncing(false));
                });
            }
        }, 400);
    }, [mallId, fetchCart]);

    const removeItem = useCallback(async (cartItemId) => {
        if (String(cartItemId).startsWith('temp-')) {
            console.warn('Cannot remove an optimistic item before it syncs.');
            return;
        }

        setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));

        try {
            setIsSyncing(true);
            const data = await api.removeCartItem(cartItemId);
            if (data && data.items) {
                setItems(prev => preserveOrder(prev, data.items));
                setSummary(data.summary);
            } else {
                await fetchCart(mallId, true);
            }
        } catch (err) {
            await fetchCart(mallId, true);
            throw err;
        } finally {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsSyncing(false));
            });
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
                items, summary, loading, open, mallId, itemCount, isSyncing,
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
