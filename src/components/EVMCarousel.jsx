import { useState, Suspense, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Box, Download } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Preload } from '@react-three/drei';
import EVMModel from './EVMViewer3D';

export default function EVMCarousel({ images = [], stlPath }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset carousel index when the board or variant changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [images, stlPath]);

    const totalItems = images.length + (stlPath ? 1 : 0);

    if (totalItems === 0) {
        return (
            <div style={{
                height: '300px',
                backgroundColor: 'var(--ti-bg-surface-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ti-text-muted)', borderRadius: '8px'
            }}>
                No Images Available
            </div>
        );
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    };

    const is3DActive = stlPath && currentIndex === images.length;

    return (
        <div className="carousel-container" style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>

            {/* Main Image Stage */}
            <div style={{
                height: '400px',
                backgroundColor: 'var(--ti-bg-surface-elevated)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Image vs 3D Content */}
                {is3DActive ? (
                    <>
                        <Canvas shadows camera={{ position: [0, 0, 150], fov: 45 }}>
                            <Suspense fallback={null}>
                                <Stage environment="city" intensity={0.5}>
                                    <EVMModel url={stlPath} />
                                </Stage>
                            </Suspense>
                            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
                            <Preload all />
                        </Canvas>

                        {/* Download Overlay */}
                        <a
                            href={stlPath}
                            download
                            className="btn-primary"
                            style={{
                                position: 'absolute',
                                bottom: '1rem',
                                right: '1rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                zIndex: 10,
                                textDecoration: 'none'
                            }}
                        >
                            <Download size={16} />
                            Download STL
                        </a>
                    </>
                ) : (
                    <>
                        <img
                            src={images[currentIndex]}
                            alt="EVM View"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <div style={{ color: 'var(--ti-text-muted)', display: 'none', position: 'absolute' }}>
                            Image Load Failed: {images[currentIndex]?.split('/').pop() || 'Unknown'}
                        </div>
                    </>
                )}

                {/* Controls */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            style={{
                                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                                background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'background var(--transition-fast)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--ti-teal)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            style={{
                                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'background var(--transition-fast)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--ti-teal)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {totalItems > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: '80px', height: '60px', flexShrink: 0,
                                backgroundColor: 'var(--ti-bg-surface-elevated)',
                                border: `2px solid ${currentIndex === idx ? 'var(--ti-teal)' : 'transparent'}`,
                                borderRadius: '4px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                    ))}

                    {stlPath && (
                        <div
                            onClick={() => setCurrentIndex(images.length)}
                            style={{
                                width: '80px', height: '60px', flexShrink: 0,
                                backgroundColor: 'var(--ti-bg-surface-elevated)',
                                border: `2px solid ${currentIndex === images.length ? 'var(--ti-teal)' : 'transparent'}`,
                                borderRadius: '4px', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', color: currentIndex === images.length ? 'var(--ti-teal)' : 'var(--ti-text-muted)'
                            }}
                        >
                            <Box size={24} />
                            <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: '500' }}>3D Model</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
