'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const { itemCount, setOpen: setCartOpen } = useCart();
    const { setOpen: setOrdersOpen, fetchOrders } = useOrders();

    const handleOrders = () => {
        fetchOrders();
        setOrdersOpen(true);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <Link href="/" className={styles.brand}>
                    <span className={styles.logo}>🍽️</span>
                    <span className={styles.brandText}>
                        Qz<span className={styles.accent}>away</span>
                    </span>
                </Link>

                {pathname !== '/' && (
                    <nav className={styles.breadcrumb}>
                        <Link href="/" className={styles.crumb}>Malls</Link>
                        {pathname.includes('/mall/') && (
                            <>
                                <span className={styles.sep}>›</span>
                                <span className={styles.crumbActive}>Restaurants</span>
                            </>
                        )}
                        {pathname.includes('/restaurant/') && (
                            <>
                                <span className={styles.sep}>›</span>
                                <span className={styles.crumbActive}>Menu</span>
                            </>
                        )}
                    </nav>
                )}

                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={handleOrders} title="Order History">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span className="hide-mobile">Orders</span>
                    </button>

                    <button className={styles.cartBtn} onClick={() => setCartOpen(true)} title="Your Cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                        <span className="hide-mobile">Cart</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
