'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getMenu } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './MenuPage.module.css';

export default function MenuPage({ mallId, restaurantId }) {
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vegOnly, setVegOnly] = useState(false);
    const [addingId, setAddingId] = useState(null);
    const { setMallId, addItem, updateItem, removeItem, items: cartItems, summary, setOpen: setCartOpen } = useCart();
    const searchParams = useSearchParams();
    const initialName = searchParams.get('name');
    const toast = useToast();

    const itemCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);

    useEffect(() => {
        setMallId(mallId);
    }, [mallId, setMallId]);

    const fetchMenu = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMenu(restaurantId, { veg: vegOnly ? 'true' : '' });
            setRestaurant(data.restaurant || null);
            setCategories(data.data || []);
        } catch {
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, [restaurantId, vegOnly]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const handleAdd = async (menuItemId) => {
        try {
            setAddingId(menuItemId);
            await addItem(menuItemId, 1);
        } catch {
            toast.error('Failed to add item');
        } finally {
            setAddingId(null);
        }
    };

    const isInCart = (menuItemId) =>
        cartItems.some((ci) => ci.menuItemId === menuItemId);

    return (
        <div className={`${styles.page} ${itemCount > 0 ? styles.hasCart : ''}`}>
            <div className={`container ${styles.content}`}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                    <Link href="/" className={styles.crumbLink}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Malls
                    </Link>
                    <span className={styles.crumbSep}>›</span>
                    <Link href={`/mall/${mallId}`} className={styles.crumbLink}>Restaurants</Link>
                    <span className={styles.crumbSep}>›</span>
                    <span className={styles.crumbCurrent}>Menu</span>
                </nav>

                {/* Restaurant Header */}
                <div className={styles.restaurantHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.headerIcon}>🍽️</div>
                        <div>
                            <h1 className={styles.restaurantName}>
                                {restaurant?.name || initialName || 'Loading...'}
                            </h1>
                            {restaurant?.isActive && (
                                <span className={styles.statusBadge}>● Open Now</span>
                            )}
                        </div>
                    </div>

                    <label className={styles.vegToggle}>
                        <input
                            type="checkbox"
                            checked={vegOnly}
                            onChange={(e) => setVegOnly(e.target.checked)}
                        />
                        <span className={styles.toggleTrack}>
                            <span className={styles.toggleThumb} />
                        </span>
                        <span className={styles.vegLabel}>🥬 Veg Only</span>
                    </label>
                </div>

                {/* Menu */}
                {loading ? (
                    <div className={styles.menuLoading}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`skeleton ${styles.skeletonItem}`} />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📋</div>
                        <h3>No items available</h3>
                        <p>{vegOnly ? 'No veg items found. Try disabling the veg filter.' : 'This restaurant has no menu items yet.'}</p>
                    </div>
                ) : (
                    <div className={styles.categories}>
                        {categories.map((cat) => (
                            <section key={cat.categoryId} className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <h2 className={styles.categoryName}>{cat.categoryName}</h2>
                                    <span className={styles.categoryCount}>
                                        {cat.items.length} item{cat.items.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className={styles.itemsGrid}>
                                    {cat.items.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`${styles.menuItem} fade-in stagger-${Math.min(idx + 1, 6)}`}
                                        >
                                            <div className={styles.itemLeft}>
                                                <span className={`veg-dot ${item.isVeg ? '' : 'non-veg'}`} />
                                                <div className={styles.itemInfo}>
                                                    <h3 className={styles.itemName}>{item.name}</h3>
                                                    {item.description && (
                                                        <p className={styles.itemDesc}>{item.description}</p>
                                                    )}
                                                    <span className="price price-sm">₹{item.price}</span>
                                                </div>
                                            </div>

                                            <div className={styles.itemRight}>
                                                {(() => {
                                                    const cartItem = cartItems.find((ci) => ci.menuItemId === item.id);
                                                    if (cartItem) {
                                                        return (
                                                            <div className="qty-stepper" style={{ '--stepper-bg': 'var(--success-bg)', '--stepper-color': 'var(--success)' }}>
                                                                <button
                                                                    onClick={() =>
                                                                        cartItem.quantity <= 1
                                                                            ? removeItem(cartItem.cartItemId)
                                                                            : updateItem(cartItem.cartItemId, cartItem.quantity - 1)
                                                                    }
                                                                    disabled={cartItem.isOptimistic}
                                                                >
                                                                    {cartItem.quantity <= 1 ? '🗑' : '−'}
                                                                </button>
                                                                <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                                                                    {cartItem.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateItem(cartItem.cartItemId, cartItem.quantity + 1)}
                                                                    disabled={cartItem.isOptimistic}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <button
                                                            className={`btn btn-primary btn-sm ${styles.addBtn}`}
                                                            onClick={() => handleAdd(item.id)}
                                                            disabled={!item.isAvailable || addingId === item.id}
                                                        >
                                                            {addingId === item.id ? (
                                                                <span className={styles.spinner} />
                                                            ) : !item.isAvailable ? (
                                                                'Unavailable'
                                                            ) : (
                                                                '+ Add'
                                                            )}
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {itemCount > 0 && (
                <div className={styles.floatingCart} onClick={() => setCartOpen(true)}>
                    <div className={styles.floatingCartLeft}>
                        <span className={styles.floatingCartTitle}>
                            {itemCount} item{itemCount !== 1 ? 's' : ''} added
                        </span>
                        <span className={styles.floatingCartSub}>
                            Extra charges may apply
                        </span>
                    </div>
                    <div className={styles.floatingCartRight}>
                        <span>View Cart</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}
