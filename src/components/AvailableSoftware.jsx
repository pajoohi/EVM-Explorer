import { useState, useEffect } from 'react';
import { Download, Terminal, HardDrive, ExternalLink, Monitor, Server, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function AvailableSoftware({ baseEvm, activeEvmData }) {
    const [softwareList, setSoftwareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [showAllArmbian, setShowAllArmbian] = useState(false);

    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                // Proof-of-concept fetch from Armbian's live imager OS list
                const response = await fetch('https://github.armbian.com/armbian-images.json');
                if (!response.ok) throw new Error('Failed to fetch remote software list');

                const data = await response.json();

                // The imager JSON has an os_list. We will try to flatten it to find relevant images.
                let extracted = [];

                const traverseList = (items) => {
                    if (!items) return;
                    for (const item of items) {
                        if (item.url && item.name) {
                            extracted.push(item);
                        } else if (item.file_url && item.board_name) {
                            extracted.push({
                                board_name: item.board_name,
                                name: `${item.board_name} - ${item.variant} (${item.distro})`,
                                description: `Kernel: ${item.kernel_version} | Armbian OS: ${item.armbian_version}`,
                                release_date: item.file_date ? new Date(item.file_date.replace(' ', 'T')).toLocaleDateString() : 'Unknown',
                                url: item.file_url,
                                distro: item.distro,
                                variant: item.variant
                            });
                        }
                        if (item.subitems) {
                            traverseList(item.subitems);
                        }
                    }
                };

                if (data.os_list) {
                    traverseList(data.os_list);
                } else if (data.assets) {
                    traverseList(data.assets);
                }

                // Filter strictly for the exact part number/board ID
                const filterMatch = (activeEvmData.armbianSlug || activeEvmData.partNumber || activeEvmData.id || baseEvm.armbianSlug || baseEvm.partNumber || baseEvm.id).toLowerCase();
                let filtered = extracted.filter(img =>
                    img.board_name && img.board_name.toLowerCase() === filterMatch
                );

                if (filtered.length === 0) {
                    // Fallback proof-of-concept if exact name not matched
                    filtered = extracted.slice(0, 5);
                }

                setSoftwareList(filtered);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching software list:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        const isFlashingSupported = activeEvmData.flashingSupported !== undefined ? activeEvmData.flashingSupported : baseEvm.flashingSupported;

        if (isFlashingSupported) {
            fetchSoftware();
        }
    }, [activeEvmData.id, baseEvm.id, activeEvmData.flashingSupported, baseEvm.flashingSupported]);

    const isFlashingSupported = activeEvmData.flashingSupported !== undefined ? activeEvmData.flashingSupported : baseEvm.flashingSupported;
    const cicdLink = activeEvmData.cicdLink || baseEvm.cicdLink;

    if (!isFlashingSupported && !cicdLink) {
        return null;
    }

    return (
        <div id="software-section" className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '1.5rem' : '0', borderBottom: isExpanded ? '1px solid var(--glass-border)' : 'none', paddingBottom: isExpanded ? '1rem' : '0', cursor: 'pointer' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Terminal size={24} color="var(--ti-teal)" />
                    <h2 style={{ margin: 0 }}>Available Software {isFlashingSupported && '& Flashing'}</h2>
                </div>
                <div style={{ color: 'var(--ti-text-muted)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isExpanded && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                    {/* Top Row: Flashing Instructions and CI/CD Snapshots */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {isFlashingSupported && (
                            <div style={{ padding: '1.5rem', backgroundColor: 'var(--ti-bg-surface-elevated)', borderRadius: '8px', borderLeft: '4px solid var(--ti-teal)', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <HardDrive size={20} /> Flashing Instructions
                                </h3>
                                <p style={{ color: 'var(--ti-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    This development board supports direct OS flashing via the Armbian Imager utility.
                                    Simply insert your SD card, select your preferred OS image from the list below, and flash.
                                </p>
                                <div style={{ marginTop: 'auto' }}>
                                    <a href="https://github.com/armbian/imager/releases" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', textDecoration: 'none' }}>
                                        <Download size={18} /> Download Armbian Imager
                                    </a>
                                </div>
                            </div>
                        )}

                        {cicdLink && (
                            <div style={{ backgroundColor: 'var(--ti-bg-surface-elevated)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--ti-teal)', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Layers size={20} />
                                    Nightly CI/CD Linux Snapshots
                                </h3>
                                <p style={{ color: 'var(--ti-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Review and download the latest nightly software integration snapshots directly from Texas Instruments CI/CD automation pipelines.</p>
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                                    <a href={cicdLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                        <ExternalLink size={18} /> Open Integration Dashboard
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Top Row: Armbian Software List */}
                    {isFlashingSupported && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Armbian Linux Variants</h3>
                            {loading && <div style={{ color: 'var(--ti-text-muted)' }}>Loading remote software repository...</div>}
                            {error && <div style={{ color: '#ff6b6b' }}>Error loading images: {error}</div>}

                            {!loading && !error && (
                                <>
                                    {showAllArmbian && (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                            {['All', 'Desktop', 'Minimal', 'Ubuntu', 'Debian'].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setActiveFilter(cat)}
                                                    style={{
                                                        padding: '0.4rem 1rem',
                                                        borderRadius: '20px',
                                                        border: `1px solid ${activeFilter === cat ? 'var(--ti-teal)' : 'var(--glass-border)'}`,
                                                        backgroundColor: activeFilter === cat ? 'rgba(0, 135, 124, 0.15)' : 'transparent',
                                                        color: activeFilter === cat ? 'var(--ti-teal)' : 'var(--ti-text-primary)',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 600,
                                                        transition: 'all 0.2s',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                        {softwareList.filter(sw => {
                                            if (activeFilter === 'All') return true;
                                            const variantText = (sw.variant || sw.name || "").toLowerCase();
                                            const distroText = (sw.distro || "").toLowerCase();

                                            if (activeFilter === 'Desktop') return variantText.includes('desktop') || variantText.includes('gnome') || variantText.includes('kde') || variantText.includes('xfce');
                                            if (activeFilter === 'Minimal') return variantText.includes('minimal') || variantText.includes('server') || variantText.includes('cli');
                                            if (activeFilter === 'Ubuntu') return distroText.includes('noble') || distroText.includes('jammy') || distroText.includes('focal') || distroText.includes('ubuntu');
                                            if (activeFilter === 'Debian') return distroText.includes('bookworm') || distroText.includes('bullseye') || distroText.includes('sid') || distroText.includes('debian');

                                            return true;
                                        }).slice(0, showAllArmbian ? softwareList.length : 3).map((sw, index) => {
                                            const variantText = (sw.variant || sw.name || "").toLowerCase();
                                            const distroText = (sw.distro || "").toLowerCase();
                                            let OsIcon = Server;
                                            if (variantText.includes('desktop')) OsIcon = Monitor;
                                            else if (variantText.includes('minimal')) OsIcon = Terminal;
                                            else if (variantText.includes('gnome') || variantText.includes('kde')) OsIcon = Layers;

                                            const osName = ['noble', 'jammy', 'focal', 'ubuntu'].some(d => distroText.includes(d)) ? 'Ubuntu' :
                                                ['bookworm', 'bullseye', 'sid', 'debian'].some(d => distroText.includes(d)) ? 'Debian' :
                                                    sw.distro ? (sw.distro.charAt(0).toUpperCase() + sw.distro.slice(1)) : 'Linux';

                                            return (
                                                <div key={index} style={{ padding: '1.25rem', backgroundColor: 'var(--ti-bg-base)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s', cursor: 'default' }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>

                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.25rem' }}>
                                                        <div style={{ backgroundColor: 'rgba(0, 135, 124, 0.1)', padding: '0.75rem', borderRadius: '8px', color: 'var(--ti-teal)', flexShrink: 0 }}>
                                                            <OsIcon size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--ti-text-primary)' }}>{sw.name}</h4>
                                                            {sw.description && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ti-text-secondary)', lineHeight: 1.4 }}><strong>{osName}</strong> - {sw.description}</p>}
                                                            {sw.release_date && <span style={{ fontSize: '0.75rem', color: 'var(--ti-text-muted)', display: 'block', marginTop: '0.25rem' }}>Released: {sw.release_date}</span>}
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                                                        <a href={sw.url || '#'} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', textDecoration: 'none' }}>
                                                            <Download size={16} /> Download {sw.variant || 'Image'}
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {softwareList.filter(sw => {
                                            if (activeFilter === 'All') return true;
                                            const variantText = (sw.variant || sw.name || "").toLowerCase();
                                            const distroText = (sw.distro || "").toLowerCase();
                                            if (activeFilter === 'Desktop') return variantText.includes('desktop') || variantText.includes('gnome') || variantText.includes('kde') || variantText.includes('xfce');
                                            if (activeFilter === 'Minimal') return variantText.includes('minimal') || variantText.includes('server') || variantText.includes('cli');
                                            if (activeFilter === 'Ubuntu') return distroText.includes('noble') || distroText.includes('jammy') || distroText.includes('focal') || distroText.includes('ubuntu');
                                            if (activeFilter === 'Debian') return distroText.includes('bookworm') || distroText.includes('bullseye') || distroText.includes('sid') || distroText.includes('debian');
                                            return true;
                                        }).length === 0 && (
                                                <div style={{ color: 'var(--ti-text-muted)', gridColumn: '1 / -1', padding: '2rem 0', textAlign: 'center' }}>
                                                    No images found matching the current filter.
                                                </div>
                                            )}

                                        {!showAllArmbian && softwareList.length > 3 && (
                                            <div style={{ textAlign: 'center', marginTop: '1.5rem', gridColumn: '1 / -1' }}>
                                                <button onClick={() => setShowAllArmbian(true)} className="btn-outline">
                                                    Show all image options
                                                </button>
                                            </div>
                                        )}
                                        {showAllArmbian && (
                                            <div style={{ textAlign: 'center', marginTop: '1.5rem', gridColumn: '1 / -1' }}>
                                                <button onClick={() => {
                                                    setShowAllArmbian(false);
                                                    setActiveFilter('All');
                                                }} className="btn-outline">
                                                    Show fewer options
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Bottom Row: Official OS Support Sections (Condensed) */}
                    {Object.keys((activeEvmData.softwareSupport || baseEvm.softwareSupport) || {}).length > 0 && (
                        <div style={{ marginTop: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Official Software Deployment Options</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                                {Object.entries((activeEvmData.softwareSupport || baseEvm.softwareSupport) || {}).map(([category, items]) => (
                                    <div key={category} style={{ backgroundColor: 'var(--ti-bg-base)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ backgroundColor: 'rgba(0, 135, 124, 0.05)', padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <h4 style={{ margin: 0, color: 'var(--ti-teal)', fontSize: '1.1rem' }}>{category}</h4>
                                        </div>
                                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                                            {items.map((item, index) => (
                                                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                                                    <div>
                                                        <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--ti-text-primary)' }}>{item.name}</h5>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ti-text-secondary)', lineHeight: 1.4 }}>{item.description}</p>
                                                    </div>
                                                    <div style={{ marginTop: 'auto' }}>
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                                                            <ExternalLink size={14} /> View Documentation
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
