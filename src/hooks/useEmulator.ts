import { useEffect, useState } from "react";

interface ConsoleData {
    ID: number;
    Name: string;
    IconURL: string;
    Active: boolean;
    IsGameSystem: boolean;
}

const useEmulator = () => {
    const [consoles, setConsoles] = useState<ConsoleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_API_KEY_PROFILE;

    useEffect(() => {
        const fetchConsoles = async () => {
            try {
                const response = await fetch(
                    `https://retroachievements.org/API/API_GetConsoleIDs.php?&y=${apiKey}&g=1`
                );
                const data = await response.json();
                setConsoles(data);
            } catch (err) {
                setError('Failed to load consoles');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConsoles();
    }, [apiKey]);

    return {
        consoles,
        loading,
        error,
    };
};

export default useEmulator;
