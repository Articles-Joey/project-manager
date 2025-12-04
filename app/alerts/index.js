'use client';

import { useProjects } from '@/components/hooks/useProjects';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

import 'styles/pages/alerts.scss';

export default function Alerts() {
    const { packages, isLoading, isError } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeverities, setSelectedSeverities] = useState([]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading packages</div>;

    const filteredPackages = packages.filter(pkg => {
        const name = pkg?.name || pkg._folderName || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className='alerts-page'>

            <div className='side-menu'>
                <h3>Filter by Severity</h3>
                {['info', 'low', 'moderate', 'high', 'critical'].map((severity) => (
                    <Button
                        key={severity}
                        variant={selectedSeverities.includes(severity) ? 'primary' : 'outline-secondary'}
                        className="d-block w-100 mb-2 text-capitalize"
                        onClick={() => {
                            setSelectedSeverities(prev =>
                                prev.includes(severity)
                                    ? prev.filter(s => s !== severity)
                                    : [...prev, severity]
                            );
                        }}
                    >
                        {severity}
                    </Button>
                ))}
            </div>

            <div className='content'>

                <h1>Alerts ({packages.length})</h1>

                <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        backgroundColor: '#333',
                        color: '#fff'
                    }}
                />

                <div
                    style={{
                        display: 'grid',
                        gap: '20px',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                    }}
                >

                    {filteredPackages.map((pkg) => {
                        return (
                            <div key={pkg._folderPath} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#222' }}>
                                <h2 style={{ marginTop: 0 }}>{pkg?.name || pkg._folderName}</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <div><strong>Severity:</strong> {pkg.version || '0.0.0'}</div>
                                    {/* <div><strong>Date:</strong> {new Date(pkg._mtime).toLocaleString()}</div>
                                <div><strong>Author:</strong> {pkg.author || 'Unknown'}</div>
                                <div><strong>React:</strong> {reactVersion}</div>
                                <div><strong>Next.js:</strong> {nextVersion}</div> */}
                                </div>
                                {/* <Button
                                variant="dark"
                                className='border mt-2'
                                onClick={() => {
                                    fetch(`/api/audit?path=${encodeURIComponent(pkg._folderPath)}`, {
                                        method: 'GET',
                                        // query: {
                                        //     path: pkg._folderPath
                                        // }
                                    })
                                }}
                            >
                                Audit
                            </Button>
                            <Button
                                variant="dark"
                                className='border mt-2'
                                onClick={() => {
                                    fetch(`/api/open-folder?path=${encodeURIComponent(pkg._folderPath)}`, {
                                        method: 'GET',
                                        // query: {
                                        //     path: pkg._folderPath
                                        // }
                                    })
                                }}
                            >
                                Open Folder
                            </Button>
                            <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#888', wordBreak: 'break-all' }}>
                                {pkg._folderPath}
                            </div> */}
                            </div>
                        );
                    })}
                </div>

            </div>

        </div>
    );
}
