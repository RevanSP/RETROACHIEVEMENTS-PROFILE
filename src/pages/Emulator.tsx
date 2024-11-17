import { Link } from "react-router-dom";  // Import Link from react-router-dom
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import useEmulator from "../hooks/useEmulator"; 

const Emulator = () => {
    const { consoles, loading, error } = useEmulator(); 

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
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {consoles.map((console) => (
                            <Link 
                                key={console.ID} 
                                to={`/emulator/${console.ID}`}  // Link to the emulator detail page
                                className="card bg-base-300 border-2 border-base-100 rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                            >
                                <figure className="px-4 pt-4">
                                    <img
                                        loading="lazy"
                                        src={console.IconURL}
                                        alt={console.Name}
                                        className="w-16 h-16 object-contain transform transition-transform duration-300 ease-in-out hover:rotate-12 active:rotate-6"
                                    />
                                </figure>
                                <div className="card-body p-4 text-center">
                                    <h3 className="text-sm font-medium line-clamp-2">
                                        {console.Name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Emulator;
