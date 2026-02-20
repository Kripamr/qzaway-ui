'use client';
import { useEffect, useState, useCallback } from 'react';
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
    const { setMallId, addItem, items: cartItems } = useCart();
    const toast = useToast();

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
            toast.success('Added to cart! 🛒');
        } catch {
            toast.error('Failed to add item');
        } finally {
            setAddingId(null);
        }
    };

    const isInCart = (menuItemId) =>
        cartItems.some((ci) => ci.menuItemId === menuItemId);

    return (
        <div className={styles.page}>
            <div className={`container ${styles.content}`}>
                {/* Restaurant Header */}
                <div className={styles.restaurantHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.headerIcon}>🍽️</div>
                        <div>
                            <h1 className={styles.restaurantName}>
                                {restaurant?.name || 'Loading...'}
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
                                                {isInCart(item.id) ? (
                                                    <span className={styles.inCartBadge}>✓ In Cart</span>
                                                ) : (
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
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
