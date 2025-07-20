import { useEffect, useState } from 'react';
import '@/styles/globals.css';
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from '@/components/Loader';

export default function App({ Component, pageProps }) {
   useEffect(() => {
    AOS.init({
      once: true,
      easing: "ease-out-cubic",
      duration: 800,
    });
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <Component {...pageProps} />;
}