'use client';

import ArticlesButton from '@/components/UI/Button';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import 'styles/pages/alerts.scss';

const SCREENSHOTS = [
    { id: 1, src: 'https://placehold.co/800x500/1a1a2e/e0e0e0?text=Projects+Overview', label: 'Projects Overview' },
    { id: 2, src: 'https://placehold.co/800x500/16213e/e0e0e0?text=Audit+Results', label: 'Audit Results' },
    { id: 3, src: 'https://placehold.co/800x500/0f3460/e0e0e0?text=Vulnerability+Filter', label: 'Vulnerability Filter' },
    { id: 4, src: 'https://placehold.co/800x500/533483/e0e0e0?text=Package+Details', label: 'Package Details' },
    { id: 5, src: 'https://placehold.co/800x500/e94560/e0e0e0?text=Alerts+Page', label: 'Alerts Page' },
    { id: 6, src: 'https://placehold.co/800x500/1b4332/e0e0e0?text=Settings+Modal', label: 'Settings Modal' },
    { id: 7, src: 'https://placehold.co/800x500/2d6a4f/e0e0e0?text=Dark+Mode', label: 'Dark Mode' },
    { id: 8, src: 'https://placehold.co/800x500/74c69d/111111?text=Search+%26+Filters', label: 'Search & Filters' },
    { id: 9, src: 'https://placehold.co/800x500/023e8a/e0e0e0?text=Audit+History', label: 'Audit History' },
    { id: 10, src: 'https://placehold.co/800x500/48cae4/111111?text=Project+Modal', label: 'Project Modal' },
    { id: 11, src: 'https://placehold.co/800x500/f77f00/111111?text=Credits+Modal', label: 'Credits Modal' },
    { id: 12, src: 'https://placehold.co/800x500/d62828/e0e0e0?text=Git+Diff+View', label: 'Git Diff View' },
];

export default function AboutLanding() {

    const [activeScreenshot, setActiveScreenshot] = useState(null);

    return (
        <div className='about-landing-page'>

            <div className='side-menu'>

                <Link
                    href="https://github.com/Articles-Joey/project-manager"
                    target='_blank'
                    rel="noreferrer"
                    className='mb-3 d-block'
                >
                    <ArticlesButton
                        className={`w-100`}
                        small
                        onClick={() => {

                        }}
                    >
                        <i className='fad fa-link me-2'></i>
                        Visit AMPM GitHub
                    </ArticlesButton>
                </Link>

                <Link
                    href="https://articles.media"
                    target='_blank'
                    rel="noreferrer"
                    className='mb-3 d-block'
                >
                    <ArticlesButton
                        className={`w-100`}
                        small
                        onClick={() => {

                        }}
                    >
                        <i className='fad fa-link me-2'></i>
                        Visit Articles Media
                    </ArticlesButton>
                </Link>

            </div>

            <div className='content'>

                <h1>Welcome</h1>
                <p>Articles Media Project Manager is a tool created to help manage and track projects efficiently.</p>

                <h2>Features</h2>
                <ul>
                    <li>Project Organization: Keep all your projects organized in one place.</li>
                    <li>Vulnerability Management: Identify and manage vulnerabilities in your projects.</li>
                    <li>Audit Tracking: Keep track of audits and their results.</li>
                    <li>Package Management: Manage your project dependencies and packages.</li>
                    <li>Customizable Filters: Use various filters to find specific projects or vulnerabilities.</li>
                </ul>

                <h2>Screenshots</h2>

                <div className='row row-cols-2 row-cols-lg-6 g-2 mb-3'>
                    {SCREENSHOTS.map((shot) => (
                        <div key={shot.id} className='col'>
                            <div
                                className='ratio ratio-16x9 bg-black rounded overflow-hidden border border-secondary'
                                style={{ cursor: 'pointer' }}
                                onClick={() => setActiveScreenshot(shot)}
                            >
                                <img
                                    src={shot.src}
                                    alt={shot.label}
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            </div>
                            <div className='text-center small text-muted mt-1'>{shot.label}</div>
                        </div>
                    ))}
                </div>

                <Modal
                    show={!!activeScreenshot}
                    onHide={() => setActiveScreenshot(null)}
                    size='xl'
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{activeScreenshot?.label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        <img
                            src={activeScreenshot?.src}
                            alt={activeScreenshot?.label}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-between'>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                const idx = SCREENSHOTS.findIndex(s => s.id === activeScreenshot.id);
                                setActiveScreenshot(SCREENSHOTS[(idx - 1 + SCREENSHOTS.length) % SCREENSHOTS.length]);
                            }}
                        >
                            <i className='fas fa-chevron-left me-1'></i> Prev
                        </Button>
                        <span className='text-muted small'>
                            {SCREENSHOTS.findIndex(s => s.id === activeScreenshot?.id) + 1} / {SCREENSHOTS.length}
                        </span>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                const idx = SCREENSHOTS.findIndex(s => s.id === activeScreenshot.id);
                                setActiveScreenshot(SCREENSHOTS[(idx + 1) % SCREENSHOTS.length]);
                            }}
                        >
                            Next <i className='fas fa-chevron-right ms-1'></i>
                        </Button>
                    </Modal.Footer>
                </Modal>

                <h2>Roadmap</h2>
                <ul>
                    <li>Switch to electron for desktop application support.</li>
                </ul>

            </div>

        </div>
    );
}
