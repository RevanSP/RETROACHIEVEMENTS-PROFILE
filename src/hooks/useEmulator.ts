import { useEffect, useState } from "react";
import { ConsoleData } from "../types/type";

const useEmulator = () => {
    const [consoles, setConsoles] = useState<ConsoleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    const apiKey = import.meta.env.VITE_API_KEY_PROFILE;

    const retryRequest = async (url: string, retries: number = 3, delay: number = 2000) => {
        let attempts = 0;
        while (attempts < retries) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return await response.json();
                } else {
                    const retryAfter = response.headers.get('Retry-After');
                    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
                    console.warn(`Request failed, retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            } catch (err) {
                if (attempts < retries - 1) {
                    console.error('Request failed, retrying...', err);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw new Error('Request failed after retries');
                }
            }
            attempts++;
        }
    };

    useEffect(() => {
        if (fetched) return;

        const fetchConsoles = async () => {
            setLoading(true);
            const url = `https://retroachievements.org/API/API_GetConsoleIDs.php?&y=${apiKey}&g=1`;

            try {
                const data = await retryRequest(url);
                setFetched(true);
                setError(null);

                let index = 0;
                const interval = setInterval(() => {
                    if (index < data.length) {
                        const newConsole = data[index];

                        if (newConsole?.ID) {
                            setConsoles(prev => {
                                if (!prev.some(console => console.ID === newConsole.ID)) {
                                    return [...prev, newConsole];
                                }
                                return prev;
                            });
                        }

                        index++;
                    } else {
                        clearInterval(interval);
                    }
                }, 1);
            } catch (err) {
                setError('Failed to load consoles');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConsoles();
    }, [apiKey, fetched]);

    return {
        consoles,
        loading,
        error,
    };
};

export default useEmulator;
