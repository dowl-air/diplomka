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

            <h2 className="text-3xl font-bold text-gray-800 text-center mt-16" id="howto">
                How it works
            </h2>

            <div className="flex flex-row flex-wrap justify-center gap-5 py-16">
                <div className="max-w-[320px]">
                    <h3 className="text-2xl font-bold text-gray-800">Step 1: Enter a URL</h3>
                    <p className="text-lg text-gray-600 mt-2">
                        Enter the URL of a website you want to analyze. Our tool will fetch structured data and display it.
                    </p>
                </div>

                <div className="max-w-[320px]">
                    <h3 className="text-2xl font-bold text-gray-800">Step 2: Analyze the Data</h3>
                    <p className="text-lg text-gray-600 mt-2">
                        The data will used to search for Linked data on DBPedia and WikiData, making it easier to understand and analyze the
                        information.
                    </p>
                </div>

                <div className="max-w-[320px]">
                    <h3 className="text-2xl font-bold text-gray-800">Step 3: Gain Insights</h3>
                    <p className="text-lg text-gray-600 mt-2">
                        Use the results to gain insights and make informed decisions based on the information on analyzed website.
                    </p>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mt-16" id="faq">
                Frequently Asked Questions
            </h2>

            <div className="flex flex-row flex-wrap justify-center gap-3 py-16">
                <div className="faq-card max-w-[320px]">
                    <h3 className="text-2xl font-bold text-gray-800">What is Linked Data?</h3>
                    <p className="text-lg text-gray-600 mt-2">
                        Linked data is a method of publishing structured data so that it can be interlinked and become more useful through semantic
                        queries.
                    </p>
                </div>

                <div className="faq-card max-w-[320px]">
                    <h3 className="text-2xl font-bold text-gray-800">What is RDF?</h3>
                    <p className="text-lg text-gray-600 mt-2">
                        RDF stands for Resource Description Framework, a standard model for data interchange on the Web.
                    </p>
                </div>

                <div className="faq-card max-w-[320px]">
                    <h3 className="text-2xl font-bold text-gray-800">What is a JSON-LD?</h3>
                    <p className="text-lg text-gray-600 mt-2">JSON-LD is a lightweight Linked Data format that is easy to read and write.</p>
                </div>
            </div>
        </div>
    );
}
