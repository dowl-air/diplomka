"use client";

import { LoadGraphWithProp } from "@/components/Graph";
import NodeDialog from "@/components/NodeDialog";
import { useToAnalyze } from "@/context/ToAnalyze";
import { getDataToSearch } from "@/helpers/getDataToSearch";
import { getModalObj } from "@/helpers/getModalObj";
import { createGraphFromLinkedData } from "@/helpers/linkedDataToGraph";
import { MultiDirectedGraph } from "graphology";
import { get } from "http";
import { useEffect, useState } from "react";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

enum DataState {
    INIT = "init",
    LOADING = "loading",
    ERROR = "error",
    COMPLETE = "complete",
}

const ResultPage = () => {
    const { value: analyzeValue } = useToAnalyze();
    const { setValue } = useToAnalyze();

    const [extractedDataState, setExtractedDataState] = useState<DataState>(DataState.INIT);
    const [extractedData, setExtractedData] = useState<any>(null);

    const [linkedDataState, setLinkedDataState] = useState<DataState>(DataState.INIT);
    const [linkedData, setLinkedData] = useState<any>(null);
    const [linkedDataGraph, setLinkedDataGraph] = useState<any>(null);

    const [currentMessage, setCurrentMessage] = useState<string>("Nothing to scan.");

    const [modalValue, setModalValue] = useState<any>(undefined);
    const [modalId, setModalId] = useState<string>("");

    useEffect(() => {
        setModalValue(getModalObj(linkedData, extractedData, modalId));
    }, [modalId, linkedData, extractedData]);

    useEffect(() => {
        if (!analyzeValue) return;

        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("url", analyzeValue);
        const eventSource = new EventSource(`http://localhost:5000/scan-sse?${urlSearchParams.toString()}`);

        setExtractedDataState(DataState.LOADING);

        eventSource.onmessage = (event) => {
            if (!event.data) {
                setExtractedDataState(DataState.ERROR);
                eventSource.close();
            }

            const data = JSON.parse(event.data);

            if (data.error) {
                setExtractedDataState(DataState.ERROR);
                setCurrentMessage(data.error);
                eventSource.close();
            }

            if (data.message) {
                setCurrentMessage(data.message);
            }

            if (data.result) {
                setExtractedData(data.result);
                setExtractedDataState(DataState.COMPLETE);
            }

            if (data.complete) {
                setExtractedDataState(DataState.COMPLETE);
                eventSource.close();
            }
        };

        eventSource.onerror = () => {
            setExtractedDataState(DataState.ERROR);
            eventSource.close();
        };

        return () => eventSource.close();
    }, [analyzeValue]);

    useEffect(() => {
        const getData = async (q: URLSearchParams) => {
            const response = await fetch(`http://localhost:5000/search?${q.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLinkedData(data);
                setLinkedDataGraph(createGraphFromLinkedData(data));
                setLinkedDataState(DataState.COMPLETE);
            } else {
                setCurrentMessage("Failed to fetch linked data.");
                setLinkedDataState(DataState.ERROR);
            }
        };

        if (!extractedData) return;

        setLinkedDataState(DataState.LOADING);
        const dataToSearch = getDataToSearch(extractedData);
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("q", JSON.stringify(dataToSearch));

        getData(urlSearchParams);
    }, [extractedData]);

    return (
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-2 md:flex-row min-h-[calc(100vh-64px)]">
            <div className="w-full md:max-w-[50%] flex flex-col items-center">
                <h2 className="text-xl self-start">Extracted data</h2>

                {extractedDataState === DataState.COMPLETE && (
                    <>
                        {extractedData && (
                            <div className="w-full mt-4 rounded-md overflow-y-auto max-h-[720px]">
                                <JsonView data={extractedData} shouldExpandNode={allExpanded} style={darkStyles} />
                            </div>
                        )}
                    </>
                )}
                {extractedDataState === DataState.ERROR && <div className="text-error">{currentMessage}</div>}
                {extractedDataState === DataState.INIT && <p className="mt-20">{currentMessage}</p>}
                {extractedDataState === DataState.LOADING && (
                    <>
                        <span className="loading loading-ring w-16 mt-6"></span>
                        <p>{currentMessage}</p>
                    </>
                )}
            </div>

            <div className="divider divider-horizontal"></div>

            <div className="w-full md:max-w-[50%] flex flex-col items-center">
                <h2 className="text-xl self-start">Linked data</h2>
                {linkedDataState === DataState.COMPLETE && (
                    <>
                        {linkedDataGraph && (
                            <div className="w-full mt-4 rounded-md overflow-hidden">
                                <LoadGraphWithProp graph={linkedDataGraph} style={{ width: "600px", height: "720px" }} setModalId={setModalId} />
                                <NodeDialog node={modalValue} />
                            </div>
                        )}
                    </>
                )}
                {linkedDataState === DataState.ERROR && <div className="text-error">{currentMessage}</div>}

                {linkedDataState === DataState.INIT && <p className="mt-20">Waiting for extracted data.</p>}
                {linkedDataState === DataState.LOADING && (
                    <>
                        <span className="loading loading-ring w-16 mt-6"></span>
                        <p>{currentMessage}</p>
                    </>
                )}
            </div>
        </main>
    );
};

export default ResultPage;
