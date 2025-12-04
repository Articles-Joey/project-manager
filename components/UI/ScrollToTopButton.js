"use client";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="scroll-to-top">
            {isVisible && 
                <Button variant="articles" onClick={scrollToTop} className="scroll-button">
                    <i className="fa fa-arrow-up"></i>
                </Button>
            }
        </div>
    );
}