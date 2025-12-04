import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const galleryImages = [
    'https://placeholdit.com/600x400/e16d50/999999',
    'https://placeholdit.com/600x400/b1fb0d/999999',
    'https://placeholdit.com/600x400/fc3988/999999',
    'https://placeholdit.com/600x400/101ba4/999999',
    'https://placeholdit.com/600x400/c82432/999999',
    'https://placeholdit.com/600x400/1fa476/999999',
    'https://placeholdit.com/600x400/884e02/999999',
    'https://placeholdit.com/600x400/f8c385/999999',
]

export default function GallerySection() {

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setActiveImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    useEffect(() => {
        if (!isAutoPlaying) {
            setTimeLeft(5);
        }
    }, [isAutoPlaying]);

    return (
        <div className="bg-black text-white w-100">
            <div className='container py-5'>
    
                <div className='text-center'>
                    <h2 className=''>Gallery</h2>
                    <p>Small collection of screenshots and examples showcasing the tool's capabilities.</p>
    
                    <div className='d-flex flex-column align-items-center mt-4'>
                        <div className="gallery-container position-relative mb-3" style={{ maxWidth: '800px', width: '100%' }}>
                            <div className="main-image-wrapper position-relative rounded overflow-hidden shadow-lg border border-secondary">
                                <img
                                    src={galleryImages[activeImageIndex]}
                                    alt={`Gallery image ${activeImageIndex + 1}`}
                                    width={800}
                                    height={500}
                                    className="img-fluid w-100"
                                    style={{ objectFit: 'cover', aspectRatio: '16/9', cursor: 'pointer' }}
                                    onClick={() => {
                                        // Optional: Add lightbox logic here if desired
                                    }}
                                />
    
                                {/* Left Navigation Button */}
                                <div
                                    className="position-absolute top-0 start-0 h-100 d-flex align-items-center justify-content-center gallery-nav-btn"
                                    style={{ width: '10%', cursor: 'pointer', zIndex: 10, background: 'transparent' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                                        setIsAutoPlaying(false);
                                    }}
                                >
                                    <i className="fas fa-chevron-left text-white fa-2x opacity-75" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}></i>
                                </div>
    
                                {/* Right Navigation Button */}
                                <div
                                    className="position-absolute top-0 end-0 h-100 d-flex align-items-center justify-content-center gallery-nav-btn"
                                    style={{ width: '10%', cursor: 'pointer', zIndex: 10, background: 'transparent' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
                                        setIsAutoPlaying(false);
                                    }}
                                >
                                    <i className="fas fa-chevron-right text-white fa-2x opacity-75" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}></i>
                                </div>
    
                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2 align-items-center" style={{ zIndex: 20 }}>
                                    {isAutoPlaying && (
                                        <span className="badge bg-articles text-black">
                                            {timeLeft}s
                                        </span>
                                    )}
                                    <Button
                                        variant="articles"
                                        size="sm"
                                        className="shadow-sm"
                                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                    >
                                        <i className={`fas fa-${isAutoPlaying ? 'pause' : 'play'} me-1`}></i>
                                        {isAutoPlaying ? 'Pause' : 'Auto'}
                                    </Button>
                                </div>
                            </div>
                        </div>
    
                        <div className="thumbnails-container d-flex gap-2 overflow-auto py-2 px-1" style={{ maxWidth: '800px' }}>
                            {galleryImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumbnail-wrapper rounded overflow-hidden border ${activeImageIndex === idx ? 'border-primary border-2' : 'border-secondary'}`}
                                    style={{
                                        cursor: 'pointer',
                                        opacity: activeImageIndex === idx ? 1 : 0.6,
                                        transition: 'all 0.2s ease',
                                        minWidth: '100px'
                                    }}
                                    onClick={() => {
                                        setActiveImageIndex(idx);
                                        setIsAutoPlaying(false); // Stop autoplay on manual interaction
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        width={100}
                                        height={60}
                                        style={{ objectFit: 'cover', width: '100px', height: '60px' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
    
                </div>
    
            </div>
        </div>
    );
}