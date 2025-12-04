"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';

import { useStore } from '@/components/hooks/useStore';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useOsUsername } from '@/components/hooks/useOsUsername';
import LandingModeSections from '@/components/UI/LandingModeSections';


export default function LandingPage() {

    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const { username } = useOsUsername();

    return (

        <div className={`landing-page ${process.env.NEXT_PUBLIC_LANDING_MODE ? '1' : '0'}`}>

            {/* {infoModal &&
                <InfoModal
                    show={infoModal}
                    setShow={setInfoModal}
                />
            } */}

            {/* {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                />
            } */}

            <div className='background-wrap'>
                {/* <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Race Game/background.jpg`}
                    fill
                    alt=""
                    style={{
                        objectFit: 'cover',
                        filter: 'blur(3px)',
                    }}
                /> */}
            </div>

            <div className='container'>

                <div className='hero text-center'>
                    <img
                        src="img/npm-articles.svg"
                        height={100}
                        style={{}}
                        className='mb-3'
                    ></img>
                    <h1 className=''>Node Project Manager</h1>
                    <p>Not to be confused or affiliated with Node Package Manager (NPM).</p>
                </div>

            </div>

            {
                (process.env.NEXT_PUBLIC_LANDING_MODE == "false" || !process.env.NEXT_PUBLIC_LANDING_MODE)
                // true
                &&
                <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

                    <div className="welcome-card card card-articles card-sm" style={{ "width": "20rem" }}>

                        <div className="card-header d-flex align-items-center">

                            Welcome, {username || 'Guest'}!

                        </div>

                        <div className="card-body p-2">

                            <OverlayTrigger placement="right"
                                overlay={
                                    <Popover id="popover-basic">
                                        <Popover.Header as="h3">Projects Page</Popover.Header>
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
                                <Link href="/projects">
                                    <ArticlesButton
                                        className={`w-100 mb-2`}
                                        small
                                        onClick={() => {

                                            // fetch(`/api/projects?path=${`F:\\My Documents\\Sites`}`, { method: 'GET' })

                                        }}
                                    >
                                        <i className='fad fa-house'></i>
                                        View Projects
                                    </ArticlesButton>
                                </Link>
                            </OverlayTrigger>

                            <OverlayTrigger placement="right"
                                overlay={
                                    <Popover id="popover-basic">
                                        <Popover.Header as="h3">Alerts Page</Popover.Header>
                                        <Popover.Body
                                            className="py-2"
                                        >
                                            {/* <div className="mb-1">
                                            <span className='badge bg-success'>
                                                No login required.
                                            </span>
                                        </div> */}
                                            Separate interface to view all alerts across your projects.
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <Link href="/alerts">
                                    <ArticlesButton
                                        className={`w-100 mb-2`}
                                        small
                                        onClick={() => {

                                        }}
                                    >
                                        <i className='fad fa-link'></i>
                                        View Alerts
                                    </ArticlesButton>
                                </Link>
                            </OverlayTrigger>

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowSettingsModal(true)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                Settings
                            </ArticlesButton>

                            <a className='w-50' target='_blank' href='https://github.com/Articles-Joey/project-manager'>
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    GitHub
                                </ArticlesButton>
                            </a>

                        </div>

                    </div>

                </div>
            }

            {/* Landing mode for webpage mode to display info */}
            {process.env.NEXT_PUBLIC_LANDING_MODE === "true" &&
                <LandingModeSections />
            }

        </div >
    );
}