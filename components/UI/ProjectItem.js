import { Accordion, Button, Dropdown, OverlayTrigger, Popover, Toast, ToastContainer } from "react-bootstrap"
import { useStore } from "../hooks/useStore";
import { useProjects } from "../hooks/useProjects";
import { useEffect, useState } from "react";

import TextareaAutosize from '@mui/material/TextareaAutosize';

import packageJson from 'package.json';
import dynamic from 'next/dynamic'

const ArticlesModal = dynamic(() => import('./ArticlesModal'))

function PackagesPreview({ dependencies, devDependencies }) {

    const reactVersion = dependencies?.react || devDependencies?.react || false;
    const nextVersion = dependencies?.next || devDependencies?.next || false;
    const expressVersion = dependencies?.express || devDependencies?.express || false;
    const threeVersion = dependencies?.three || devDependencies?.three || false;
    const vueVersion = dependencies?.vue || devDependencies?.vue || false;
    const nuxtVersion = dependencies?.nuxt || devDependencies?.nuxt || false;
    const socketIoVersion = dependencies?.['socket.io'] || devDependencies?.['socket.io'] || false;
    const socketIoClientVersion = dependencies?.['socket.io-client'] || devDependencies?.['socket.io-client'] || false;
    const gulpVersion = dependencies?.gulp || devDependencies?.gulp || false;
    const mongoDBVersion = dependencies?.mongodb || devDependencies?.mongodb || false;

    return (
        <div>

            <div className="d-flex">
                {reactVersion && <PackageOverview
                    name="React"
                    packageName="react"
                    // pkg={pkg}
                    version={reactVersion}
                />}
                {nextVersion && <PackageOverview
                    name="Next.js"
                    packageName="next"
                    // pkg={pkg}
                    version={nextVersion}
                />}
                {expressVersion && <PackageOverview
                    name="Express"
                    packageName="express"
                    // pkg={pkg}
                    version={expressVersion}
                />}
                {threeVersion && <PackageOverview
                    name="Three.js"
                    packageName="three"
                    // pkg={pkg}
                    version={threeVersion}
                />}
                {vueVersion && <PackageOverview
                    name="Vue"
                    packageName="vue"
                    // pkg={pkg}
                    version={vueVersion}
                />}
                {nuxtVersion && <PackageOverview
                    name="Nuxt"
                    packageName="nuxt"
                    // pkg={pkg}
                    version={nuxtVersion}
                />}
                {socketIoVersion && <PackageOverview
                    name="Socket.IO"
                    packageName="socket.io"
                    // pkg={pkg}
                    version={socketIoVersion}
                />}
                {socketIoClientVersion && <PackageOverview
                    name="Socket.IO Client"
                    packageName="socket.io-client"
                    // pkg={pkg}
                    version={socketIoClientVersion}
                />}
                {gulpVersion && <PackageOverview
                    name="Gulp"
                    packageName="gulp"
                    // pkg={pkg}
                    version={gulpVersion}
                />}
                {mongoDBVersion && <PackageOverview
                    name="MongoDB"
                    packageName="mongodb"
                    // pkg={pkg}
                    version={mongoDBVersion}
                />}
            </div>

        </div>
    )
}

function PackageOverview({ name, pkg, version, packageName }) {
    return (
        <OverlayTrigger placement="right"
            overlay={
                <Popover id="popover-basic">
                    <Popover.Header as="h3">
                        {name}
                    </Popover.Header>
                    <Popover.Body
                        className="py-2"
                    >
                        <div className="mb-1">
                            <span className='badge bg-success'>
                                {version}
                            </span>
                        </div>
                        View all your projects and their details in one place.
                    </Popover.Body>
                </Popover>
            }
        >

            <a target="_blank" href={`https://www.npmjs.com/package/${packageName}`}>
                <div className="border p-1">
                    {packageName === 'react' &&
                        <img width={50} height={50} src={'img/package-logos/React.svg'}></img>
                    }
                    {packageName === 'next' &&
                        <img width={50} height={50} src={'img/package-logos/Next.js.svg'}></img>
                    }
                    {packageName === 'express' &&
                        <img width={50} height={50} src={'img/package-logos/Express.svg'}></img>
                    }
                    {packageName === 'three' &&
                        <img width={50} height={50} src={'img/package-logos/Three.js.svg'}></img>
                    }
                    {packageName === 'vue' &&
                        <img width={50} height={50} src={'img/package-logos/Vue.js.svg'}></img>
                    }
                    {packageName === 'nuxt' &&
                        <img width={50} height={50} src={'img/package-logos/Nuxt.svg'}></img>
                    }
                    {packageName === 'socket.io' &&
                        <img width={50} height={50} src={'img/package-logos/Socket.IO.svg'}></img>
                    }
                    {packageName === 'socket.io-client' &&
                        <img width={50} height={50} src={'img/package-logos/Socket.IO.svg'}></img>
                    }
                    {packageName === 'gulp' &&
                        <img width={50} height={50} src={'img/package-logos/Gulp.svg'}></img>
                    }
                    {packageName === 'mongodb' &&
                        <img width={50} height={50} src={'img/package-logos/MongoDB.svg'}></img>
                    }
                </div>
            </a>

        </OverlayTrigger>
    )
}

