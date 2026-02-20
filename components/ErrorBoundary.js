'use client';
import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '60vh', padding: '24px', textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '8px' }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px' }}>
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                    >
                        ↻ Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
