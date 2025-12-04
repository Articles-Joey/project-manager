"use client"
import { useEffect } from "react";

// import { useEightBallStore } from "@/hooks/useEightBallStore";
import { useStore } from "../hooks/useStore";

export default function SensitiveModeHandler({ children }) {

    const sensitiveMode = useStore((state) => state.sensitiveMode);

    useEffect(() => {

        if (sensitiveMode) {
            document.body.classList.add("sensitiveMode-active");
        } else {
            document.body.classList.remove("sensitiveMode-active");
        }

    }, [sensitiveMode]);

    return (
        <>
        </>
    );
}
