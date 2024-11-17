import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import useEmulator from "../hooks/useEmulator";
import AOS from "aos";
import { useEffect, useState } from "react";

const Emulator = () => {
    const { consoles, loading, error } = useEmulator();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredConsoles, setFilteredConsoles] = useState(consoles);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
        });

        AOS.refresh();

        return () => {
            AOS.refresh();
        };
    }, [consoles]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    };

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredConsoles(consoles);
        } else {
            const filtered = consoles.filter(console =>
                console.Name.toLowerCase().includes(searchQuery)
            );
            setFilteredConsoles(filtered);
        }
    }, [searchQuery, consoles]);

    const placeholderText = searchQuery
        ? `Search Console (${filteredConsoles.length})`
        : `Search Console (${consoles.length})`;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar username="" onUsernameChange={() => { }} onSearchClick={() => { }} isSearching={false} />
            <Hero />
            <main className="flex-grow container mx-auto px-4 my-2 -mb-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-error">
                        Error: {error}
                    </div>
                ) : (
                    <>
                        {consoles.length > 0 && (
                            <label className="input input-bordered flex items-center gap-2 mb-4 bg-base-300 border-base-100 border-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="grow"
                                    placeholder={placeholderText}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </label>
                        )}

                        {filteredConsoles.length === 0 && searchQuery !== "" && (
                            <div role="alert" className="alert alert-info mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-info h-6 w-6 shrink-0"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span>No consoles found for "{searchQuery}".</span>
                            </div>
                        )}

                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {filteredConsoles.map((console) => (
                                <div
                                    key={console.ID}
                                    data-aos="fade-up"
                                    className="flex flex-col h-full"
                                >
                                    <div
                                        className="card bg-base-300 border-2 border-base-100 rounded-xl flex-1 transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                                    >
                                        <figure className="px-4 pt-4">
                                            <img
                                                loading="lazy"
                                                src={console.IconURL}
                                                alt={console.Name}
                                                className="w-16 h-16 object-contain transform transition-transform duration-300 ease-in-out hover:rotate-12 active:rotate-6"
                                            />
                                        </figure>
                                        <div className="card-body p-4 text-center flex-grow">
                                            <h3 className="text-sm font-bold line-clamp-2">
                                                {console.Name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Emulator;
