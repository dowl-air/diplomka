"use client";

import { FC, CSSProperties, useEffect } from "react";
import { MultiDirectedGraph } from "graphology";

import { ControlsContainer, FullScreenControl, SearchControl, SigmaContainer, useRegisterEvents, ZoomControl } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";

const GraphEvents = ({ setModalId }: { setModalId: (node: string) => void }) => {
    const registerEvents = useRegisterEvents();

    useEffect(() => {
        registerEvents({
            clickNode: (event) => {
                if (!document) return;
                setModalId(event.node);
                (document.getElementById("node-modal") as HTMLDialogElement).showModal();
            },
        });
    }, [registerEvents, setModalId]);

    return null;
};

const Fa2: FC = () => {
    const { start, kill } = useWorkerLayoutForceAtlas2({ settings: { slowDown: 10, adjustSizes: true } });

    useEffect(() => {
        start();

        const timeoutId = setTimeout(() => {
            kill();
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
            kill(); // Ensure kill is called even if timeout hasn't fired yet
        };
    }, [start, kill]);

    return null;
};

export const LoadGraphWithProp: FC<{ style: CSSProperties; graph: MultiDirectedGraph; setModalId: (node: string) => void }> = ({
    style,
    graph,
    setModalId,
}) => {
    return (
        <>
            <SigmaContainer style={style} graph={graph} settings={{ allowInvalidContainer: true }}>
                <Fa2 />
                <GraphEvents setModalId={setModalId} />
                <ControlsContainer position={"bottom-right"}>
                    <ZoomControl />
                    <FullScreenControl />
                </ControlsContainer>
                <ControlsContainer position={"top-right"}>
                    <SearchControl style={{ width: "200px" }} />
                </ControlsContainer>
            </SigmaContainer>
        </>
    );
};
