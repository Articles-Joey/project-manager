'use client';

import { useMemo, useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useProjects } from '../../components/hooks/useProjects';
import ProjectItem from '@/components/UI/ProjectItem';

import '@/styles/pages/projects.scss';
import useProjectSearchStore from '@/components/hooks/useProjectSearchStore';
import { useStore } from '@/components/hooks/useStore';

export default function ProjectsList() {

    const { packages, isLoading, isError, mutate: mutateProjects } = useProjects();
    const auditHistory = useStore((state) => state.auditHistory);

    const searchTerm = useProjectSearchStore((state) => state.searchTerm);
    const setSearchTerm = useProjectSearchStore((state) => state.setSearchTerm);
    const packageSearchTerm = useProjectSearchStore((state) => state.packageSearchTerm);
    const setPackageSearchTerm = useProjectSearchStore((state) => state.setPackageSearchTerm);
    const visibilityFilter = useProjectSearchStore((state) => state.visibilityFilter);
    const setVisibilityFilter = useProjectSearchStore((state) => state.setVisibilityFilter);
    const selectedPackages = useProjectSearchStore((state) => state.selectedPackages);
    const toggleSelectedPackage = useProjectSearchStore((state) => state.toggleSelectedPackage);
    const clearSelectedPackages = useProjectSearchStore((state) => state.clearSelectedPackages);

    const filteredPackages = packages.filter(pkg => {
        const name = pkg?.name || pkg._folderName || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());

        if (visibilityFilter !== null) {
            if (visibilityFilter === 'unset') {
                if (pkg.private !== undefined) return false;
            } else {
                if (pkg.private !== visibilityFilter) return false;
            }
        }

        if (selectedPackages.length > 0) {
            const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            const hasAll = selectedPackages.every(p => Object.prototype.hasOwnProperty.call(allDeps, p));
            if (!hasAll) return false;
        }

        return matchesSearch;
    });

    const uniquePackages = useMemo(() => {
        const depCounts = {};
        packages.forEach(pkg => {
            const seenInPkg = new Set();
            if (pkg.dependencies) {
                Object.keys(pkg.dependencies).forEach(dep => seenInPkg.add(dep));
            }
            if (pkg.devDependencies) {
                Object.keys(pkg.devDependencies).forEach(dep => seenInPkg.add(dep));
            }

            seenInPkg.forEach(dep => {
                depCounts[dep] = (depCounts[dep] || 0) + 1;
            });
        });

        return Object.entries(depCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [packages]);

    const visibilityCounts = useMemo(() => {
        const counts = {
            any: packages.length,
            private: 0,
            public: 0,
            unset: 0
        };

        packages.forEach(pkg => {
            if (pkg.private === true) {
                counts.private++;
            } else if (pkg.private === false) {
                counts.public++;
            } else {
                counts.unset++;
            }
        });

        return counts;
    }, [packages]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading packages</div>;

    return (
        <div className='projects-page'>

            <div className='side-menu'>

                <h3>Filters</h3>

                <Dropdown className="d-flex w-100 text-center mb-2">

                    <Dropdown.Toggle variant='articles w-100 d-flex justify-content-center align-items-center text-center'>
                        Packages
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <div className="d-flex p-2 sticky-top border-bottom">
                            <input
                                type="text"
                                placeholder="Search packages..."
                                className="form-control form-control-sm"
                                value={packageSearchTerm}
                                onChange={(e) => setPackageSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                                size='sm'
                                variant='dark'
                                onClick={() => {
                                    setPackageSearchTerm('');
                                }}
                            >
                                <i className="fas fa-eraser"></i>
                            </Button>
                        </div>

                        {uniquePackages.filter(p => p.name.toLowerCase().includes(packageSearchTerm.toLowerCase())).map((package_obj, i) => {
                            const isSelected = selectedPackages.includes(package_obj.name);
                            return (
                                <Dropdown.Item
                                    key={`${i}-${package_obj.name}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleSelectedPackage(package_obj.name);
                                    }}
                                    active={isSelected}
                                    className=""
                                    eventKey={i}
                                >
                                    {/* <i className="fad fa-user" aria-hidden="true"></i> */}
                                    {package_obj.name} ({package_obj.count})
                                </Dropdown.Item>
                            )
                        })}

                    </Dropdown.Menu>

                </Dropdown>

                <Dropdown className="d-flex w-100 text-center mb-2">

                    <Dropdown.Toggle variant='articles w-100 d-flex justify-content-center align-items-center text-center'>
                        Visibility
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {[
                            { label: "Any", value: null, count: visibilityCounts.any },
                            { label: "Private", value: true, count: visibilityCounts.private },
                            { label: "Public", value: false, count: visibilityCounts.public },
                            { label: "Unset", value: 'unset', count: visibilityCounts.unset },
                        ].map((item, i) => {
                            return (
                                <Dropdown.Item
                                    key={`${i}-${item.label}`}
                                    onClick={() => {
                                        setVisibilityFilter(item.value)
                                    }}
                                    active={visibilityFilter === item.value}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>{item.label}</span>
                                    <span className="badge bg-articles border text-black ms-2">{item.count}</span>
                                </Dropdown.Item>
                            )
                        })}

                    </Dropdown.Menu>

                </Dropdown>

            </div>

            <div className='content'>

                <div className='d-flex justify-content-between'>

                    <h1>Projects ({packages.length})</h1>

                    <div>
                        <Button
                            className='border'
                            variant='articles'
                            onClick={() => {
                                fetch('/api/audit/all', { 
                                    method: 'POST',
                                    body: JSON.stringify({
                                        projects: packages.map(pkg => pkg._folderPath),
                                        limit: 2,
                                        auditHistory: auditHistory ? true : false,
                                    }),
                                })
                                    .then(res => {
                                        
                                        const data = res.json();
                                        console.log("Data", data)

                                    })
                                    // .then(data => {});
                            }}
                        >
                            Audit All
                        </Button>
                        <Button
                            className='border'
                            variant='articles'
                            onClick={() => {
                                // alert("TODO")
                                mutateProjects()
                            }}
                        >
                            Refresh
                        </Button>
                    </div>

                </div>

                <div className='d-flex mb-1'>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '0px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: '#333',
                            color: '#fff'
                        }}
                    />
                    <Button
                        className='border'
                        variant='articles'
                        disabled={!searchTerm}
                        onClick={() => {
                            setSearchTerm('');
                        }}
                    >
                        <i className="fa fa-times fa-2x"></i>
                    </Button>
                </div>

                <div className='mb-3'>

                    <div className='badge bg-black border'>
                        Audited {packages?.filter(pkg => pkg["project-manager-am-metadata"])?.length || 0}/{packages?.length || 0} projects.
                    </div>

                    <div className='badge bg-black border'>
                        Showing {filteredPackages?.length || 0} of {packages?.length || 0} projects.
                    </div>

                    {selectedPackages.length > 0 &&
                        <div
                            className='badge bg-warning text-dark badge-hover border ms-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => clearSelectedPackages()}
                        >
                            <i className="fa fa-times me-1"></i>
                            {selectedPackages.length} Packages
                        </div>
                    }

                    {searchTerm &&
                        <div
                            className='badge bg-warning text-dark badge-hover border ms-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSearchTerm('')}
                        >
                            <i className="fa fa-times me-1"></i>
                            Search Term
                        </div>
                    }

                    {visibilityFilter !== null &&
                        <div
                            className='badge bg-warning text-dark badge-hover border ms-1'
                            style={{ cursor: 'pointer' }}
                            onClick={() => setVisibilityFilter(null)}
                        >
                            <i className="fa fa-times me-1"></i>
                            Visibility Filter
                        </div>
                    }

                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>

                    {filteredPackages.map((pkg, i) => {
                        return (
                            <ProjectItem
                                key={`${i}-${pkg._folderPath}`}
                                package={pkg}
                            />
                        );
                    })}

                </div>
            </div>

        </div>
    );
}
