'use client';
import { useToast } from '@/context/ToastContext';
import styles from './ToastContainer.module.css';

export default function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className={styles.container}>
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`${styles.toast} ${styles[t.type]} ${t.exiting ? styles.exit : ''}`}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}
