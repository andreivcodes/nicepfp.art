import "../styles/globals.css";
import { useState, useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  } else {
    return <Component {...pageProps} />;
  }
}
