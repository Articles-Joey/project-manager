"use client";
import { useEffect, useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "../hooks/useStore";

import "styles/components/SettingsModal.scss";

export default function ProjectModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const activeProject = useStore(state => state.activeProject);
    const setActiveProject = useStore(state => state.setActiveProject);

    return (
        <>

            <Modal
                className="articles-modal"
                size='md'
                show={activeProject}
                // To much jumping with little content for now
                centered
                scrollable
                onExited={() => {
                    // setShow(false)
                    setActiveProject(null)
                }}
                onHide={() => {
                    setActiveProject(null)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Project Details</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    {activeProject?.dependencies &&
                        <div className="p-3">
                            <h5>Dependencies</h5>
                            <ul>
                                {Object.entries(activeProject?.dependencies).map(([name, version]) => (
                                    <li key={name}>
                                        {name}: {version}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    {activeProject?.devDependencies &&
                        <div className="p-3">
                            <h5>Dev Dependencies</h5>
                            <ul>
                                {Object.entries(activeProject?.devDependencies).map(([name, version]) => (
                                    <li key={name}>
                                        {name}: {version}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

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

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>

        </>
    )

}