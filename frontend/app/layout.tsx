import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToAnalyzedProvider } from "@/context/ToAnalyze";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Aetheria",
    description: "Aetheria empowers you to manage, visualize, and connect structured data for smarter applications.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ToAnalyzedProvider>
                <body className={inter.className}>
                    <Navbar />
                    {children}
                </body>
            </ToAnalyzedProvider>
        </html>
    );
}
