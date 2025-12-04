'use client';

import { useProjects } from '@/components/hooks/useProjects';
import AlertItem from '@/components/UI/AlertItem';
import { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';

import 'styles/pages/alerts.scss';

export default function Alerts() {
    const { packages, isLoading, isError } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeverities, setSelectedSeverities] = useState([]);

    const alerts = useMemo(() => {
        let allAlerts = [];
        packages.forEach(pkg => {
            const vulnerabilities = pkg?.["project-manager-am-metadata"]?.audit?.vulnerabilities;
            if (vulnerabilities) {
                const vulnsArray = Array.isArray(vulnerabilities)
                    ? vulnerabilities
                    : Object.values(vulnerabilities);

                const mappedVulns = vulnsArray.map(v => ({
                    ...v,
                    parent_project: pkg.name || pkg._folderName,
                    _pkg: pkg
                }));
                allAlerts = [...allAlerts, ...mappedVulns];
            }
        });
        return allAlerts;
    }, [packages]);

    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = (
            alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.parent_project.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alert.via && Array.isArray(alert.via) && alert.via.some(v => typeof v === 'object' && v.title && v.title.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(alert.severity);
        return matchesSearch && matchesSeverity;
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading packages</div>;

    return (
        <div className='alerts-page'>

            <div className='side-menu'>

                <div className='mb-3'>
                    <h3>Display By</h3>
                    {['Vulnerability', 'Project'].map((severity) => (
                        <Button
                            key={severity}
                            variant="secondary"
                            disabled
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

                <h1>Alerts ({filteredAlerts.length})</h1>

                <input
                    type="text"
                    placeholder="Search alerts..."
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

                    {filteredAlerts.map((alert, i) => {
                        return (
                            <AlertItem
                                key={`${alert.parent_project}-${alert.name}-${i}`}
                                alert={alert}
                                index={i}
                            />
                        );
                    })}
                </div>

            </div>

        </div>
    );
}
