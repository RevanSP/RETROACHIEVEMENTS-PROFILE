import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
const Emulator = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Navbar username="" onUsernameChange={() => { }} onSearchClick={() => { }} isSearching={false} />
                <Hero />
                <main className="flex-grow">
                    <div className="px-6 mx-auto">
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Emulator;