export default function ProjectItem({
    package: pkg,
}) {

    const setActiveProject = useStore(state => state.setActiveProject);
    const auditHistory = useStore((state) => state.auditHistory)

    const { mutate: mutateProjects } = useProjects();

    const equalVersion = pkg["project-manager-details"]?.version_used === packageJson?.audit_version;

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [commitPreview, setCommitPreview] = useState(null)
    const [commitPreviewDiff, setCommitPreviewDiff] = useState(null)
    const [commitPreviewMessage, setCommitPreviewMessage] = useState("")

    useEffect(() => {

        if (commitPreview) {

            fetch(`/api/git/diff?path=${encodeURIComponent(pkg._folderPath)}`, {
                method: 'GET',
            }).then(async (res) => {
                const data = await res.json();
                setCommitPreviewDiff(data);
                console.log("Audit result for", pkg._folderName, data);
            })

        } else {
            setCommitPreviewMessage("")
            setCommitPreviewDiff(null);

        }

    }, [commitPreview]);

    return (
        <div
            key={pkg._folderPath}
            className="card card-articles border shadow-sm p-3"
        >

            {commitPreview &&
                <ArticlesModal
                    setShow={() => setCommitPreview(null)}
                    action={() => {
                        fetch(`/api/git/commit`, {
                            method: 'POST',
                            body: JSON.stringify({
                                folderPath: pkg._folderPath,
                                message: commitPreviewMessage
                            }),
                        }).then(async (res) => {
                            const data = await res.json();
                            console.log("Commit result:", data);
                            setCommitPreview(null)
                        }).catch((error) => {
                            console.error("Commit error:", error);
                        });
                    }}
                    title={`Commit Changes to ${pkg.name}`}
                    actionText={"Commit Changes"}
                >

                    <div className="mb-3">
                        {pkg.name}
                    </div>

                    <div className="mb-4">
                        <div className="fw-bold">Changed Files:</div>
                        <pre>{commitPreviewDiff?.output_names}</pre>
                    </div>

                    <Accordion className="mb-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Raw Output</Accordion.Header>
                            <Accordion.Body>
                                <pre>{commitPreviewDiff?.output}</pre>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <TextareaAutosize
                        type="text"
                        minRows={3}
                        placeholder="Commit Message"
                        className="form-control my-2"
                        value={commitPreviewMessage}
                        onChange={(e) => setCommitPreviewMessage(e.target.value)}
                    />

                </ArticlesModal>
            }

            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 2000 }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {pkg.thumbnail &&
                <div className="ratio ratio-16x9 bg-black" style={{ marginBottom: '10px', overflow: 'hidden', borderRadius: '5px' }}>
                    <img
                        src={pkg.thumbnail}
                        alt={`${pkg?.name || pkg._folderName} Thumbnail`}
                        style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                    />
                </div>
            }

            <h2 className="sensitiveMode-blur" style={{ marginTop: 0 }}>{pkg?.name || pkg._folderName}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                <div style={{ fontSize: '0.75rem' }} className="mb-2">
                    <div><strong>Version:</strong> {pkg?.version || '?'}</div>
                    <div className="sensitiveMode-blur"><strong>Description:</strong> {pkg?.description || 'No description available'}</div>
                    <div className="sensitiveMode-blur"><strong>Date:</strong> {new Date(pkg?._mtime)?.toLocaleString()}</div>
                    <div><strong>Author:</strong> {pkg?.author?.name ? pkg?.author?.name : pkg?.author ? pkg?.author : 'Unknown'}</div>
                    <div>
                        <strong>Packages:</strong> {Object.keys(pkg.dependencies || {}).length + Object.keys(pkg.devDependencies || {}).length}
                        <span
                            className="badge bg-primary ms-2 cursor-pointer"
                            onClick={() => {
                                setActiveProject(pkg);
                            }}
                        >
                            View All
                        </span>
                    </div>
                </div>

                <PackagesPreview
                    dependencies={pkg.dependencies}
                    devDependencies={pkg.devDependencies}
                />

            </div>

            <div className="d-flex flex-wrap mt-2">

                {/* <Button
                    variant="dark"
                    className='border'
                    size="sm"
                    onClick={() => {
                        console.log("pkg", pkg)
                    }}
                >
                    <i className="fad fa-terminal me-0"></i>
                </Button> */}

                <Button
                    variant="dark"
                    className='border'
                    size="sm"
                    onClick={() => {
                        fetch(`/api/audit?path=${encodeURIComponent(pkg._folderPath)}&auditHistory=${auditHistory}`, {
                            method: 'GET',
                            // query: {
                            //     path: pkg._folderPath
                            // }
                        }).then(async (res) => {
                            // const data = await res.json();
                            // console.log("Audit result for", pkg._folderName, data);
                            mutateProjects();
                        })
                    }}
                >
                    Audit
                </Button>

                {pkg["audit-history"] &&
                    <Button
                        variant="dark"
                        className='border'
                        size="sm"
                        onClick={() => {
                            // TODO : Show audit history in ProjectModal
                        }}
                    >
                        <i className="fad fa-history"></i>
                        {pkg["audit-history"] || 0}
                    </Button>
                }

                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Popover id="popover-basic">
                            <Popover.Header as="h3">Open Folder</Popover.Header>
                            <Popover.Body
                                className="py-2"
                            >
                                ...
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <Button
                        variant="dark"
                        className='border'
                        size="sm"
                        onClick={() => {
                            fetch(`/api/open-folder?path=${encodeURIComponent(pkg._folderPath)}`, {
                                method: 'GET',
                                // query: {
                                //     path: pkg._folderPath
                                // }
                            })
                        }}
                    >
                        <i className="fas fa-folder-open"></i>
                        {/* Open Folder */}
                    </Button>
                </OverlayTrigger>

                {/* <Button
                    variant="dark"
                    className='border'
                    size="sm"
                    onClick={() => {
                        fetch(`/api/git/ignore?path=${encodeURIComponent(pkg._folderPath)}`, {
                            method: 'GET',
                            // query: {
                            //     path: pkg._folderPath
                            // }
                        })
                    }}
                >
                    <i className="fas fa-ellipsis-v"></i>
                </Button> */}

                <Dropdown className="mb-0">

                    <Dropdown.Toggle variant='dark border' size="sm" id="dropdown-basic">
                        <i className="fas fa-ellipsis-v"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {[
                            {
                                name: 'Toggle gitignore',
                                action: () => {
                                    fetch(`/api/git/ignore?path=${encodeURIComponent(pkg._folderPath)}`, {
                                        method: 'GET',
                                    }).then(async (res) => {

                                        const data = await res.json();
                                        console.log("Gitignore toggled for", data);

                                        if (data.action === "removed") {
                                            setToastMessage("Removed from .gitignore");
                                            setShowToast(true);
                                        }

                                        if (data.action === "added") {
                                            setToastMessage("Added to .gitignore");
                                            setShowToast(true);
                                        }

                                    })
                                },
                            },
                            {
                                name: 'console.log()',
                                action: () => {
                                    console.log("Project data:", pkg);
                                },
                            },
                            {
                                name: 'Log Diff',
                                action: () => {
                                    fetch(`/api/git/diff?path=${encodeURIComponent(pkg._folderPath)}`, {
                                        method: 'GET',
                                    }).then(async (res) => {
                                        const data = await res.json();
                                        console.log("Audit result for", pkg._folderName, data);
                                    })
                                },
                            },
                            {
                                name: 'Audit Fix',
                                action: () => {
                                    fetch(`/api/audit?path=${encodeURIComponent(pkg._folderPath)}&auditHistory=${auditHistory}&fix=true`, {
                                        method: 'GET',
                                        // query: {
                                        //     path: pkg._folderPath
                                        // }
                                    }).then(async (res) => {
                                        // const data = await res.json();
                                        // console.log("Audit result for", pkg._folderName, data);
                                        // mutateProjects();

                                        // TODO - npm audit fix responds with the new audit results after fixing, so in the future save this on the backend to avoid re-fetching

                                        fetch(`/api/audit?path=${encodeURIComponent(pkg._folderPath)}&auditHistory=${auditHistory}`, {
                                            method: 'GET',
                                            // query: {
                                            //     path: pkg._folderPath
                                            // }
                                        }).then(async (res) => {
                                            // const data = await res.json();
                                            // console.log("Audit result for", pkg._folderName, data);
                                            mutateProjects();
                                        })

                                    })
                                },
                            },
                            {
                                name: 'Push Commit',
                                action: () => {
                                    setCommitPreview(pkg)
                                },
                            },
                            ...pkg?.homepage ? [{
                                name: 'Open Website',
                                action: () => {
                                    // console.log("pkg.homepage", pkg.homepage)
                                    // return
                                    window.open(pkg.homepage, '_blank');
                                },
                            }] : [],
                        ].map((package_obj, i) => {
                            // const isSelected = selectedPackages.includes(package_obj.name);
                            return (
                                <Dropdown.Item
                                    key={`${i}-${package_obj.name}`}
                                    onClick={(e) => {
                                        package_obj.action();
                                    }}
                                    // active={isSelected}
                                    className=""
                                    eventKey={i}
                                >
                                    {/* <i className="fad fa-user" aria-hidden="true"></i> */}
                                    {package_obj.name}
                                </Dropdown.Item>
                            )
                        })}

                    </Dropdown.Menu>

                </Dropdown>

                {/* {pkg?.homepage &&
                    <Button
                        variant="dark"
                        className='border'
                        size="sm"
                        onClick={() => {
                            // console.log("Opening homepage:", pkg.homepage);
                            window.open(pkg.homepage, '_blank');
                        }}
                    >
                        Website
                    </Button>
                } */}

            </div>

            <div
                className="sensitiveMode-blur"
                style={{ marginTop: '10px', fontSize: '0.8em', color: '#888', wordBreak: 'break-all' }}
            >
                {pkg?._folderPath}
            </div>

            {
                pkg["project-manager-details"] &&
                <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#888', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>

                    <div className=""><strong>Last Audit:</strong>
                        <span className="sensitiveMode-blur">
                            {
                                pkg["project-manager-details"]?.last_audit
                                    ? new Date(pkg["project-manager-details"]?.last_audit).toLocaleString()
                                    : 'N/A'
                            }
                        </span>
                    </div>

                    {/* Audit Version */}
                    <div className="mb-1" style={{ fontSize: '0.7rem' }}>
                        <span style={{ color: !equalVersion ? 'red' : 'initial' }}><strong>Version Used:</strong> {pkg["project-manager-details"]?.version_used}</span>
                        {!equalVersion && (
                            <>
                                <span> | </span>
                                <strong>Current Version:</strong> {packageJson?.audit_version}
                            </>
                        )}
                    </div>

                    {
                        (
                            pkg["project-manager-details"]?.audit?.vulnerabilities
                            &&
                            (Object.keys(pkg["project-manager-details"]?.audit?.vulnerabilities)?.length || 0) > 0
                        )
                            ?
                            <div className={`alert py-1 ${pkg["project-manager-details"]?.audit?.metadata?.vulnerabilities?.critical ? 'alert-danger' : 'alert-warning'}`}>
                                <div><strong>Total Alerts Found:</strong> {pkg["project-manager-details"]?.audit?.vulnerabilities ? Object.keys(pkg["project-manager-details"]?.audit?.vulnerabilities).length : 0}</div>
                                <div><strong>Critical Alerts Found</strong> : {pkg["project-manager-details"]?.audit?.metadata?.vulnerabilities?.critical || 0}</div>
                                <div><strong>High Alerts Found</strong> : {pkg["project-manager-details"]?.audit?.metadata?.vulnerabilities?.high || 0}</div>
                                <div><strong>Moderate Alerts Found</strong> : {pkg["project-manager-details"]?.audit?.metadata?.vulnerabilities?.moderate || 0}</div>
                                <div><strong>Low Alerts Found</strong> : {pkg["project-manager-details"]?.audit?.metadata?.vulnerabilities?.low || 0}</div>
                            </div>
                            :
                            <div className="alert alert-success py-1">
                                <div>No vulnerabilities found.</div>
                            </div>
                    }

                </div>
            }

        </div >
    )

}