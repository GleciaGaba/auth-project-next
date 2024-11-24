// src/pages/Home.js
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: 'url("/img/depression.webp")' }}
    >
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-large font-cinzel text-white bg-gray-900 bg-opacity-50 font-bold px-8 py-4">
          <h1>
            Venez partager avec nous vos inquiétudes face à la possibilité de
            perdre votre emploi à cause de l'intelligence artificielle.
          </h1>
          {error && (
            <div className="mt-4 text-red-500">
              <p>Error fetching data: {error}</p>
            </div>
          )}
          {data && (
            <div className="mt-4">
              <p>Data from API:</p>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
