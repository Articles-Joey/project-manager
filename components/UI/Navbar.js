"use client";
import Link from "next/link";

import packageJson from 'package.json';
import { Button } from "react-bootstrap";
import { useStore } from "../hooks/useStore";

export default function Navbar() {

    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal);

    return (
        <nav style={{
            height: '50px',
            padding: '0px 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#000',
            zIndex: 5
        }}>

            <div className="d-none">
                
            </div>
            
            <Link href="/" style={{ textDecoration: 'none' }} className="d-flex align-items-center">

                <img src="img/npm-articles.svg" height={30} style={{ marginRight: '20px', transform: 'scale(1.5)' }}></img>

                <h6 className="mb-0" style={{ color: '#fff' }}>
                    Project Manager - {packageJson.version}
                </h6>

            </Link>

            <div>
                <Button
                    variant="articles"
                    onClick={() => {
                        setShowSettingsModal(true);
                    }}
                >
                    <i className="fa fa-cog me-0"></i>
                </Button>
            </div>

        </nav>
    );
}