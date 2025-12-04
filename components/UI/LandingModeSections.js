"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'

import { Button } from 'react-bootstrap';
import GallerySection from '@/components/UI/Gallery';

export default function LandingModeSections() {
    return (
        <>
            <div className='container mb-5'>

                <div className='text-center'>
                    <h2 className=''>Features</h2>
                    <p>How this tool assists in managing and auditing your projects effectively.</p>

                    <div className='d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-4'>

                        <div className='feature-card card card-articles card-sm' style={{ "width": "18rem" }}>
                            <div className='card-body'>
                                <i className='fad fa-eye fa-5x mb-3'></i>
                                <h5 className='card-title'>Auditing</h5>
                                <p style={{ minHeight: '120px' }} className='card-text'>Automatically scans specified directories to identify and catalog all NPM projects, ensuring no project is overlooked.</p>
                            </div>
                        </div>

                        <div className='feature-card card card-articles card-sm' style={{ "width": "18rem" }}>
                            <div className='card-body'>
                                <i className='fad fa-bell fa-5x mb-3'></i>
                                <h5 className='card-title'>Alerting</h5>
                                <p style={{ minHeight: '120px' }} className='card-text'>Provides in-depth information about each project, including dependencies, scripts, and metadata, facilitating better project management.</p>
                            </div>
                        </div>

                        <div className='feature-card card card-articles card-sm' style={{ "width": "18rem" }}>
                            <div className='card-body'>
                                <i className='fad fa-edit fa-5x mb-3'></i>
                                <h5 className='card-title'>Editing</h5>
                                <p style={{ minHeight: '120px' }} className='card-text'>Apply changes directly to your project configurations and dependencies through an intuitive interface.</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <GallerySection />

            <div className='container mb-5 mt-5'>

                <div className='text-center'>
                    <h2 className=''>Setup</h2>
                    <p>Very easy setup process. Limited to Windows only at this time.</p>

                    <div className='d-flex flex-column flex-md-row justify-content-center align-items-center'>
                        <ul>
                            <li>NPM ^11</li>
                            <li>Node ^24</li>
                        </ul>
                    </div>

                    <div className="text-start mx-auto mb-4" style={{ maxWidth: '600px' }}>
                        <div className="card bg-dark text-white border-0 shadow-lg" style={{ fontFamily: 'monospace' }}>
                            <div className="card-header border-bottom border-secondary d-flex align-items-center py-2">
                                <div className="d-flex gap-2 me-3">
                                    <div className="rounded-circle bg-danger" style={{ width: '12px', height: '12px' }}></div>
                                    <div className="rounded-circle bg-warning" style={{ width: '12px', height: '12px' }}></div>
                                    <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
                                </div>
                                <small className="text-muted">terminal</small>
                            </div>
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <span className="text-success me-2">➜</span>
                                    <span className="text-info me-2">~</span>
                                    <span>git clone https://github.com/Articles-Joey/project-manager.git</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <span className="text-success me-2">➜</span>
                                    <span className="text-info me-2">project-manager</span>
                                    <span>npm install</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="text-success me-2">➜</span>
                                    <span className="text-info me-2">project-manager</span>
                                    <span>npm run dev</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>In the settings of the app in the Folders tab is where you can add more site locations to be scanned.</div>

                </div>

            </div>

            <div className='bg-black text-white w-100 py-5'>
                <div className='container'>

                    <div className='text-center'>
                        <h2 className=''>Open Source</h2>
                        <p>Help make Node Project Manager better by contributing to our open source repository on GitHub.</p>
                        <Link target='_blank' href='https://github.com/Articles-Joey/project-manager'>
                            <Button
                                variant='articles'
                            >
                                <i className="fab fa-github"></i>
                                View on GitHub
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>

            <div className='container mt-5'>

                <div className='text-center'>
                    <h2 className=''>Artwork</h2>
                    <p>AI graphic about this software that came out bad and no one asked for.</p>
                    <img
                        src='/img/graphic.webp'
                        alt="AI graphic about this software that came out bad and no one asked for."
                    />
                </div>

            </div>
        </>
    )
}