import { Button, OverlayTrigger, Popover } from "react-bootstrap"
import { useStore } from "../hooks/useStore";

function PackageOverview({ name, pkg }) {
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
                        {/* <div className="mb-1">
                                            <span className='badge bg-success'>
                                                No login required.
                                            </span>
                                        </div> */}
                        View all your projects and their details in one place.
                    </Popover.Body>
                </Popover>
            }
        >

            <div>
                {name === 'React' &&
                    <img width={50} height={50} src={'img/React.svg'}></img>
                }
                {name === 'Next.js' &&
                    <img width={50} height={50} src={'img/Next.js.svg'}></img>
                }
                {name === 'Express' &&
                    <img width={50} height={50} src={'img/Express.svg'}></img>
                }
                {name === 'Three.js' &&
                    <img width={50} height={50} src={'img/Three.js.svg'}></img>
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

    return (
        <div key={pkg._folderPath} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#222' }}>

            <h2 className="sensitiveMode-blur" style={{ marginTop: 0 }}>{pkg?.name || pkg._folderName}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                <div><strong>Version:</strong> {pkg?.version || '?'}</div>
                <div className="sensitiveMode-blur"><strong>Description:</strong> {pkg?.description || 'No description available'}</div>
                <div className="sensitiveMode-blur"><strong>Date:</strong> {new Date(pkg?._mtime)?.toLocaleString()}</div>
                <div><strong>Author:</strong> {pkg?.author?.name ? pkg?.author?.name : pkg?.author ? pkg?.author : 'Unknown'}</div>

                <div className="d-flex">
                    {reactVersion && <PackageOverview
                        name="React"
                        pkg={pkg}
                    />}
                    {nextVersion && <PackageOverview
                        name="Next.js"
                        pkg={pkg}
                    />}
                    {expressVersion && <PackageOverview
                        name="Express"
                        pkg={pkg}
                    />}
                    {threeVersion && <PackageOverview
                        name="Three.js"
                        pkg={pkg}
                    />}
                </div>

            </div>

            <Button
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
                                pkg["project-manager-am-metadata"].last_audit
                                    ? new Date(pkg["project-manager-am-metadata"].last_audit).toLocaleString()
                                    : 'N/A'
                            }
                        </span>
                    </div>
                    <div><strong>Version Used:</strong> {pkg["project-manager-am-metadata"].version_used}</div>
                </div>
            }

        </div>
    )

}