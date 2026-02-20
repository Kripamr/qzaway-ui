'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '@/lib/api';
import { getUserId } from '@/lib/userId';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [meta, setMeta] = useState(null);

    const fetchOrders = useCallback(async (page = 1) => {
        const userId = getUserId();
        if (!userId) return;
        try {
            setLoading(true);
            const data = await api.getOrders(userId, page, 10);
            setOrders(data.data || []);
            setMeta(data.meta || null);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <OrdersContext.Provider value={{ orders, loading, open, meta, setOpen, fetchOrders }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const ctx = useContext(OrdersContext);
    if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
    return ctx;
}
