import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import evmData from '../data/evmIndex.json';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
    const [activeFamily, setActiveFamily] = useState('all');
    const [activeProcessor, setActiveProcessor] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFamilyExpanded, setIsFamilyExpanded] = useState(true);
    const [isProcessorExpanded, setIsProcessorExpanded] = useState(true);

    useEffect(() => {
        const handleClearFilters = () => {
            setActiveFamily('all');
            setActiveProcessor('all');
            setSearchQuery('');
        };
        window.addEventListener('clearFilters', handleClearFilters);
        return () => window.removeEventListener('clearFilters', handleClearFilters);
    }, []);

    // Derive unique processors dynamically
    const processors = ['all', ...new Set(evmData.evms.map(evm => evm.processor).filter(Boolean))].sort();

    // Filtering Logic
    const filteredEVMs = evmData.evms.filter(evm => {
        const matchesFamily = activeFamily === 'all' || evm.family === activeFamily;
        const matchesProcessor = activeProcessor === 'all' || evm.processor === activeProcessor;
        const desc = evm.shortDescription || (evm.variants ? evm.variants[0].shortDescription : '');
        const matchesSearch = evm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFamily && matchesProcessor && matchesSearch;
    });

    return (
        <div style={{ display: 'flex', gap: '2rem', height: '100%', flexDirection: 'column' }}>

            {/* Search Input for Mobile (Hidden on Desktop as it is in Nav) */}
            <div className="mobile-search-bar" style={{ display: 'none', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search for an EVM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%', padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--ti-border)',
                        borderRadius: '8px',
                        color: 'var(--ti-white)',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>

                {/* Sidebar Filters */}
                <aside style={{ width: '250px', flexShrink: 0 }} className="sidebar">
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                        <h3
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => setIsFamilyExpanded(!isFamilyExpanded)}
                        >
                            <Filter size={20} color="var(--ti-teal)" />
                            Device Family
                            <div style={{ marginLeft: 'auto', display: 'flex', color: 'var(--ti-text-muted)' }}>
                                {isFamilyExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </h3>

                        {isFamilyExpanded && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button
                                    className={`filter-btn ${activeFamily === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveFamily('all')}
                                >
                                    All Families
                                </button>

                                {evmData.families.map(family => (
                                    <button
                                        key={family.id}
                                        className={`filter-btn ${activeFamily === family.id ? 'active' : ''}`}
                                        onClick={() => setActiveFamily(family.id)}
                                    >
                                        {family.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <h3
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => setIsProcessorExpanded(!isProcessorExpanded)}
                        >
                            <Filter size={20} color="var(--ti-teal)" />
                            Processor
                            <div style={{ marginLeft: 'auto', display: 'flex', color: 'var(--ti-text-muted)' }}>
                                {isProcessorExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </h3>

                        {isProcessorExpanded && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {processors.map(proc => (
                                    <button
                                        key={proc}
                                        style={{ textTransform: proc === 'all' ? 'none' : 'uppercase' }}
                                        className={`filter-btn ${activeProcessor === proc ? 'active' : ''}`}
                                        onClick={() => setActiveProcessor(proc)}
                                    >
                                        {proc === 'all' ? 'All Processors' : proc}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Grid View */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2><span style={{ color: 'var(--ti-red)' }}>Hardware</span> Directory</h2>
                        <span style={{ color: 'var(--ti-text-muted)' }}>{filteredEVMs.length} results</span>
                    </div>

                    <div className="evm-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {filteredEVMs.map(evm => {
                            const desc = evm.shortDescription || (evm.variants ? evm.variants[0].shortDescription : '');
                            const heroImage = evm.heroImage || (evm.variants ? evm.variants[0].heroImage : null);
                            const finalHeroImageSrc = heroImage ? (heroImage.startsWith('http') ? heroImage : `${import.meta.env.BASE_URL}evms/${evm.id}/images/${heroImage}`) : null;

                            return (
                                <Link to={`/evm/${evm.id}`} key={evm.id}>
                                    <div className="glass-panel evm-card" style={{
                                        height: '100%',
                                        transition: 'transform var(--transition-bounce), box-shadow var(--transition-normal)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {/* Hero Image */}
                                        <div style={{
                                            height: '180px',
                                            background: 'var(--ti-bg-surface-elevated)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderBottom: '1px solid var(--ti-border)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {finalHeroImageSrc ? (
                                                <img
                                                    src={finalHeroImageSrc}
                                                    alt={evm.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                                />
                                            ) : null}

                                            <span style={{ color: 'var(--ti-text-muted)', fontSize: '0.875rem', display: finalHeroImageSrc ? 'none' : 'block' }}>
                                                No Image
                                            </span>
                                            <span className={`badge badge-${evm.family}`} style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                                                {evmData.families.find(f => f.id === evm.family)?.name}
                                            </span>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--ti-text-primary)' }}>{evm.name}</h3>
                                            <p style={{
                                                color: 'var(--ti-text-secondary)',
                                                fontSize: '0.875rem',
                                                marginBottom: '1.5rem',
                                                flex: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {desc}
                                            </p>
                                            <div style={{ color: 'var(--ti-teal)', fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                Explore Details →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>

            <style>{`
        .filter-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--ti-text-secondary);
          padding: 0.75rem 1rem;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-weight: 500;
        }
        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--ti-white);
        }
        .filter-btn.active {
          background: rgba(0, 135, 124, 0.15);
          color: var(--ti-teal);
          border: 1px solid rgba(0, 135, 124, 0.3);
        }
        .evm-card:hover {
          transform: translateY(-5px);
          border-color: var(--ti-teal);
          box-shadow: var(--shadow-teal);
        }
        @media (max-width: 767px) {
          .sidebar { width: 100% !important; }
          .mobile-search-bar { display: block !important; }
          .evm-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
