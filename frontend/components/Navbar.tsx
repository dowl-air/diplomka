import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="bg-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 smn:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center sm:items-stretch justify-start">
                        <Link href="/">
                            <div className="flex-shrink-0 flex items-center">
                                <Image src="/logo.svg" alt="Workflow" width={35} height={35} className="-mt-0.5 w-[35px] h-[35px]" />
                                <span className="text-white ml-2.5 text-2xl font-bold hidden sm:block">Aetheria</span>
                            </div>
                        </Link>

                        <div className="hidden sm:block sm:ml-8">
                            <div className="flex space-x-4">
                                <a
                                    href="/#howto"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    How it works
                                </a>
                                <a
                                    href="/#about"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    About
                                </a>
                                <a href="/#faq" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    FAQ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
