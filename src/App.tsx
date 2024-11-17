import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import Emulator from './pages/Emulator';
import Loader from './components/Loader';
import { useState, useEffect } from 'react';
const App = () => {
    const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

    useEffect(() => {
        const fadeOutTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2000);

        const hideLoaderTimer = setTimeout(() => {
            document.body.style.overflow = 'visible';
        }, 3000);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(hideLoaderTimer);
        };
    }, []);
    return (
        <Router>
            <div>
                <Loader isFadingOut={isFadingOut} />
                <Routes>
                    <Route path="/" element={<Profile />} />
                    <Route path="/emulator" element={<Emulator />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
