import AnalyzeForm from "@/components/ToAnalyzeForm";

export default function Home() {
    return (
        <div className="flex flex-col bg-gray-100">
            <div className="flex flex-col justify-center items-center py-16 sm:py-32 bg-gradient-to-r from-blue-500 to-indigo-500">
                <h1 className="text-3xl md:text-5xl font-bold text-white text-center">Connect the Dots.</h1>
                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 text-center">Supercharge Your Insights.</h2>
                <p className="text-xl sm:text-2xl text-gray-100 text-center mt-8 sm:mt-16">
                    Paste your website URL below to see how linked data can transform your information:
                </p>

                <AnalyzeForm />
            </div>
        </div>
    );
}
