import { Outlet, Link } from 'react-router-dom';
import { Cpu, Search, Menu, X, Layers, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../index.css';

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="app-container">
            {/* Header NavBar */}
            <header className="glass-panel" style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <Link to="/" onClick={() => window.dispatchEvent(new Event('clearFilters'))} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--ti-red)', padding: '0.5rem', borderRadius: '8px' }}>
                        <Cpu size={24} color="var(--ti-white)" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                            Texas Instruments
                        </h2>
                        <div style={{ fontSize: '0.875rem', color: 'var(--ti-text-secondary)' }}>EVM Explorer</div>
                    </div>
                </Link>

                {/* Desktop Search Bar */}
                <div style={{
                    display: 'none', flex: 1, maxWidth: '500px', margin: '0 2rem',
                    position: 'relative'
                }} className="desktop-search">
                    <Search size={20} color="var(--ti-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search for an EVM..."
                        style={{
                            width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--ti-border)',
                            borderRadius: '99px',
                            color: 'var(--ti-white)',
                            outline: 'none',
                            transition: 'border-color var(--transition-fast)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--ti-teal)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--ti-border)'}
                    />
                </div>

                {/* Desktop Nav Links */}
                <div className="desktop-nav-links" style={{ display: 'none', alignItems: 'center', gap: '1.5rem', marginRight: '1rem' }}>
                    <a href="https://software-dl.ti.com/cicd-report/linux/index.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ti-text-primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--ti-teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ti-text-primary)'}>
                        <Layers size={18} /> CI/CD Snapshots
                    </a>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--ti-border)',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--ti-text-primary)',
                            transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ti-teal)'; e.currentTarget.style.color = 'var(--ti-teal)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ti-border)'; e.currentTarget.style.color = 'var(--ti-text-primary)'; }}
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="mobile-toggle"
                    style={{ background: 'transparent', border: 'none', color: 'var(--ti-white)', cursor: 'pointer', display: 'none' }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {/* Main Content Area */}
            <main className="main-content">
                <div className="page-container">
                    <Outlet />
                </div>
            </main>

            {/* Basic responsive CSS injected here to avoid fragmenting files early */}
            <style>{`
        @media (min-width: 768px) {
          .desktop-search { display: block !important; }
          .desktop-nav-links { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mobile-toggle { display: block !important; }
          .page-container { padding: 1rem; }
        }
      `}</style>
        </div>
    );
}
