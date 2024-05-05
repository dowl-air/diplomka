"use client";
import { useToAnalyze } from "@/context/ToAnalyze";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AnalyzeForm = () => {
    const [formType, setFormType] = useState<"url" | "html">("url");

    const { setValue, setType } = useToAnalyze();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = formData.get("url") as string;
        setValue(url);
        setType("url");
        router.push("/result");
    };

    const handleFormTypeChange = () => {
        setFormType(formType === "url" ? "html" : "url");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row w-full gap-2.5 sm:gap-4 max-w-lg">
                <input
                    type="text"
                    className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="Enter your URL"
                    name="url"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-700 text-white text-lg whitespace-nowrap rounded-md hover:bg-indigo-900">
                    Analyze Now!
                </button>
            </div>
        </form>
    );
};

export default AnalyzeForm;
