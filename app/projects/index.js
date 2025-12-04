'use client';

import { useMemo, useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useProjects } from '../../components/hooks/useProjects';
import ProjectItem from '@/components/UI/ProjectItem';

import '@/styles/pages/projects.scss';

export default function ProjectsList() {

    const { packages, isLoading, isError, mutate: mutateProjects } = useProjects();

    const [searchTerm, setSearchTerm] = useState('');
    const [packageSearchTerm, setPackageSearchTerm] = useState('');

    const filteredPackages = packages.filter(pkg => {
        const name = pkg?.name || pkg._folderName || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading packages</div>;

    return (
        <div className='projects-page'>

            <div className='side-menu'>
                <h3>Filters</h3>

                <Dropdown className="d-flex w-100 text-center">

                    <Dropdown.Toggle variant='articles w-100 d-flex justify-content-center align-items-center text-center'>
                        Packages
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <div className="p-2 sticky-top bg-light border-bottom">
                            <input
                                type="text"
                                placeholder="Search packages..."
                                className="form-control"
                                value={packageSearchTerm}
                                onChange={(e) => setPackageSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {uniquePackages.filter(p => p.name.toLowerCase().includes(packageSearchTerm.toLowerCase())).map((package_obj, i) => {
                            return (
                                <Dropdown.Item
                                    key={`${i}-${package_obj.name}`}
                                    onClick={() => {

                                    }}
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

            </div>

            <div className='content'>

                <div className='d-flex justify-content-between'>

                    <h1>Projects ({packages.length})</h1>

                    <div>
                        <Button
                            className='border'
                            variant='articles'
                            onClick={() => {
                                alert("TODO")
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
