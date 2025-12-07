import { Button, OverlayTrigger, Popover } from "react-bootstrap"
import { useStore } from "../hooks/useStore";
import { useProjects } from "../hooks/useProjects";

import packageJson from 'package.json';
import Link from "next/link";

export default function AlertItem({
    alert,
    index: i
}) {

    const setActiveProject = useStore(state => state.setActiveProject);

    // const { mutate: mutateProjects } = useProjects();

    return (
        <div
            style={{
                // border: '1px solid #ccc', 
                // padding: '15px', 
                // borderRadius: '8px', 
                // background: '#222',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            className="card card-articles border shadow-sm p-3"
        >
            <div className="d-flex justify-content-between align-items-start mb-2">

                <h2 style={{ marginTop: 0, fontSize: '1.25rem', wordBreak: 'break-all' }}>
                    {alert.name}
                </h2>

                <span className={`badge bg-${alert.severity === 'critical' ? 'danger' :
                    alert.severity === 'high' ? 'danger' :
                        alert.severity === 'moderate' ? 'warning text-black' :
                            alert.severity === 'low' ? 'secondary' : 'info'
                    }`}>
                    {alert.severity}
                </span>

            </div>

            <div
                className="d-flex"
            >

                <Link
                    href={`/projects?search=${encodeURIComponent(alert.parent_project)}`}
                    style={{
                        display: 'inline'
                    }}
                    onClick={(e) => {
                        // e.preventDefault();
                    }}
                >
                    <i className="fas fa-link"></i>
                </Link>

                <a
                    href=""
                    style={{
                        display: 'inline'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        fetch(`/api/open-folder?path=${encodeURIComponent(alert._folderPath)}`, {
                            method: 'GET',
                            // query: {
                            //     path: pkg._folderPath
                            // }
                        })
                    }}
                >
                    <i className="fas fa-folder"></i>
                </a>

                {/* <a
                    href=""
                    style={{
                        display: 'inline'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                > */}
                    <div className="text-muted mb-2 small">in <strong>{alert.parent_project}</strong></div>
                {/* </a> */}

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {alert.via && Array.isArray(alert.via) && alert.via.map((v, idx) => (
                    typeof v === 'object' ? (
                        <div key={idx} className="small border-top pt-2 mt-1">
                            <div className="fw-bold">{v.title}</div>
                            {v.url && <a href={v.url} target="_blank" rel="noreferrer" className="text-info">More Info</a>}
                        </div>
                    ) : null
                ))}

                <div className="mt-2 small">
                    <strong>Range:</strong> {alert.range}
                </div>
            </div>

            {alert.fixAvailable && (
                <div className="mt-auto">
                    <div className="small text-success">
                        <strong>Fix:</strong> {alert.fixAvailable.name} @ {alert.fixAvailable.version}
                    </div>
                    <Button
                        variant="articles"
                        onClick={() => {
                            setShowSettingsModal(true);
                        }}
                        size="lg"
                        disabled
                        className="w-100"
                    >
                        <i className="fa fa-check me-2"></i>
                        <span>Apply Fix (TODO)</span>
                    </Button>
                </div>
            )}

        </div>
    )

}