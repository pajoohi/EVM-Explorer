import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Layers, Cpu, Code, Settings, ExternalLink, Image as ImageIcon, Terminal, Wrench, BookOpen, X, FileText, LayoutDashboard, Zap } from 'lucide-react';
import evmData from '../data/evmIndex.json';
import EVMCarousel from '../components/EVMCarousel';
import AvailableSoftware from '../components/AvailableSoftware';

export default function EVMDetails() {
    const { id } = useParams();
    const evm = evmData.evms.find(e => e.id === id);

    const [activeVariant, setActiveVariant] = useState(() => (evm?.variants ? evm.variants[0].id : null));

    // Evaluate the active EVM data context (variant vs base EVM)
    const activeEvmData = evm?.variants ? evm.variants.find(v => v.id === activeVariant) : evm;

    // Default revision derived from active EVM data context
    const defaultRevision = activeEvmData?.revisions ? activeEvmData.revisions[activeEvmData.revisions.length - 1] : "1.0";

    // Since defaultRevision depends on activeEvmData, we initialize it but will also forcibly push updates on variant changes
    const [activeRevision, setActiveRevision] = useState(defaultRevision);
    const [descriptionExpanded, setDescriptionExpanded] = useState(true);
    const [showToolsMenu, setShowToolsMenu] = useState(false);
    const [showDocsMenu, setShowDocsMenu] = useState(false);
    const [showDesignMenu, setShowDesignMenu] = useState(false);

    const handleVariantChange = (variantId) => {
        setActiveVariant(variantId);
        const variantData = evm.variants.find(v => v.id === variantId);
        if (variantData?.revisions) {
            setActiveRevision(variantData.revisions[variantData.revisions.length - 1]);
        }
    };

    if (!evm) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>EVM Not Found</h2>
                <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
            </div>
        );
    }

    // Dependent paths
    const baseUrl = import.meta.env.BASE_URL || '/';
    const stlPath = activeEvmData.hasStl || evm.hasStl ? `${baseUrl}evms/${evm.id}/models/${activeRevision.toLowerCase()}/board.stl` : null;
    const bomPath = activeEvmData.bomLink || evm.bomLink || `${baseUrl}evms/${evm.id}/bom/ibom.html`;

    // Create image arrays for the carousel based on JSON metadata or revision fallbacks
    const carouselImages = activeEvmData.images
        ? activeEvmData.images.map(img => `${baseUrl}evms/${evm.id}/images/${img}`)
        : [
            activeEvmData.heroImage && activeEvmData.heroImage.startsWith('http')
                ? activeEvmData.heroImage
                : `${baseUrl}evms/${evm.id}/images/${activeEvmData.heroImage || `hero_${activeRevision}.webp`}`
        ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Navigation Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ti-text-secondary)' }}>
                    <ArrowLeft size={20} />
                    <span>Back to Explorer</span>
                </Link>
                <span className={`badge badge-${evm.family}`}>
                    {evmData.families.find(f => f.id === evm.family)?.name.toUpperCase()}
                </span>
            </div>
            
            <div style={{ marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.15rem', color: 'var(--ti-text-primary)' }}>
                    {evm.name.startsWith('AM') && <span style={{ color: 'var(--ti-red)' }}>AM</span>}
                    {evm.name.startsWith('AM') ? evm.name.slice(2).split('Starter Kit')[0] : evm.name.split('Starter Kit')[0]}
                    {evm.name.includes('Starter Kit') && (
                        <><span style={{ color: 'var(--ti-red)' }}>S</span>tarter <span style={{ color: 'var(--ti-red)' }}>K</span>it</>
                    )}
                    {evm.name.includes('Starter Kit') ? evm.name.split('Starter Kit')[1] : ''}
                </h1>
                <div style={{ color: 'var(--ti-text-muted)', fontSize: '0.95rem' }}>Part Num: {activeEvmData.partNumber || activeEvmData.id.toUpperCase()}</div>
            </div>

            <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>

                {/* Left Column: Media & 3D */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Media & Description Card */}
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <EVMCarousel key={`${evm.id}-${activeVariant}`} images={carouselImages} stlPath={stlPath} />

                        {/* Description area */}
                        <div style={{ padding: '0 0.5rem' }}>
                            <div
                                style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer', marginBottom: descriptionExpanded ? '0' : 'o', height: '0', position: 'relative', zIndex: 10 }}
                                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                            >
                                <div style={{ background: 'var(--ti-bg-surface-elevated)', borderRadius: '50%', padding: '0.25rem', border: '1px solid var(--ti-border)' }}>
                                    {descriptionExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {descriptionExpanded && (
                                <div style={{ marginTop: '0.5rem', color: 'var(--ti-text-secondary)', lineHeight: 1.8 }}>
                                    <p style={{ marginBottom: '1rem' }}>
                                        The <strong>{activeEvmData.name}</strong> ({activeEvmData.id}) is a powerful development platform designed for high-performance industrial and automotive applications.
                                        It features advanced processing capabilities, rich connectivity options, and robust power management.
                                    </p>
                                    <p>
                                        {activeEvmData.shortDescription}. Detailed schematics, datasheets, and design files are typically available within the hardware development kit documentation.
                                    </p>

                                    {/* Revision Notes */}
                                    {activeEvmData.revisionNotes && activeEvmData.revisionNotes[activeRevision] && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--ti-bg-surface-elevated)', borderRadius: '8px', borderLeft: '4px solid var(--ti-teal)' }}>
                                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--ti-text-primary)' }}>Revision {activeRevision} Notes</h4>
                                            <p style={{ margin: 0 }}>{activeEvmData.revisionNotes[activeRevision]}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column: Meta & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Variant Selector block */}
                    {evm.variants && (
                        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--ti-teal)', background: 'rgba(0, 135, 124, 0.05)' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--ti-teal)' }}>Select Board Variant</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--ti-text-secondary)', marginBottom: '1rem' }}>
                                This EVM family comes in several different variants. Select a configuration below to explore its specific features and downloads.
                            </p>
                            <select
                                value={activeVariant}
                                onChange={(e) => handleVariantChange(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--ti-bg-surface)',
                                    color: 'var(--ti-text-primary)',
                                    border: '1px solid var(--ti-border)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {evm.variants.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )}


                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Layers size={18} color="var(--ti-teal)" />
                            Hardware Revisions
                        </h4>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {activeEvmData.revisions?.map(rev => (
                                <button
                                    key={rev}
                                    onClick={() => setActiveRevision(rev)}
                                    style={{
                                        flex: '1',
                                        padding: '0.75rem',
                                        background: activeRevision === rev ? 'rgba(0, 135, 124, 0.15)' : 'transparent',
                                        border: `1px solid ${activeRevision === rev ? 'var(--ti-teal)' : 'var(--ti-border)'}`,
                                        color: activeRevision === rev ? 'var(--ti-teal)' : 'var(--ti-text-secondary)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    {rev}
                                </button>
                            ))}
                        </div>
                        {evm.revisions?.length > 1 && (
                            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ti-text-muted)', textAlign: 'center' }}>
                                Toggling revision updates loaded schematics and 3D models.
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => setShowDesignMenu(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontFamily: 'inherit', fontSize: '1rem' }}>
                            <Settings size={18} /> Design Files
                        </button>
                        <button onClick={() => setShowToolsMenu(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontFamily: 'inherit', fontSize: '1rem' }}>
                            <Wrench size={18} /> Design & Development Tools
                        </button>
                        <button onClick={() => setShowDocsMenu(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontFamily: 'inherit', fontSize: '1rem' }}>
                            <BookOpen size={18} /> Documentation
                        </button>
                        {(activeEvmData.hasBom || activeEvmData.bomLink || evm.hasBom || evm.bomLink) && (
                            <a href={bomPath} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                                <Code size={18} /> Interactive BOM
                            </a>
                        )}
                        {(activeEvmData.processorSpecsLink || evm.processorSpecsLink) ? (
                            <a href={(activeEvmData.processorSpecsLink || evm.processorSpecsLink)} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                                <Cpu size={18} /> View Processor Specs
                            </a>
                        ) : (
                            <button className="btn-outline" disabled style={{ width: '100%', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed' }}>
                                <Cpu size={18} /> Processor Specs Unavailable
                            </button>
                        )}
                        {((activeEvmData.flashingSupported !== undefined ? activeEvmData.flashingSupported : evm.flashingSupported) || activeEvmData.cicdLink || evm.cicdLink) && (
                            <button onClick={() => document.getElementById('software-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontFamily: 'inherit', fontSize: '1rem' }}>
                                <Terminal size={18} /> Software Options
                            </button>
                        )}
                        {(activeEvmData.officialLink || evm.officialLink) && (
                            <a href={(activeEvmData.officialLink || evm.officialLink)} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                                <ExternalLink size={18} /> Official EVM Page
                            </a>
                        )}
                    </div>

                </div>

            </div>

            {/* Software/Flashing Section */}
            <AvailableSoftware baseEvm={evm} activeEvmData={activeEvmData} />

            {/* Modals for Tools and Documentation */}
            {showDesignMenu && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowDesignMenu(false)}>
                    <div className="modal-animate-in" style={{ backgroundColor: 'var(--ti-bg-surface-elevated)', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid var(--ti-teal)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(0, 135, 124, 0.1)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--ti-text-primary)' }}><Settings size={20} color="var(--ti-teal)" /> Design Files - Revision {activeRevision}</h3>
                            <button onClick={() => setShowDesignMenu(false)} style={{ background: 'none', border: 'none', color: 'var(--ti-text-muted)', cursor: 'pointer', padding: '0.25rem' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {activeEvmData.designFiles && activeEvmData.designFiles[activeRevision] ? (
                                Object.entries(activeEvmData.designFiles[activeRevision])
                                  .sort(([a], [b]) => {
                                    if (a === "Full Design Package") return 1;
                                    if (b === "Full Design Package") return -1;
                                    return 0;
                                  })
                                  .map(([category, files]) => (
                                    <div 
                                      key={category} 
                                      style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        padding: '1rem', 
                                        backgroundColor: 'var(--ti-bg-base)', 
                                        border: '1px solid var(--glass-border)', 
                                        borderRadius: '8px',
                                        gap: '1rem'
                                      }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                          <FileText size={18} color="var(--ti-teal)" />
                                          <span style={{ fontWeight: 600, color: 'var(--ti-text-primary)', fontSize: '0.95rem' }}>{category}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            {files.map((file, idx) => {
                                                const extension = file.split('.').pop().toUpperCase();
                                                return (
                                                  <a
                                                      key={idx}
                                                      href={`${baseUrl}evms/${evm.id}/design/${activeRevision}/${file}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="design-format-btn"
                                                  >
                                                      {extension}
                                                  </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ti-text-muted)' }}>
                                    <Settings size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>No design files found for revision {activeRevision}.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showToolsMenu && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowToolsMenu(false)}>
                    <div className="modal-animate-in" style={{ backgroundColor: 'var(--ti-bg-surface-elevated)', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid var(--ti-teal)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(0, 135, 124, 0.1)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--ti-text-primary)' }}><Wrench size={20} color="var(--ti-teal)" /> Design & Development Tools</h3>
                            <button onClick={() => setShowToolsMenu(false)} style={{ background: 'none', border: 'none', color: 'var(--ti-text-muted)', cursor: 'pointer', padding: '0.25rem' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href="https://dev.ti.com/sysconfig/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                <LayoutDashboard size={24} color="var(--ti-teal)" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontWeight: 600 }}>SysConfig Tool</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--ti-text-secondary)' }}>Intuitive graphical user interface for configuring pins, peripherals, and subsystems.</span>
                                </div>
                            </a>
                            <a href="https://dev.ti.com/sysconfig/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                <Cpu size={24} color="var(--ti-teal)" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontWeight: 600 }}>DDR Configuration</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--ti-text-secondary)' }}>System configuration tool for optimizing memory controllers and timing requirements.</span>
                                </div>
                            </a>
                            {evm.powerEstimationLink && (
                                <a href={evm.powerEstimationLink || "https://dev.ti.com/powerestimator"} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                    <Zap size={24} color="var(--ti-teal)" />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontWeight: 600 }}>Power Estimation Tool</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--ti-text-secondary)' }}>Estimate power consumption across various application profiles.</span>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDocsMenu && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowDocsMenu(false)}>
                    <div className="modal-animate-in" style={{ backgroundColor: 'var(--ti-bg-surface-elevated)', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid var(--ti-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'var(--ti-bg-base)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--ti-text-primary)' }}><BookOpen size={20} color="var(--ti-text-secondary)" /> Documentation</h3>
                            <button onClick={() => setShowDocsMenu(false)} style={{ background: 'none', border: 'none', color: 'var(--ti-text-muted)', cursor: 'pointer', padding: '0.25rem' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>

                            {/* Software Documentation */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h4 style={{ margin: 0, color: 'var(--ti-teal)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Software Documentation</h4>
                                <a href="https://software-dl.ti.com/processor-sdk-linux/esd/AM62X/latest/exports/docs/devices/AM62X/index.html" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                    <Terminal size={18} color="var(--ti-text-muted)" />
                                    <span style={{ fontSize: '0.95rem' }}>Processor SDK Linux Guides</span>
                                </a>
                            </div>

                            {/* Hardware Documentation */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h4 style={{ margin: 0, color: 'var(--ti-teal)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Hardware Documentation</h4>
                                {(activeEvmData.processorSpecsLink || evm.processorSpecsLink) && (
                                    <a href={activeEvmData.processorSpecsLink || evm.processorSpecsLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                        <Cpu size={18} color="var(--ti-text-muted)" />
                                        <span style={{ fontSize: '0.95rem' }}>Processor Datasheet & TRM</span>
                                    </a>
                                )}
                                {(activeEvmData.officialLink || evm.officialLink) && (
                                    <a href={activeEvmData.officialLink || evm.officialLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                        <FileText size={18} color="var(--ti-text-muted)" />
                                        <span style={{ fontSize: '0.95rem' }}>EVM User Guide & Errata</span>
                                    </a>
                                )}
                            </div>

                            {/* Design Documentation */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h4 style={{ margin: 0, color: 'var(--ti-teal)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Design Documentation</h4>
                                {(activeEvmData.designFilesLink || evm.designFilesLink) && (
                                    <a href={activeEvmData.designFilesLink || evm.designFilesLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                        <Layers size={18} color="var(--ti-text-muted)" />
                                        <span style={{ fontSize: '0.95rem' }}>PCB Layout Guidelines & Schematics</span>
                                    </a>
                                )}
                                <a href="https://www.ti.com/product/AM625#tech-docs" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', backgroundColor: 'var(--ti-bg-base)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--ti-text-primary)' }}>
                                    <BookOpen size={18} color="var(--ti-text-muted)" />
                                    <span style={{ fontSize: '0.95rem' }}>Application Notes & Technical Briefs</span>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 900px) {
          .layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
