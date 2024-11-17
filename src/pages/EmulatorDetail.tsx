import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface ConsoleDetails {
  ID: number;
  Name: string;
  IconURL: string;
  Active: boolean;
  IsGameSystem: boolean;
  Developer?: string;
  Manufacturer?: string;
  ReleaseDate?: string;
  ReleaseYear?: number;
  GameCount?: number;
}

interface ApiResponse {
  Error?: string;
  Success?: boolean;
  Details?: ConsoleDetails;
}

const EmulatorDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [consoleData, setConsoleData] = useState<ConsoleDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const apiKey = import.meta.env.VITE_API_KEY_PROFILE;

    useEffect(() => {
        const fetchConsoleDetail = async () => {
            if (!id) {
                setError('No console ID provided');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://retroachievements.org/API/API_GetConsoleDetails.php?z=${id}&y=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (data.Error) {
                    setError(data.Error);
                } else if (data.Details) {
                    setConsoleData(data.Details);
                } else {
                    setError('Invalid response format');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load console details');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConsoleDetail();
    }, [id, apiKey]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar 
                    username="" 
                    onUsernameChange={() => {}} 
                    onSearchClick={() => {}} 
                    isSearching={false} 
                />
                <main className="flex-grow container mx-auto px-4 my-2 mt-24 -mb-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar 
                    username="" 
                    onUsernameChange={() => {}} 
                    onSearchClick={() => {}} 
                    isSearching={false} 
                />
                <main className="flex-grow container mx-auto px-4 my-2 mt-24 -mb-4">
                    <div className="flex justify-center items-center h-64 text-error">
                        Error: {error}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar 
                username="" 
                onUsernameChange={() => {}} 
                onSearchClick={() => {}} 
                isSearching={false} 
            />
            <main className="flex-grow container mx-auto px-4 my-2 mt-24 -mb-4">
                {consoleData && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">{consoleData.Name}</h2>
                        <img 
                            src={consoleData.IconURL} 
                            alt={consoleData.Name} 
                            className="w-32 h-32 object-contain mx-auto mb-8" 
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                            {consoleData.Developer && (
                                <div className="p-4 bg-base-200 rounded-lg">
                                    <h3 className="font-semibold">Developer</h3>
                                    <p>{consoleData.Developer}</p>
                                </div>
                            )}
                            {consoleData.Manufacturer && (
                                <div className="p-4 bg-base-200 rounded-lg">
                                    <h3 className="font-semibold">Manufacturer</h3>
                                    <p>{consoleData.Manufacturer}</p>
                                </div>
                            )}
                            {consoleData.ReleaseYear && (
                                <div className="p-4 bg-base-200 rounded-lg">
                                    <h3 className="font-semibold">Release Year</h3>
                                    <p>{consoleData.ReleaseYear}</p>
                                </div>
                            )}
                            {consoleData.GameCount && (
                                <div className="p-4 bg-base-200 rounded-lg">
                                    <h3 className="font-semibold">Total Games</h3>
                                    <p>{consoleData.GameCount.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default EmulatorDetail;