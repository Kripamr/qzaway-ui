'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getRestaurants, searchFood } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import styles from './RestaurantList.module.css';

export default function RestaurantList({ mallId }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);
    const [vegOnly, setVegOnly] = useState(false);
    const { setMallId } = useCart();

    useEffect(() => {
        setMallId(mallId);
    }, [mallId, setMallId]);

    useEffect(() => {
        getRestaurants(mallId)
            .then((data) => setRestaurants(data.data || []))
            .catch(() => setRestaurants([]))
            .finally(() => setLoading(false));
    }, [mallId]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }
        try {
            setSearching(true);
            const data = await searchFood(mallId, searchQuery.trim(), {
                veg: vegOnly ? 'true' : '',
            });
            setSearchResults(data.data || []);
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }, [mallId, searchQuery, vegOnly]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) handleSearch();
            else setSearchResults(null);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, handleSearch]);

    const restaurantIcons = ['🍛', '🍔', '☕', '🥗', '🍕', '🌮', '🍜', '🧁'];

    return (
        <div className={styles.page}>
            <div className={`container ${styles.content}`}>
                {/* Search Bar */}
                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for dishes..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
                        )}
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

                {/* Search Results */}
                {searchResults !== null ? (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            {searching ? 'Searching...' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                        </h2>
                        {searchResults.length === 0 && !searching ? (
                            <div className="empty-state">
                                <div className="icon">🔍</div>
                                <h3>No dishes found</h3>
                                <p>Try a different search term</p>
                            </div>
                        ) : (
                            <div className={styles.searchGrid}>
                                {searchResults.map((item, idx) => (
                                    <div key={item.id} className={`${styles.searchCard} fade-in stagger-${Math.min(idx + 1, 6)}`}>
                                        <div className={styles.searchCardTop}>
                                            <span className={`veg-dot ${item.isVeg ? '' : 'non-veg'}`} />
                                            <span className={styles.searchItemName}>{item.name}</span>
                                        </div>
                                        {item.restaurant && (
                                            <span className={styles.searchRestaurant}>
                                                at {item.restaurant.name}
                                            </span>
                                        )}
                                        <span className="price price-sm">₹{item.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Restaurant Grid */
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            {loading ? '' : `${restaurants.length} Restaurant${restaurants.length !== 1 ? 's' : ''}`}
                        </h2>

                        {loading ? (
                            <div className={styles.grid}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`skeleton ${styles.skeletonCard}`} />
                                ))}
                            </div>
                        ) : restaurants.length === 0 ? (
                            <div className="empty-state">
                                <div className="icon">🏪</div>
                                <h3>No restaurants found</h3>
                                <p>This mall doesn&apos;t have any restaurants yet</p>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {restaurants.map((r, idx) => (
                                    <Link
                                        key={r.id}
                                        href={`/mall/${mallId}/restaurant/${r.id}`}
                                        className={`${styles.card} fade-in stagger-${Math.min(idx + 1, 6)}`}
                                    >
                                        <div className={styles.cardIcon}>
                                            {restaurantIcons[idx % restaurantIcons.length]}
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.cardName}>{r.name}</h3>
                                            <span className={styles.cardMeta}>View Menu →</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
