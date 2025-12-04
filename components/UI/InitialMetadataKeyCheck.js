"use client"
import { useEffect } from "react"
import { useStore } from "../hooks/useStore";

export default function InitialMetadataKeyCheck() {

    const _hasHydrated = useStore((state) => state._hasHydrated)
    const metadataKey = useStore((state) => state.metadataKey)
    const setMetadataKey = useStore((state) => state.setMetadataKey)

    useEffect(() => {

        if (!metadataKey && _hasHydrated) {

            fetch('/api/metadata-key')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // useStore.getState().setMetadataKey(data.metadataKey);
                        setMetadataKey(data.metadata_key);
                    }
                });

        }

    }, [metadataKey, _hasHydrated])

    return (
        <>
        </>
    )

}