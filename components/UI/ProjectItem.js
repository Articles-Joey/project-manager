import { Button, OverlayTrigger, Popover } from "react-bootstrap"
import { useStore } from "../hooks/useStore";
import { useProjects } from "../hooks/useProjects";

import packageJson from 'package.json';

function PackageOverview({ name, pkg, version }) {
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

            <div>
                {name === 'React' &&
                    <img width={50} height={50} src={'img/package-logos/React.svg'}></img>
                }
                {name === 'Next.js' &&
                    <img width={50} height={50} src={'img/package-logos/Next.js.svg'}></img>
                }
                {name === 'Express' &&
                    <img width={50} height={50} src={'img/package-logos/Express.svg'}></img>
                }
                {name === 'Three.js' &&
                    <img width={50} height={50} src={'img/package-logos/Three.js.svg'}></img>
                }
                {name === 'Vue' &&
                    <img width={50} height={50} src={'img/package-logos/Vue.js.svg'}></img>
                }
                {name === 'Nuxt' &&
                    <img width={50} height={50} src={'img/package-logos/Nuxt.svg'}></img>
                }
                {name === 'Socket.IO' &&
                    <img width={50} height={50} src={'img/package-logos/Socket.IO.svg'}></img>
                }
                {name === 'Gulp' &&
                    <img width={50} height={50} src={'img/package-logos/Gulp.svg'}></img>
                }
            </div>

        </OverlayTrigger>
    )
}

export default function ProjectItem({
    package: pkg,
}) {

    const reactVersion = pkg.dependencies?.react || pkg.devDependencies?.react || false;
    const nextVersion = pkg.dependencies?.next || pkg.devDependencies?.next || false;
    const expressVersion = pkg.dependencies?.express || pkg.devDependencies?.express || false;
    const threeVersion = pkg.dependencies?.three || pkg.devDependencies?.three || false;
    const vueVersion = pkg.dependencies?.vue || pkg.devDependencies?.vue || false;
    const nuxtVersion = pkg.dependencies?.nuxt || pkg.devDependencies?.nuxt || false;
    const socketIoVersion = pkg.dependencies?.['socket.io'] || pkg.devDependencies?.['socket.io'] || false || pkg.dependencies?.['socket.io-client'] || pkg.devDependencies?.['socket.io-client'] || false;
    const gulpVersion = pkg.dependencies?.gulp || pkg.devDependencies?.gulp || false;

    const setActiveProject = useStore(state => state.setActiveProject);

    const { mutate: mutateProjects } = useProjects();

    const equalVersion = pkg["project-manager-am-metadata"]?.version_used === packageJson?.version;

    return (
        <div key={pkg._folderPath} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#222' }}>

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

                <div className="d-flex">
                    {reactVersion && <PackageOverview
                        name="React"
                        pkg={pkg}
                        version={reactVersion}
                    />}
                    {nextVersion && <PackageOverview
                        name="Next.js"
                        pkg={pkg}
                        version={nextVersion}
                    />}
                    {expressVersion && <PackageOverview
                        name="Express"
                        pkg={pkg}
                        version={expressVersion}
                    />}
                    {threeVersion && <PackageOverview
                        name="Three.js"
                        pkg={pkg}
                        version={threeVersion}
                    />}
                    {vueVersion && <PackageOverview
                        name="Vue"
                        pkg={pkg}
                        version={vueVersion}
                    />}
                    {nuxtVersion && <PackageOverview
                        name="Nuxt"
                        pkg={pkg}
                        version={nuxtVersion}
                    />}
                    {socketIoVersion && <PackageOverview
                        name="Socket.IO"
                        pkg={pkg}
                        version={socketIoVersion}
                    />}
                    {gulpVersion && <PackageOverview
                        name="Gulp"
                        pkg={pkg}
                        version={gulpVersion}
                    />}
                </div>

            </div>

            <Button
                variant="dark"
                className='border mt-2'
                onClick={() => {
                    console.log("pkg", pkg)
                }}
            >
                <i className="fad fa-terminal me-0"></i>
            </Button>
            <Button
                variant="dark"
                className='border mt-2'
                onClick={() => {
                    fetch(`/api/audit?path=${encodeURIComponent(pkg._folderPath)}`, {
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
            {pkg?.homepage &&
                <Button
                    variant="dark"
                    className='border mt-2'
                    onClick={() => {
                        // console.log("Opening homepage:", pkg.homepage);
                        window.open(pkg.homepage, '_blank');
                    }}
                >
                    Website
                </Button>
            }

            <div
                className="sensitiveMode-blur"
                style={{ marginTop: '10px', fontSize: '0.8em', color: '#888', wordBreak: 'break-all' }}
            >
                {pkg?._folderPath}
            </div>

            {pkg["project-manager-am-metadata"] &&
                <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#888', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>

                    <div className=""><strong>Last Audit:</strong>
                        <span className="sensitiveMode-blur">
                            {
                                pkg["project-manager-am-metadata"]?.audit?.last_audit
                                    ? new Date(pkg["project-manager-am-metadata"]?.audit?.last_audit).toLocaleString()
                                    : 'N/A'
                            }
                        </span>
                    </div>

                    {/* Audit Version */}
                    <div className="mb-1" style={{ fontSize: '0.7rem'}}>
                        <span style={{ color: !equalVersion ? 'red' : 'initial' }}><strong>Version Used:</strong> {pkg["project-manager-am-metadata"]?.version_used}</span>
                        {!equalVersion && (
                            <>
                                <span> | </span>
                                <strong>Current Version:</strong> {packageJson?.version}
                            </>
                        )}
                    </div>

                    <div><strong>Total Alerts Found:</strong> {pkg["project-manager-am-metadata"]?.audit?.vulnerabilities ? Object.keys(pkg["project-manager-am-metadata"]?.audit?.vulnerabilities).length : 0}</div>
                    <div><strong>Critical Alerts Found</strong> : {pkg["project-manager-am-metadata"]?.audit?.metadata?.vulnerabilities?.critical || 0}</div>
                    <div><strong>High Alerts Found</strong> : {pkg["project-manager-am-metadata"]?.audit?.metadata?.vulnerabilities?.high || 0}</div>
                    <div><strong>Moderate Alerts Found</strong> : {pkg["project-manager-am-metadata"]?.audit?.metadata?.vulnerabilities?.moderate || 0}</div>
                    <div><strong>Low Alerts Found</strong> : {pkg["project-manager-am-metadata"]?.audit?.metadata?.vulnerabilities?.low || 0}</div>

                </div>
            }

        </div>
    )

}