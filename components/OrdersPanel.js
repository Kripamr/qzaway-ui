'use client';
import { useRef } from 'react';
import { useOrders } from '@/context/OrdersContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import * as api from '@/lib/api';
import styles from './OrdersPanel.module.css';

export default function OrdersPanel() {
    const { orders, loading, open, meta, setOpen, fetchOrders } = useOrders();
    const { fetchCart, mallId } = useCart();
    const toast = useToast();
    const touchStartX = useRef(null);

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (diff > 80) setOpen(false);
        touchStartX.current = null;
    };

    const handleReorder = async (orderId) => {
        try {
            await api.reorder(orderId);
            toast.success('🔄 Items added to cart!');
            if (mallId) await fetchCart(mallId);
        } catch {
            toast.error('Failed to reorder. Please try again.');
        }
    };

    return (
        <>
            <div className={`overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)} />
            <aside
                className={`${styles.panel} ${open ? styles.open : ''}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        Order History
                    </h2>
                    <button className="btn-ghost btn-icon" onClick={() => setOpen(false)} aria-label="Close orders">
                        ✕
                    </button>
                </div>

                {loading && orders.length === 0 ? (
                    <div className={styles.loading}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`skeleton ${styles.skeletonCard}`} />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📋</div>
                        <h3>No orders yet</h3>
                        <p>Your order history will appear here after you place your first order</p>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div>
                                        <span className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</span>
                                        <span className={styles.orderDate}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <span className={`price price-md ${styles.orderTotal}`}>
                                        ₹{Number(order.totalAmount).toFixed(2)}
                                    </span>
                                </div>

                                <div className={styles.orderItems}>
                                    {(order.items || []).map((item) => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <span className={styles.orderItemName}>
                                                {item.nameSnapshot || item.name || 'Item'} × {item.quantity}
                                            </span>
                                            <span className={styles.orderItemPrice}>
                                                ₹{Number(item.lineTotal || item.priceSnapshot * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.orderFinancials}>
                                    <span>Subtotal: ₹{Number(order.subtotal).toFixed(2)}</span>
                                    <span>GST: ₹{(Number(order.foodGst) + Number(order.platformGst)).toFixed(2)}</span>
                                    <span>Fee: ₹{Number(order.platformFee).toFixed(2)}</span>
                                </div>

                                <button
                                    className={`btn btn-secondary btn-sm ${styles.reorderBtn}`}
                                    onClick={() => handleReorder(order.id)}
                                >
                                    🔄 Reorder
                                </button>
                            </div>
                        ))}

                        {meta && meta.totalPages > 1 && (
                            <div className={styles.pagination}>
                                {Array.from({ length: meta.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`btn btn-sm ${meta.page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => fetchOrders(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}
