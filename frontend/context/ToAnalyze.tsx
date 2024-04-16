"use client";
import { createContext, useState, useContext } from "react";

type AnalyzeValueEnum = "url" | "html";

interface ToAnalyzedContextValue {
    value: string;
    type: AnalyzeValueEnum | null;
    setValue: (value: string) => void;
    setType: (type: "url" | "html") => void;
}

const ToAnalyzeContext = createContext<ToAnalyzedContextValue>({
    value: "",
    type: null,
    setValue: () => {},
    setType: () => {},
});

export function ToAnalyzedProvider({ children }: { children: React.ReactNode }) {
    const [value, setValue] = useState<string>("");
    const [type, setType] = useState<AnalyzeValueEnum | null>(null);

    const state = {
        value,
        setValue,
        type,
        setType,
    };

    return <ToAnalyzeContext.Provider value={state}>{children}</ToAnalyzeContext.Provider>;
}

export function useToAnalyze(): ToAnalyzedContextValue {
    return useContext(ToAnalyzeContext);
}

export default ToAnalyzeContext;
