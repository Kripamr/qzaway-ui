'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMalls } from '@/lib/api';
import styles from './MallSelect.module.css';

const mallIcons = ['🏬', '🏢', '🛍️', '🏪', '🏗️'];

export default function MallSelect() {
    const [malls, setMalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMalls()
            .then((data) => setMalls(data))
            .catch(() => setMalls([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <span className={styles.tagline}>✨ Skip the queue</span>
                <h1 className={styles.title}>
                    Order food from your{' '}
                    <span className={styles.titleAccent}>favourite food court</span>
                </h1>
                <p className={styles.subtitle}>
                    Browse restaurants, customize your order, and pick it up — no waiting in line
                </p>
            </div>

            {loading ? (
                <div className={styles.loadingGrid}>
                    {[1, 2].map((i) => (
                        <div key={i} className={`skeleton ${styles.skeletonCard}`} />
                    ))}
                </div>
            ) : (
                <div className={styles.mallGrid}>
                    {malls.map((mall, idx) => (
                        <Link
                            key={mall.id}
                            href={`/mall/${mall.id}`}
                            className={`${styles.mallCard} fade-in stagger-${idx + 1}`}
                        >
                            <div className={styles.mallIcon}>{mallIcons[idx % mallIcons.length]}</div>
                            <span className={styles.mallName}>{mall.name}</span>
                            <span className={styles.mallArrow}>
                                Browse restaurants →
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
