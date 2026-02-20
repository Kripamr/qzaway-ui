'use client';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './CartPanel.module.css';

// GST calculations matching the backend logic
function calcFinancials(subtotal) {
    const foodGst = subtotal * 0.05;
    const platformFee = subtotal > 0 ? 10 : 0;
    const platformGst = platformFee * 0.18;
    const total = subtotal + foodGst + platformFee + platformGst;
    return { foodGst, platformFee, platformGst, total };
}

export default function CartPanel() {
    const { items, summary, loading, open, setOpen, updateItem, removeItem, placeOrder } = useCart();
    const toast = useToast();

    const subtotal = summary?.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
    const { foodGst, platformFee, platformGst, total } = calcFinancials(subtotal);

    const handlePlaceOrder = async () => {
        try {
            await placeOrder();
            toast.success('🎉 Order placed successfully!');
        } catch {
            toast.error('Failed to place order. Please try again.');
        }
    };

    return (
        <>
            <div className={`overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)} />
            <aside className={`${styles.panel} ${open ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Your Cart
                    </h2>
                    <button className="btn-ghost btn-icon" onClick={() => setOpen(false)} aria-label="Close cart">
                        ✕
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add items from a restaurant menu to get started</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.items}>
                            {items.map((item) => (
                                <div key={item.cartItemId} className={styles.cartItem}>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemDetails}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.itemMeta}>
                                                {item.restaurant?.name && (
                                                    <span className={styles.restaurantTag}>{item.restaurant.name}</span>
                                                )}
                                            </span>
                                            <span className={styles.itemPrice}>₹{item.price}</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <div className="qty-stepper">
                                            <button
                                                onClick={() =>
                                                    item.quantity <= 1
                                                        ? removeItem(item.cartItemId)
                                                        : updateItem(item.cartItemId, item.quantity - 1)
                                                }
                                                disabled={loading}
                                            >
                                                {item.quantity <= 1 ? '🗑' : '−'}
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateItem(item.cartItemId, item.quantity + 1)}
                                                disabled={loading}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className={styles.lineTotal}>₹{item.lineTotal ?? (item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Food GST (5%)</span>
                                <span>₹{foodGst.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Platform Fee</span>
                                <span>₹{platformFee.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Platform GST (18%)</span>
                                <span>₹{platformGst.toFixed(2)}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total</span>
                                <span className="price price-lg">₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '16px' }}
                                onClick={handlePlaceOrder}
                                disabled={loading || items.length === 0}
                            >
                                {loading ? 'Placing Order...' : '🛍️ Place Order'}
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
