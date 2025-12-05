import { useEffect, useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "../hooks/useStore";

import "styles/components/SettingsModal.scss";
import { set } from "date-fns";

export default function SettingsModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    // const [tab, setTab] = useState('UI')
    const [newFolder, setNewFolder] = useState('')

    const socketServerHost = useStore((state) => state.socketServerHost);
    const setSocketServerHost = useStore((state) => state.setSocketServerHost);
    const reset = useStore((state) => state.reset);

    const darkMode = useStore((state) => state.darkMode);
    const toggleDarkMode = useStore((state) => state.toggleDarkMode);

    const sensitiveMode = useStore((state) => state.sensitiveMode);
    const toggleSensitiveMode = useStore((state) => state.toggleSensitiveMode);

    const metadataKey = useStore((state) => state.metadataKey)
    const setMetadataKey = useStore((state) => state.setMetadataKey)

    const additionalFolderLocations = useStore((state) => state.additionalFolderLocations)
    const setAdditionalFolderLocations = useStore((state) => state.setAdditionalFolderLocations)

    const settingsTab = useStore((state) => state.settingsTab)
    const setSettingsTab = useStore((state) => state.setSettingsTab)

    const auditHistory = useStore((state) => state.auditHistory)
    const toggleAuditHistory = useStore((state) => state.toggleAuditHistory)

    return (
        <>

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>App Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'UI',
                            'Folders',
                            'Notifications',
                            'Audits',
                            'Other'
                        ].map(item =>
                            <ArticlesButton
                                key={item}
                                active={settingsTab == item}
                                onClick={() => {
                                    setSettingsTab(item)
                                }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">

                        {settingsTab == 'UI' &&
                            <div className="mx-4 pt-3">

                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="switch"
                                            id="dark-mode-switch"
                                            label="Dark Mode"
                                            // value={enabled}
                                            checked={darkMode}
                                            onChange={() => {
                                                toggleDarkMode();
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">
                                        {`Dark Mode changes the game's color scheme to be easier on the eyes in low light environments.`}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="switch"
                                            id="sensitive-mode-switch"
                                            label="Sensitive Mode"
                                            // value={enabled}
                                            checked={sensitiveMode}
                                            onChange={() => {
                                                toggleSensitiveMode();
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">
                                        {`Sensitive Mode blurs data for privacy. Used for taking preview photos or streaming.`}
                                    </div>
                                </div>

                            </div>
                        }

                        {settingsTab == 'Folders' &&
                            <div className="p-3">

                                <div className="mb-3">
                                    <label className="form-label">Additional Folder Locations</label>
                                    <div className="d-flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter folder path"
                                            value={newFolder}
                                            onChange={(e) => setNewFolder(e.target.value)}
                                        />
                                        <ArticlesButton
                                            onClick={() => {
                                                if (newFolder && !additionalFolderLocations.includes(newFolder)) {
                                                    setAdditionalFolderLocations([...(additionalFolderLocations || []), newFolder]);
                                                    setNewFolder('');
                                                }
                                            }}
                                        >
                                            Add
                                        </ArticlesButton>
                                    </div>

                                    <div className="list-group">
                                        {additionalFolderLocations?.map((folder, index) => (
                                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span className="text-break me-2">{folder}</span>
                                                <ArticlesButton
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newFolders = additionalFolderLocations.filter((_, i) => i !== index);
                                                        setAdditionalFolderLocations(newFolders);
                                                    }}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </ArticlesButton>
                                            </div>
                                        ))}
                                        {(!additionalFolderLocations || additionalFolderLocations.length === 0) && (
                                            <div className="text-muted small">No additional folders added.</div>
                                        )}
                                    </div>
                                </div>

                                <ArticlesButton
                                    onClick={() => {
                                        window.location.reload();
                                    }}
                                >
                                    Reload Window
                                </ArticlesButton>

                                <div className="small">Window reload required to apply changes to folder locations.</div>

                            </div>
                        }

                        {settingsTab == 'Notifications' &&
                            <div className="p-3">
                                TODO - Manage notifications of packages
                            </div>
                        }

                        {settingsTab == 'Audits' &&
                            <div className="p-3">

                                <div className="mx-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="switch"
                                            id="audit-history-switch"
                                            label="Audit History"
                                            // value={enabled}
                                            checked={auditHistory}
                                            onChange={() => {
                                                toggleAuditHistory();
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">
                                        {`Audit History keeps track of past audits and their results for reference. Stores in a separate file at project-manager-am-audit-history.json.`}
                                    </div>
                                </div>

                            </div>
                        }

                        {settingsTab == 'Other' &&
                            <div className="p-3">

                                {/* <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Metadata Key"
                                    value={metadataKey}
                                    onChange={(e) => {
                                        setMetadataKey(e.target.value)
                                    }}
                                >
                                </input> */}

                            </div>
                        }

                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}


                    <div>

                        <ArticlesButton
                            variant="outline-dark"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Close
                        </ArticlesButton>

                        <ArticlesButton
                            variant="outline-danger ms-3"
                            onClick={() => {
                                reset()
                                // setShow(false)
                            }}
                        >
                            Reset
                        </ArticlesButton>

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>

        </>
    )

}